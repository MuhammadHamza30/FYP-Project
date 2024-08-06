import { auth, firestore, storageRef } from "./config";

export const uploadFile = async (image ) => {
  const uid = Date.now();
  const storageRefrence = storageRef.ref("/spms").child("/" + uid + ".png");
  const uploadedFile = await storageRefrence.put(image);
  const imageUrl = await uploadedFile.ref.getDownloadURL();
  return imageUrl;
};

export const loginAdmin = async (data ) => {
  const authRes = await auth.signInWithEmailAndPassword(
    data.email,
    data.password
  );
  const res = await firestore
    .collection("Admin")
    .doc(authRes?.user?.uid)
    .get();
  if (!res.exists) {
    alert("Invalid admin");
    return false;
  }

  return true;
}
export const loginUser = async (data ) => {

  const res = await firestore
    .collection("users")
    .where("email", "==", data.email)
    .where("password", "==", data.password)
    .get();
  if (!res.docs.length) {
    alert("Invalid user");
    return false;
  }
  sessionStorage.setItem("spms-user", JSON.stringify(res.docs[0].data()));
  return res.docs[0].data();
};
export const registerUser = async (data ) => {
  const ref = firestore
    .collection("users")
    .doc();
  delete data["confirmPassword"];
  await ref.set({
    docId: ref.id,
    trainers: [],
    doctors: [],
    players: [],
    trainerFeedbacks: [],
    doctorFeedbacks: [],
    ...data
  });
  return true;
};

export const updateUser = async (data , id ) => {
  const ref = firestore.collection("users").doc(id);
  await ref.update(data);
  const res = await ref.get();
  sessionStorage.setItem("spms-user", JSON.stringify(res.data()));
  return res.data();
};

export const getUpdates = async () => {
  const ref = await firestore.collection("updates").get();
  return ref.docs.map((item) => item.data());
};


export const addUpdate = async (data ) => {
  const ref = firestore.collection("updates").doc();
  await ref.set({ ...data, docId: ref.id });
};

export const deleteUpdate = async (id ) => {
  await firestore
    .collection("updates")
    .doc(id)
    .delete();
};
export const getTournments = async () => {
  const ref = await firestore.collection("tournments").get();
  return ref.docs.map((item) => item.data());
};


export const addTournment = async (data ) => {
  const ref = firestore.collection("tournments").doc();
  if (data.image && data.image.size) {
    data.image = await uploadFile(data.image);
  }
  await ref.set({ ...data, docId: ref.id });
};

export const deleteTournment = async (id ) => {
  await firestore
    .collection("tournments")
    .doc(id)
    .delete();
};


export const addTrainerFeedbackIntoDB = async (item , id ) => {
  const ref = firestore.collection("users").doc(id);
  const data = await ref.get();
  const trainerFeedbacks = [...data.data()?.trainerFeedbacks, item];
  await ref.update({
    trainerFeedbacks
  })
};
export const addFeedbackIntoDB = async (item , id ) => {
  const ref = firestore.collection("users").doc(id);
  const data = await ref.get();
  const doctorFeedbacks = [...data.data()?.doctorFeedbacks, item];
  await ref.update({
    doctorFeedbacks
  })
};
export const addPrompt = async (data ) => {
  const ref = firestore.collection("prompts").doc();
  await ref.set({ ...data, docId: ref.id });
};
export const getPrompts = async (userId ) => {
  const ref = await firestore.collection("prompts").where("userId", "==", userId).get();
  return ref.docs.map((it ) => it.data());
};
export const getUser = async (id ) => {
  const ref = await firestore.collection("users").doc(id).get();
  return ref.data();
};
export const getUsers = async () => {
  const ref = await firestore.collection("users").get();
  return ref.docs.map((it ) => it.data());
};
export const getDoctorSelectedPlayers = async (id ) => {

  const userRef = await firestore.collection("users").doc(id).get();
  const players = userRef.data()?.players ? userRef.data()?.players : [];

  const data = [];
  for (let i = 0; i < players.length; i++) {
    const item = players[i];
    const ref = await firestore.collection("users").doc(item).get();
    data.push(ref.data());
  }
  return { data, user: userRef.data() };
};
export const getSelectedPlayers = async (id ) => {

  const userRef = await firestore.collection("users").doc(id).get();
  const players = userRef.data()?.players ? userRef.data()?.players : [];

  const data = [];
  for (let i = 0; i < players.length; i++) {
    const item = players[i];
    const ref = await firestore.collection("users").doc(item.userId).get();
    data.push({ ...item, user: ref.data() });
  }
  return { data, user: userRef.data() };
};

export const deleteUser = async (id ) => {
  await firestore
    .collection("users")
    .doc(id)
    .delete();
};