import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBThipAcJqwPh5ABYPRQQQjLQp-eT86HYY",
  authDomain: "omkar--singh.firebaseapp.com",
  projectId: "omkar--singh",
  storageBucket: "omkar--singh.appspot.com",
  messagingSenderId: "30549289261",
  appId: "1:30549289261:web:bdc2823a8ff77397eb0ba4",
  measurementId: "G-ERYT13E12C"
};
const app = initializeApp(firebaseConfig);
export const AUTH = getAuth(app);
export const DB = getFirestore(app);
