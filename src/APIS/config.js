import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDlVIKNnaD8C0iUc_YpTFumJwSPqPz3PGo",
  authDomain: "maxpowernutrition-5b04b.firebaseapp.com",
  databaseURL: "https://maxpowernutrition-5b04b-default-rtdb.firebaseio.com",
  projectId: "maxpowernutrition-5b04b",
  storageBucket: "maxpowernutrition-5b04b.appspot.com",
  messagingSenderId: "372053277482",
  appId: "1:372053277482:web:a8db80e71c2522a0debc53",
  measurementId: "G-CP18BK6R1W"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storageRef = firebase.storage();
