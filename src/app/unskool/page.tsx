"use client";

import { useState, useEffect, useRef } from "react";
import { User } from "firebase/auth";
import { googleSignIn, googleSignOut, listenForAuthChanges } from "@/lib/authService";
import { sendMessage, listenForMessages, loadMoreMessages } from "@/lib/chatService";
import { uploadImage } from "@/lib/storageService";
import FriendSidebar from "./FriendSidebar";
import Image from 'next/image';

interface Message {
  id: string;
  text: string;
  imageUrl?: string;
  username: string;
  timestamp?: Date;
  userId: string;
}

interface FirestoreDoc {
  id: string;
  data(): any;
}

export default function ChatPage() {
  const [user, setUser] = useState<User | null>(null);
  const [showFriends, setShowFriends] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [lastDoc, setLastDoc] = useState<FirestoreDoc | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allMessagesLoaded, setAllMessagesLoaded] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Function to handle scroll and load more messages
  useEffect(() => {
    const handleScroll = async () => {
      if (!messagesContainerRef.current || isLoadingMore || allMessagesLoaded) return;

      const { scrollTop } = messagesContainerRef.current;
      
      if (scrollTop === 0) {
        setIsLoadingMore(true);
        const moreMessages = (await loadMoreMessages(lastDoc, 250)) as Message[]; // Type assertion to Message[]
        
        if (moreMessages.length > 0) {
          setLastDoc(moreMessages[moreMessages.length - 1] as unknown as FirestoreDoc);
        } else {
          setAllMessagesLoaded(true);
        }
        setIsLoadingMore(false);
      }
    };

    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [lastDoc, isLoadingMore, allMessagesLoaded]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const unsubscribeAuth = listenForAuthChanges((authUser: User | null) => {
      setUser(authUser);
      // Remove the getUserData call since we don't need it anymore
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = listenForMessages((msgs: Message[], firstDoc: FirestoreDoc) => {
      setMessages(msgs);
      setLastDoc(firstDoc);
      setShouldScrollToBottom(true);
    }, 250); // Set limit to 250 messages

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (shouldScrollToBottom) {
      scrollToBottom();
    }
  }, [messages, shouldScrollToBottom]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 32 * 1024 * 1024) {
        alert('Image size must be less than 32MB');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      setSelectedImage(file);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedImage) || !user) return;

    try {
      setShouldScrollToBottom(true);
      let imageUrl = null;
      
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }
      
      await sendMessage({ text: newMessage.trim(), imageUrl });
      setNewMessage("");
      setSelectedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
          
          {/* Simplified settings dropdown */}
          {showSettings && (
            <div className="absolute bottom-16 left-0 bg-gray-800 rounded-lg shadow-lg p-4 w-64">
              <div className="mb-4 border-b border-gray-700 pb-2">
                <p className="text-sm text-gray-400">Logged in as</p>
                <p className="text-sm truncate">{user?.email}</p>
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
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {isLoadingMore && (
            <div className="text-center py-2">
              <span className="text-gray-400">Loading more messages...</span>
            </div>
          )}
          
          {allMessagesLoaded && (
            <div className="text-center py-2">
              <span className="text-gray-400">No more messages to load</span>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={`${message.id}-${Date.now()}-${index}`}
              className={`flex flex-col ${
                message.userId === user?.uid ? 'items-end' : 'items-start'
              } w-full`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-gray-400">{message.username}</span>
                <span className="text-xs text-gray-500">
                  {message.timestamp?.toLocaleTimeString()}
                </span>
              </div>
              <div
                className={`px-4 py-2 rounded-lg max-w-[80%] break-all whitespace-pre-wrap overflow-hidden ${
                  message.userId === user?.uid
                    ? 'bg-blue-600'
                    : 'bg-gray-700'
                }`}
                style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
              >
                {message.text}
                {message.imageUrl && (
                  <div className="mt-2">
                    <Image 
                      src={message.imageUrl} 
                      alt="Shared image" 
                      width={300}
                      height={300}
                      className="rounded-lg"
                      style={{ objectFit: 'contain' }}
                      unoptimized
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
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
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              ref={fileInputRef}
              className="hidden"
              id="image-upload"
            />
            <button
              type="button"
              onClick={() => document.getElementById('image-upload')?.click()}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
            >
              📷
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Send
            </button>
          </div>
          {selectedImage && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-gray-400">
                Selected: {selectedImage.name}
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedImage(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="text-red-500 hover:text-red-400"
              >
                ✕
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
