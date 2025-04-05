import { db, auth } from "./firebaseConfig";
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  onSnapshot,
  limit,
  where
  // Removed unused 'or' import
} from "firebase/firestore";

// Helper to create a consistent chat ID between two users
const createChatId = (uid1, uid2) => {
  return [uid1, uid2].sort().join('_');
};

// Send a DM
export async function sendDirectMessage(toUserId, text) {
  if (!auth.currentUser) {
    throw new Error("Must be authenticated to send messages");
  }

  const chatId = createChatId(auth.currentUser.uid, toUserId);

  try {
    await addDoc(collection(db, "directMessages"), {
      chatId,
      fromUserId: auth.currentUser.uid,
      toUserId,
      text,
      timestamp: serverTimestamp(),
      read: false
    });
  } catch (error) {
    console.error("Error sending DM:", error);
    throw error;
  }
}

// Listen for DMs between two users
export function listenForDirectMessages(otherUserId, callback) {
  if (!auth.currentUser) {
    console.warn("No authenticated user");
    return () => {};
  }

  const chatId = createChatId(auth.currentUser.uid, otherUserId);

  const dmQuery = query(
    collection(db, "directMessages"),
    where("chatId", "==", chatId),
    orderBy("timestamp", "desc"),
    limit(50)
  );

  return onSnapshot(
    dmQuery,
    (snapshot) => {
      const messages = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate()
        }))
        .reverse();
      callback(messages);
    },
    (error) => {
      // Handle index creation error gracefully
      if (error.code === 'failed-precondition') {
        console.warn("Waiting for index to be created...");
        callback([]);
      } else {
        console.error("Error listening to messages:", error);
        callback([]);
      }
    }
  );
}

// Get list of users you have DM conversations with
export function listenForDMChats(callback) {
  if (!auth.currentUser) {
    return () => {};
  }

  const userId = auth.currentUser.uid;
  
  const dmQuery = query(
    collection(db, "directMessages"),
    where("chatId", ">=", userId),
    where("chatId", "<=", userId + "\uf8ff"),
    orderBy("chatId"),
    orderBy("timestamp", "desc"),
    limit(100)
  );

  return onSnapshot(dmQuery, async (snapshot) => {
    const uniqueChats = new Set();
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const otherUser = data.fromUserId === userId ? data.toUserId : data.fromUserId;
      uniqueChats.add(otherUser);
    });
    callback(Array.from(uniqueChats));
  });
}







