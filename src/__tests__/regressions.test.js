import {
  readSession,
  publicUser,
  roleOf,
  dashboardFor,
} from "../utils/session";
import { auth, firestore } from "../APIS/config";
import {
  updateUser,
  updateConnection,
  registerUser,
  addUpdate,
  deleteUser,
} from "../APIS";
jest.mock("../APIS/config", () => ({
  auth: { currentUser: { uid: "player" }, signOut: jest.fn() },
  firestore: {
    collection: jest.fn(),
    runTransaction: jest.fn(),
    batch: jest.fn(),
  },
  storageRef: {},
}));
let records, patches, committed;
const refs = {};
beforeEach(() => {
  jest.clearAllMocks();
  sessionStorage.clear();
  auth.currentUser = {
    uid: "player",
    updatePassword: jest.fn().mockResolvedValue(),
  };
  records = {
    player: {
      docId: "player",
      name: "Player",
      occupation: "Player",
      trainers: [],
      doctors: [],
    },
    trainer: {
      docId: "trainer",
      name: "Trainer",
      occupation: "Trainer",
      players: [],
    },
    doctor: {
      docId: "doctor",
      name: "Doctor",
      occupation: "Doctor",
      players: [],
    },
  };
  patches = [];
  committed = [];
  firestore.collection.mockImplementation((collection) => ({
    doc: (id = "generated-id") => {
      const ref = {
        id,
        collection,
        get: jest.fn(async () => ({
          exists: !!records[id],
          data: () => records[id],
        })),
        update: jest.fn(async (patch) => {
          records[id] = { ...records[id], ...patch };
        }),
        set: jest.fn().mockResolvedValue(),
      };
      refs[id] = ref;
      return ref;
    },
    get: async () => ({
      docs: Object.entries(records).map(([id, data]) => ({
        id,
        data: () => data,
      })),
    }),
  }));
  firestore.runTransaction.mockImplementation(async (callback) => {
    const transaction = {
      get: async (ref) => ({
        exists: !!records[ref.id],
        data: () => records[ref.id],
      }),
      update: (ref, data) => patches.push([ref.id, data]),
    };
    const result = await callback(transaction);
    for (const [id, data] of patches) records[id] = { ...records[id], ...data };
    return result;
  });
  firestore.batch.mockImplementation(() => ({
    set: (ref, data) => committed.push(["set", ref, data]),
    update: (ref, data) => committed.push(["update", ref, data]),
    delete: (ref) => committed.push(["delete", ref]),
    commit: jest.fn().mockResolvedValue(),
  }));
});
test("corrupted saved sessions recover without crashing", () => {
  sessionStorage.setItem("spms-user", "{bad");
  expect(readSession("spms-user")).toBeNull();
  expect(sessionStorage.getItem("spms-user")).toBeNull();
});
test("passwords are stripped from returned profiles", () => {
  expect(
    publicUser({ name: "A", password: "secret", confirmPassword: "secret" }),
  ).toEqual({ name: "A" });
});
test("unknown roles never get a dashboard", () => {
  expect(roleOf({ occupation: "NotDoctor" })).toBeNull();
  expect(dashboardFor({ occupation: "Trainer" })).toBe("/trainer/dashboard");
});
test("updating another profile does not replace the active session", async () => {
  sessionStorage.setItem("spms-user", JSON.stringify(records.player));
  await updateUser({ players: ["player"] }, "doctor");
  expect(JSON.parse(sessionStorage.getItem("spms-user")).docId).toBe("player");
});
test("updating own profile refreshes the session and public directory", async () => {
  await updateUser({ name: "Updated" }, "player");
  expect(JSON.parse(sessionStorage.getItem("spms-user")).name).toBe("Updated");
  expect(refs.player.collection).toBe("directory");
});
test("password changes use Firebase Auth without persisting passwords", async () => {
  await updateUser({ password: "new-pass" }, "player");
  expect(auth.currentUser.updatePassword).toHaveBeenCalledWith("new-pass");
  expect(records.player.password).toBeUndefined();
});
test("password changes for other users are rejected", async () => {
  await expect(updateUser({ password: "new-pass" }, "doctor")).rejects.toThrow(
    "own password",
  );
});
test("adding a trainer writes both sides atomically without duplicates", async () => {
  await updateConnection("player", "trainer", "Trainer", "add");
  expect(patches).toHaveLength(2);
  expect(records.player.trainers[0]).toEqual({
    userId: "trainer",
    isConfirmed: false,
    viewHealthData: false,
  });
  expect(records.trainer.players[0].userId).toBe("player");
  patches = [];
  await updateConnection("player", "trainer", "Trainer", "add");
  expect(records.player.trainers).toHaveLength(1);
  expect(records.trainer.players).toHaveLength(1);
});
test("trainer confirmation preserves player sharing choice on both profiles", async () => {
  await updateConnection("player", "trainer", "Trainer", "add");
  patches = [];
  await updateConnection("player", "trainer", "Trainer", "grant");
  patches = [];
  auth.currentUser.uid = "trainer";
  await updateConnection("player", "trainer", "Trainer", "confirm");
  expect(records.player.trainers[0]).toMatchObject({
    isConfirmed: true,
    viewHealthData: true,
  });
  expect(records.trainer.players[0]).toMatchObject({
    isConfirmed: true,
    viewHealthData: true,
  });
});
test("removing a trainer revokes the relationship on both profiles", async () => {
  await updateConnection("player", "trainer", "Trainer", "add");
  patches = [];
  await updateConnection("player", "trainer", "Trainer", "remove");
  expect(records.player.trainers).toEqual([]);
  expect(records.trainer.players).toEqual([]);
});
test("doctor connection is deduplicated on both profiles", async () => {
  await updateConnection("player", "doctor", "Doctor", "add");
  patches = [];
  await updateConnection("player", "doctor", "Doctor", "add");
  expect(records.player.doctors).toEqual(["doctor"]);
  expect(records.doctor.players).toEqual(["player"]);
});
test("unauthorized relationship changes fail before any writes", async () => {
  auth.currentUser.uid = "stranger";
  await expect(
    updateConnection("player", "trainer", "Trainer", "grant"),
  ).rejects.toThrow("cannot change");
  expect(firestore.runTransaction).not.toHaveBeenCalled();
});
test("failed transaction does not make partial updates", async () => {
  delete records.trainer;
  await expect(
    updateConnection("player", "trainer", "Trainer", "add"),
  ).rejects.toThrow("no longer available");
  expect(patches).toEqual([]);
  expect(records.player.trainers).toEqual([]);
});
test("announcements return the actual Firestore document id", async () => {
  const result = await addUpdate({ text: "Hello" });
  expect(result.docId).toBe("generated-id");
  expect(refs["generated-id"].set).toHaveBeenCalledWith(
    expect.objectContaining({ docId: "generated-id" }),
  );
});
test("registration rejects mismatched passwords before creating an account", async () => {
  await expect(
    registerUser({
      password: "12345678",
      confirmPassword: "wrong",
      occupation: "Player",
    }),
  ).rejects.toThrow("Passwords must match");
});
test("removing a profile cleans up reciprocal links in the same batch", async () => {
  records.doctor.players = ["player"];
  records.trainer.players = [{ userId: "player", isConfirmed: true }];
  await deleteUser("player");
  expect(committed.filter(([kind]) => kind === "update")).toHaveLength(2);
  expect(committed.filter(([kind]) => kind === "delete")).toHaveLength(2);
});
test("age respects the birthday rather than dividing by an approximate year", () => {
  const { ageFromDate } = require("../utils/session");
  expect(ageFromDate("2000-10-22", new Date("2026-10-21T12:00:00"))).toBe("25");
  expect(ageFromDate("2000-10-21", new Date("2026-10-21T12:00:00"))).toBe("26");
  expect(ageFromDate("2027-01-01", new Date("2026-10-21"))).toBe("");
});
test("feedback rejects a trainer without confirmed shared access", async () => {
  const { addTrainerFeedbackIntoDB } = require("../APIS");
  auth.currentUser.uid = "trainer";
  await expect(
    addTrainerFeedbackIntoDB("Helpful feedback", "player"),
  ).rejects.toThrow("do not have access");
});
test("feedback rejects whitespace before accessing the database", async () => {
  const { addFeedbackIntoDB } = require("../APIS");
  await expect(addFeedbackIntoDB("   ", "player")).rejects.toThrow(
    "Enter your feedback",
  );
  expect(firestore.collection).not.toHaveBeenCalled();
});
