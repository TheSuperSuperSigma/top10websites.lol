import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, provider, db } from "./firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// Google Authentication function
export const googleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (user) {
      // Save the user in Firestore with display name and email
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "",
        createdAt: serverTimestamp(),
      });
    }

    return user;
  } catch (error) {
    console.error("Google sign-in error:", error);
    return null;
  }
};

export const googleSignOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Google sign-out error:", error);
  }
};

export const listenForAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};
