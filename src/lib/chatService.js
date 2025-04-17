import { db, auth } from "./firebaseConfig";
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  onSnapshot,
  limit,
  startAfter,
  getDocs
} from "firebase/firestore";

// Function to send a message using display name
export async function sendMessage({ text, imageUrl }) {
  if (!auth.currentUser) {
    throw new Error("Must be authenticated to send messages");
  }

  try {
    await addDoc(collection(db, "messages"), {
      username: auth.currentUser.displayName || "Anonymous",
      text,
      imageUrl,
      timestamp: serverTimestamp(),
      userId: auth.currentUser.uid
    });
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

// Function to listen for real-time messages
export function listenForMessages(callback, limitCount = 250) {
  if (!auth.currentUser) {
    console.warn("No authenticated user");
    return () => {}; // Return empty cleanup function
  }

  const messagesQuery = query(
    collection(db, "messages"),
    orderBy("timestamp", "desc"),
    limit(limitCount)
  );

  return onSnapshot(
    messagesQuery,
    (snapshot) => {
      const messages = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() // Convert timestamp to Date
        }))
        .reverse(); // Reverse to show newest messages at bottom
      callback(messages, snapshot.docs[0]); // Pass the first doc for pagination
    },
    (error) => {
      console.error("Error listening to messages:", error);
      callback([], null);
    }
  );
}

// Function to load more messages
export async function loadMoreMessages(lastDoc, limitCount = 250) {
  if (!auth.currentUser || !lastDoc) return [];

  try {
    const moreMessagesQuery = query(
      collection(db, "messages"),
      orderBy("timestamp", "desc"),
      startAfter(lastDoc),
      limit(limitCount)
    );

    const snapshot = await getDocs(moreMessagesQuery);
    return snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }))
      .reverse();
  } catch (error) {
    console.error("Error loading more messages:", error);
    return [];
  }
}
