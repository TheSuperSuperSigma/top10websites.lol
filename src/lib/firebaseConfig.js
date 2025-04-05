import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDb_saLnE7wkEX0YWH3WDUZOtoQzByuBes",
  authDomain: "top10websiteslolslashunskool.firebaseapp.com",
  projectId: "top10websiteslolslashunskool",
  storageBucket: "top10websiteslolslashunskool.firebasestorage.app",
  messagingSenderId: "755673057058",
  appId: "1:755673057058:web:341e335f55a576e71c877b",
  measurementId: "G-Q8EFH8EG7P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
let analytics;

// Only initialize analytics on the client side
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { auth, provider, db, analytics };
