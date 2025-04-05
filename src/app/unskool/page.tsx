"use client";

import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { googleSignIn, googleSignOut, listenForAuthChanges } from "@/lib/authService";
import { sendMessage, listenForMessages } from "@/lib/chatService";
import { getUserData } from "./friendService";
import FriendSidebar from "./FriendSidebar";

interface Message {
  id: string;
  text: string;
  username: string;
  timestamp?: Date;
  userId: string;
}

export default function ChatPage() {
  const [user, setUser] = useState<User | null>(null);
  const [showFriends, setShowFriends] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const unsubscribeAuth = listenForAuthChanges((authUser: User | null) => {
      setUser(authUser);
      if (authUser) {
        // Fetch username when user logs in
        getUserData(authUser.uid).then((userData) => {
          if (userData?.username) {
            setUsername(userData.username);
          }
        });
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = listenForMessages((msgs: Message[]) => {
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      await sendMessage(user.displayName || 'Anonymous', newMessage.trim());
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#2c2f33]">
        <button
          onClick={() => googleSignIn()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#2c2f33] text-white">
      {/* Left Sidebar */}
      <div className="w-16 bg-[#23272a] flex flex-col items-center py-4">
        <button
          onClick={() => setShowFriends(!showFriends)}
          className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
        >
          👥
        </button>
        
        {/* Settings button at bottom */}
        <div className="mt-auto relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-700 text-white flex items-center justify-center"
          >
            ⚙️
          </button>
          
          {/* Settings dropdown */}
          {showSettings && (
            <div className="absolute bottom-16 left-0 bg-gray-800 rounded-lg shadow-lg p-4 w-64">
              <div className="mb-4 border-b border-gray-700 pb-2">
                <p className="text-sm text-gray-400">Logged in as</p>
                <p className="text-sm truncate">{username}</p>
              </div>
              <button
                onClick={() => googleSignOut()}
                className="text-red-500 hover:bg-gray-700 rounded w-full text-left px-2 py-2 text-sm"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Friends Sidebar */}
      {showFriends && user && (
        <FriendSidebar user={user} />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-screen bg-[#36393f]">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${
                message.userId === user.uid ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-gray-400">{message.username}</span>
                <span className="text-xs text-gray-500">
                  {message.timestamp?.toLocaleTimeString()}
                </span>
              </div>
              <div
                className={`px-4 py-2 rounded-lg max-w-[80%] ${
                  message.userId === user.uid
                    ? 'bg-blue-600'
                    : 'bg-gray-700'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 bg-[#40444b]">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Send a message..."
              className="flex-1 px-4 py-2 bg-[#40444b] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
