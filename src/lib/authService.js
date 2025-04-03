// src/lib/authService.js
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, provider } from "./firebaseConfig"; // Import auth and provider from firebaseConfig

// Google Authentication function
export const googleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user; // Returning the signed-in user
  } catch (error) {
    console.error("Google sign-in error:", error);
    return null;
  }
};

// Sign-out function
export const googleSignOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Google sign-out error:", error);
  }
};

// Listen for changes in authentication state
export const listenForAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback); // Listen for auth state changes
};
