"use client"; // Required for Next.js client-side code

import { useState, useEffect } from "react";
import { sendMessage, listenForMessages } from "@/lib/chatService"; // Adjusted import path

// Define a type for messages
type Message = {
  id: string;
  username: string;
  text: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("Guest");

  useEffect(() => {
    const unsubscribe = listenForMessages(setMessages);
    return () => unsubscribe();
  }, []);

  const handleSend = async () => {
    if (input.trim()) {
      await sendMessage(username, input);
      setInput("");
    }
  };

  return (
    <div className="chat-container">
      <h2>Live Chat</h2>
      <input
        type="text"
        placeholder="Your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
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
