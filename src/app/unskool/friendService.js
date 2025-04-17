// src/app/unskool/friendService.js
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

// Get user data
export const getUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        ...data,
        displayName: data.displayName || data.email || 'Unknown'  // Fallback to email if no display name
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

// Send a friend request using email instead of username
export const sendFriendRequest = async (fromUID, toEmail) => {
  try {
    // Find user by email
    const usersQuery = query(collection(db, "users"), where("email", "==", toEmail));
    const usersSnapshot = await getDocs(usersQuery);

    if (usersSnapshot.empty) {
      throw new Error("User not found");
    }

    const toUserDoc = usersSnapshot.docs[0];
    const toUID = toUserDoc.id;

    if (fromUID === toUID) {
      throw new Error("You cannot send a friend request to yourself");
    }

    // Check if request already exists
    const existingRequestQuery = query(
      collection(db, "friendRequests"),
      where("from", "==", fromUID),
      where("to", "==", toUID)
    );
    const existingRequestSnapshot = await getDocs(existingRequestQuery);

    if (!existingRequestSnapshot.empty) {
      throw new Error("Friend request already sent");
    }

    // Check if they're already friends
    const friendDoc = await getDoc(doc(db, "users", fromUID, "friends", toUID));
    if (friendDoc.exists()) {
      throw new Error("You are already friends with this user");
    }

    await addDoc(collection(db, "friendRequests"), {
      from: fromUID,
      to: toUID,
      status: "pending",
      timestamp: new Date(),
    });
  } catch (error) {
    throw error;
  }
};

// Accept a friend request
export const acceptFriendRequest = async (requestId, fromUID, toUID) => {
  try {
    // Add both users to each other's friends subcollection
    const fromRef = doc(db, "users", fromUID, "friends", toUID);
    const toRef = doc(db, "users", toUID, "friends", fromUID);

    await setDoc(fromRef, { timestamp: new Date() });
    await setDoc(toRef, { timestamp: new Date() });

    // Remove the friend request
    await deleteDoc(doc(db, "friendRequests", requestId));
  } catch (error) {
    console.error("Error accepting friend request:", error);
    throw error;
  }
};

// Listen for incoming friend requests
export const listenForFriendRequests = (uid, callback) => {
  const q = query(
    collection(db, "friendRequests"),
    where("to", "==", uid),
    where("status", "==", "pending")
  );
  
  return onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(requests);
  });
};

// Listen for friend list
export const listenForFriends = (uid, callback) => {
  const friendsRef = collection(db, "users", uid, "friends");
  return onSnapshot(friendsRef, (snapshot) => {
    const friends = snapshot.docs.map((doc) => doc.id);
    callback(friends);
  });
};

// Add this new function to friendService.js
export const updateUsername = async (uid, newUsername) => {
  try {
    // Check if username is already taken
    const usersQuery = query(collection(db, "users"), where("username", "==", newUsername));
    const querySnapshot = await getDocs(usersQuery);
    
    if (!querySnapshot.empty) {
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

