"use client";

import { useState, useEffect } from "react";
import { sendDirectMessage, listenForDirectMessages } from "@/lib/dmService";
import { getUserData } from "./friendService";

interface Message {
  id: string;
  text: string;
  fromUserId: string;
  toUserId: string;
  timestamp?: Date;
}

interface Props {
  otherUserId: string;
  currentUserId: string;
  onClose: () => void;
}

export default function DirectMessage({ otherUserId, currentUserId, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [otherUsername, setOtherUsername] = useState("");

  useEffect(() => {
    // Get other user's data
    getUserData(otherUserId).then((userData) => {
      if (userData?.username) {
        setOtherUsername(userData.username);
      }
    });

    // Listen for messages
    const unsubscribe = listenForDirectMessages(otherUserId, setMessages);
    return unsubscribe;
  }, [otherUserId]);

  const handleSend = async () => {
    if (input.trim()) {
      await sendDirectMessage(otherUserId, input);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 bg-gray-800">
        <h3 className="font-semibold">{otherUsername}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded ${
              msg.fromUserId === currentUserId
                ? "bg-blue-600 ml-auto"
                : "bg-gray-700"
            } max-w-[80%]`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 p-2 bg-gray-700 rounded"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}