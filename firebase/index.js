import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "add your apikey",
  authDomain: "add your firebase config",
  projectId: "add your firebase config",
  storageBucket: "add your firebase config",
  messagingSenderId: "add your firebase config",
  appId: "add your firebase config",
  measurementId: "add your firebase config"
};
const app = initializeApp(firebaseConfig);
export const AUTH = getAuth(app);
export const DB = getFirestore(app);
