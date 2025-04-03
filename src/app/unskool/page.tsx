"use client"; // Required for Next.js client-side code

import { useState, useEffect } from "react";
import { sendMessage, listenForMessages } from "@/lib/chatService"; // Adjusted import path
import { googleSignIn, googleSignOut, listenForAuthChanges } from "@/lib/authService"; // Import the functions from authService
import { User } from "firebase/auth"; // Import the User type from Firebase

type Message = {
  id: string;
  username: string;
  text: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("Guest");
  const [user, setUser] = useState<User | null>(null); // Ensure user is typed as User or null

  useEffect(() => {
    const unsubscribe = listenForMessages(setMessages);
    const unsubscribeAuth = listenForAuthChanges((authUser: User | null) => {
      if (authUser) {
        setUser(authUser);
        // Set username from Google display name permanently, no changes allowed
        setUsername(authUser.displayName || "Guest");
      } else {
        setUser(null);
        setUsername("Guest");
      }
    });

    return () => {
      unsubscribe();
      unsubscribeAuth();
    };
  }, []);

  const handleSignIn = async () => {
    const signedInUser = await googleSignIn();
    if (signedInUser) {
      setUser(signedInUser);
      // Set username from Google display name permanently
      setUsername(signedInUser.displayName || "Guest");
    }
  };

  const handleSignOut = async () => {
    await googleSignOut();
    setUser(null);
    setUsername("Guest");
  };

  const handleSend = async () => {
    if (!user) {
      alert("Please sign in to send messages.");
      return;
    }
    if (input.trim()) {
      await sendMessage(username, input);
      setInput("");
    }
  };

  return (
    <div className="chat-container">
      <div className="title">
        <h2>unskool v1</h2>
      </div>

      {/* Sign In / Sign Out Buttons in the top right */}
      <div className="auth-buttons">
        {!user ? (
          <button onClick={handleSignIn}>Sign In</button>
        ) : (
          <>
            <p>Signed In As {user.displayName}</p>
            <button onClick={handleSignOut}>Sign Out</button>
          </>
        )}
      </div>

      <div className="chat-box">
        {messages.map((msg) => (
          <p key={msg.id}>
            <strong>{msg.username}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
