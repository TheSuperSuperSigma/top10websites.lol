import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, provider, db } from "./firebaseConfig";
import { doc, setDoc, serverTimestamp, getDoc, query, collection, where, getDocs } from "firebase/firestore";

// Function to check if username is available
export const checkUsernameAvailability = async (username) => {
  const q = query(collection(db, "users"), where("username", "==", username));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty;
};

// Google Authentication function
export const googleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (user) {
      // Check if user already exists
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (!userDoc.exists()) {
        // New user - generate default username from email
        const defaultUsername = user.email?.split('@')[0] || `user${Math.random().toString(36).slice(2, 8)}`;
        
        // Save the user in Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          username: defaultUsername,
          displayName: user.displayName || "Guest",
          email: user.email || "",
          photoURL: user.photoURL || "",
          createdAt: serverTimestamp(),
        });
      }
    }

    return user;
  } catch (error) {
    console.error("Google sign-in error:", error);
    return null;
  }
};

// Function to update username
export const updateUsername = async (uid, newUsername) => {
  try {
    // Check if username is available
    const isAvailable = await checkUsernameAvailability(newUsername);
    if (!isAvailable) {
      throw new Error("Username is already taken");
    }

    // Update the username
    await setDoc(doc(db, "users", uid), {
      username: newUsername
    }, { merge: true });

    return true;
  } catch (error) {
    console.error("Error updating username:", error);
    throw error;
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
