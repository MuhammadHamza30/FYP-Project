import firebase from "firebase/compat/app";
import { auth, firestore, storageRef } from "./config";
import { ageFromDate, publicUser } from "../utils/session";
const list = (snapshot) =>
  snapshot.docs.map((doc) => ({ ...publicUser(doc.data()), docId: doc.id }));
const directoryProfile = (data) =>
  Object.fromEntries(
    [
      "name",
      "image",
      "occupation",
      "level",
      "experience",
      "achivement",
      "specialization",
      "clinicAddress",
      "clinicTiming",
      "weekend",
      "clinicPhoneNumber",
    ]
      .filter((key) => data[key] !== undefined)
      .map((key) => [key, data[key]]),
  );
export const uploadFile = async (image) => {
  if (
    !image ||
    !["image/jpeg", "image/png", "image/webp"].includes(image.type) ||
    image.size > 5 * 1024 * 1024
  )
    throw new Error("Choose a JPG, PNG, or WebP image under 5 MB.");
  const ref = storageRef.ref(
    `spms/${auth.currentUser?.uid || "registration"}/${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );
  return (await ref.put(image)).ref.getDownloadURL();
};
export const loginAdmin = async ({ email, password }) => {
  const result = await auth.signInWithEmailAndPassword(email.trim(), password);
  const record = await firestore.collection("Admin").doc(result.user.uid).get();
  if (!record.exists) {
    await auth.signOut();
    throw new Error("This account does not have administrator access.");
  }
  sessionStorage.removeItem("spms-user");
  sessionStorage.setItem(
    "spms-admin",
    JSON.stringify({ isAuthenticated: true, uid: result.user.uid }),
  );
  return true;
};
export const loginUser = async ({ email, password }) => {
  const result = await auth.signInWithEmailAndPassword(email.trim(), password);
  const profile = await getUser(result.user.uid);
  if (
    !profile ||
    !["Player", "Trainer", "Doctor"].includes(profile.occupation)
  ) {
    await auth.signOut();
    throw new Error(
      "No player, trainer, or doctor profile is linked to this account. Contact your administrator.",
    );
  }
  sessionStorage.removeItem("spms-admin");
  sessionStorage.setItem("spms-user", JSON.stringify(profile));
  return profile;
};
export const registerUser = async (values) => {
  const { password, confirmPassword, imageFile, ...data } = values;
  if (password !== confirmPassword) throw new Error("Passwords must match.");
  if (!["Player", "Trainer", "Doctor"].includes(data.occupation))
    throw new Error("Choose an account type.");
  const result = await auth.createUserWithEmailAndPassword(
    data.email.trim(),
    password,
  );
  const ref = firestore.collection("users").doc(result.user.uid);
  const profile = {
    ...data,
    email: data.email.trim(),
    age: ageFromDate(data.dob),
    docId: ref.id,
    trainers: [],
    doctors: [],
    players: [],
    trainerFeedbacks: [],
    doctorFeedbacks: [],
    healthRecords: [],
  };
  try {
    if (imageFile) profile.image = await uploadFile(imageFile);
    const batch = firestore.batch();
    batch.set(ref, profile);
    batch.set(
      firestore.collection("directory").doc(ref.id),
      directoryProfile(profile),
    );
    await batch.commit();
  } catch (error) {
    await result.user.delete().catch(() => {});
    throw error;
  }
  await auth.signOut();
  return true;
};
export const updateUser = async (data, id) => {
  const { password, confirmPassword, ...safe } = data;
  if (password) {
    if (auth.currentUser?.uid !== id)
      throw new Error("You can only change your own password.");
    await auth.currentUser.updatePassword(password);
  }
  const ref = firestore.collection("users").doc(id);
  if (Object.keys(safe).length) await ref.update(safe);
  const profile = publicUser((await ref.get()).data());
  if (auth.currentUser?.uid === id) {
    await firestore
      .collection("directory")
      .doc(id)
      .set(directoryProfile(profile), { merge: true });
    sessionStorage.setItem("spms-user", JSON.stringify(profile));
  }
  return profile;
};
export const getUser = async (id) => {
  if (!id) throw new Error("A player must be selected.");
  const doc = await firestore.collection("users").doc(id).get();
  return doc.exists ? { ...publicUser(doc.data()), docId: doc.id } : null;
};
export const getUsers = async () =>
  list(await firestore.collection("users").get());
export const getDirectory = async () =>
  list(await firestore.collection("directory").get());
export const getUpdates = async () =>
  list(await firestore.collection("updates").get());
export const getTournments = async () =>
  list(await firestore.collection("tournments").get());
export const addUpdate = async (data) => {
  const ref = firestore.collection("updates").doc();
  const record = {
    ...data,
    docId: ref.id,
    createdAt: new Date().toISOString(),
  };
  await ref.set(record);
  return record;
};
export const deleteUpdate = (id) =>
  firestore.collection("updates").doc(id).delete();
export const addTournment = async (data) => {
  const ref = firestore.collection("tournments").doc();
  const record = {
    ...data,
    image: data.image?.size ? await uploadFile(data.image) : data.image,
    docId: ref.id,
    createdAt: new Date().toISOString(),
  };
  await ref.set(record);
  return record;
};
export const deleteTournment = (id) =>
  firestore.collection("tournments").doc(id).delete();
export const addPrompt = async (data) => {
  const ref = firestore.collection("prompts").doc();
  const record = {
    ...data,
    docId: ref.id,
    createdAt: new Date().toISOString(),
  };
  await ref.set(record);
  return record;
};
export const getPrompts = async (userId) =>
  list(
    await firestore.collection("prompts").where("userId", "==", userId).get(),
  ).sort((a, b) => (a.createdAt || "").localeCompare(b.createdAt || ""));
const addFeedback = async (text, id, role) => {
  const message = text.trim();
  if (!message) throw new Error("Enter your feedback.");
  const sender = await getUser(auth.currentUser?.uid);
  const player = await getUser(id);
  const allowed =
    role === "Doctor"
      ? player?.doctors?.includes(sender?.docId)
      : player?.trainers?.some(
          (item) =>
            item.userId === sender?.docId &&
            item.isConfirmed &&
            item.viewHealthData,
        );
  if (sender?.occupation !== role || !allowed)
    throw new Error("You do not have access to this player.");
  await firestore
    .collection("users")
    .doc(id)
    .update({
      [role === "Doctor" ? "doctorFeedbacks" : "trainerFeedbacks"]:
        firebase.firestore.FieldValue.arrayUnion(message),
    });
};
export const addTrainerFeedbackIntoDB = (text, id) =>
  addFeedback(text, id, "Trainer");
export const addFeedbackIntoDB = (text, id) => addFeedback(text, id, "Doctor");
// Both sides of a relationship are committed together; retries read fresh arrays.
export const updateConnection = async (
  playerId,
  professionalId,
  role,
  action,
) => {
  const actor = auth.currentUser?.uid;
  if (
    !["Trainer", "Doctor"].includes(role) ||
    !["add", "remove", "grant", "confirm"].includes(action)
  )
    throw new Error("Invalid connection action.");
  if (
    action === "confirm"
      ? actor !== professionalId
      : actor !== playerId && !(action === "remove" && actor === professionalId)
  )
    throw new Error("You cannot change this connection.");
  const playerRef = firestore.collection("users").doc(playerId),
    proRef = firestore.collection("users").doc(professionalId);
  return firestore.runTransaction(async (transaction) => {
    const playerDoc = await transaction.get(playerRef),
      proDoc = await transaction.get(proRef);
    if (!playerDoc.exists || !proDoc.exists)
      throw new Error("This profile is no longer available.");
    const player = playerDoc.data(),
      pro = proDoc.data();
    if (player.occupation !== "Player" || pro.occupation !== role)
      throw new Error("Invalid account types.");
    if (role === "Doctor") {
      const doctors = new Set(player.doctors || []),
        players = new Set(pro.players || []);
      if (action === "remove") {
        doctors.delete(professionalId);
        players.delete(playerId);
      } else if (action === "add") {
        doctors.add(professionalId);
        players.add(playerId);
      } else throw new Error("Invalid doctor action.");
      transaction.update(playerRef, { doctors: [...doctors] });
      transaction.update(proRef, { players: [...players] });
    } else {
      let trainers = player.trainers || [],
        players = pro.players || [];
      const existing = trainers.find((item) => item.userId === professionalId);
      if (action === "remove") {
        trainers = trainers.filter((item) => item.userId !== professionalId);
        players = players.filter((item) => item.userId !== playerId);
      } else {
        if (!existing && action !== "add")
          throw new Error("Send a trainer request first.");
        const flags = {
          isConfirmed: existing?.isConfirmed || false,
          viewHealthData: existing?.viewHealthData || false,
          ...(action === "confirm" ? { isConfirmed: true } : {}),
          ...(action === "grant" ? { viewHealthData: true } : {}),
        };
        trainers = [
          ...trainers.filter((item) => item.userId !== professionalId),
          { ...flags, userId: professionalId },
        ];
        players = [
          ...players.filter((item) => item.userId !== playerId),
          { ...flags, userId: playerId },
        ];
      }
      transaction.update(playerRef, { trainers });
      transaction.update(proRef, { players });
    }
    return true;
  });
};
export const getDoctorSelectedPlayers = async (id) => {
  const user = await getUser(id);
  const records = await Promise.all((user?.players || []).map(getUser));
  return { user, data: records.filter(Boolean) };
};
export const getSelectedPlayers = async (id) => {
  const user = await getUser(id);
  const records = await Promise.all(
    (user?.players || []).map(async (item) => ({
      ...item,
      user: await getUser(item.userId),
    })),
  );
  return { user, data: records.filter((item) => item.user) };
};
export const deleteUser = async (id) => {
  const all = await getUsers();
  const patches = [];
  for (const record of all) {
    if (record.docId === id) continue;
    const patch = {};
    for (const key of ["players", "trainers", "doctors"]) {
      if (!Array.isArray(record[key])) continue;
      const next = record[key].filter((item) =>
        typeof item === "string" ? item !== id : item.userId !== id,
      );
      if (next.length !== record[key].length) patch[key] = next;
    }
    if (Object.keys(patch).length) patches.push([record.docId, patch]);
  }
  if (patches.length > 498)
    throw new Error(
      "Too many related profiles for one atomic deletion. Use an administrator migration service.",
    );
  const batch = firestore.batch();
  for (const [userId, patch] of patches)
    batch.update(firestore.collection("users").doc(userId), patch);
  batch.delete(firestore.collection("users").doc(id));
  batch.delete(firestore.collection("directory").doc(id));
  await batch.commit();
};
