import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCG1kCv-p9-D006d1_8MWBwDyVGhCC-Rps",
  authDomain: "indymowertop10websites.firebaseapp.com",
  projectId: "indymowertop10websites",
  storageBucket: "indymowertop10websites.firebasestorage.app",
  messagingSenderId: "823906843882",
  appId: "1:823906843882:web:b8fb1644414a24feafeb93",
  measurementId: "G-GFS9SLRE6J"
};

// Initialize Firebase
const indyMowerApp = initializeApp(firebaseConfig, 'indyMower');

// Initialize Firestore
export const indyMowerDb = getFirestore(indyMowerApp);

// Initialize Analytics only on client side
if (typeof window !== 'undefined') {
  getAnalytics(indyMowerApp);
}


