import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey:
    process.env.REACT_APP_FIREBASE_API_KEY ||
    "AIzaSyDlVIKNnaD8C0iUc_YpTFumJwSPqPz3PGo",
  authDomain:
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ||
    "maxpowernutrition-5b04b.firebaseapp.com",
  databaseURL:
    process.env.REACT_APP_FIREBASE_DATABASE_URL ||
    "https://maxpowernutrition-5b04b-default-rtdb.firebaseio.com",
  projectId:
    process.env.REACT_APP_FIREBASE_PROJECT_ID || "maxpowernutrition-5b04b",
  storageBucket:
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ||
    "maxpowernutrition-5b04b.appspot.com",
  messagingSenderId:
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "372053277482",
  appId:
    process.env.REACT_APP_FIREBASE_APP_ID ||
    "1:372053277482:web:a8db80e71c2522a0debc53",
  measurementId:
    process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-CP18BK6R1W",
};
// Initialize Firebase
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storageRef = firebase.storage();
