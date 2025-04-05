import { db, auth } from "./firebaseConfig";
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  onSnapshot,
  limit 
} from "firebase/firestore";

// Function to send a message
export async function sendMessage(username, text) {
  if (!auth.currentUser) {
    throw new Error("Must be authenticated to send messages");
  }

  try {
    await addDoc(collection(db, "messages"), {
      username,
      text,
      timestamp: serverTimestamp(),
      userId: auth.currentUser.uid // Add user ID to message
    });
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

// Function to listen for real-time messages
export function listenForMessages(callback) {
  if (!auth.currentUser) {
    console.warn("No authenticated user");
    return () => {}; // Return empty cleanup function
  }

  const messagesQuery = query(
    collection(db, "messages"),
    orderBy("timestamp", "desc"),
    limit(100) // Limit the number of messages to prevent performance issues
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
      callback(messages);
    },
    (error) => {
      console.error("Error listening to messages:", error);
      // Optionally notify the user about the error
      callback([]);
    }
  );
}
