import { db } from "./firebaseConfig"; // No dot before "config" // Adjusted import path
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";

// Function to send a message
export async function sendMessage(username, text) {
  try {
    await addDoc(collection(db, "messages"), {
      username,
      text,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

// Function to listen for real-time messages
export function listenForMessages(callback) {
  const messagesQuery = query(collection(db, "messages"), orderBy("timestamp", "asc"));
  return onSnapshot(messagesQuery, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(messages);
  });
}
