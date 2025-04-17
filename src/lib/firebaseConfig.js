import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDb_saLnE7wkEX0YWH3WDUZOtoQzByuBes",
  authDomain: "top10websiteslolslashunskool.firebaseapp.com",
  projectId: "top10websiteslolslashunskool",
  storageBucket: "top10websiteslolslashunskool.firebasestorage.app",
  messagingSenderId: "755673057058",
  appId: "1:755673057058:web:341e335f55a576e71c877b",
  measurementId: "G-Q8EFH8EG7P"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
