"use client";

import { useState, useEffect } from "react";
import {
  sendFriendRequest,
  acceptFriendRequest,
  listenForFriendRequests,
  listenForFriends,
  getUserData,
  updateUsername
} from "./friendService";
import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import DirectMessage from './DirectMessage';

interface FriendRequestData {
  id: string;
  from: string;
  to: string;
  status: string;
  fromUsername?: string;
  timestamp: Timestamp;
}

interface Friend {
  id: string;
  username: string;
}

interface Props {
  user: User | null;
}

// Custom error type
interface CustomError {
  message: string;
}

export default function FriendSidebar({ user }: Props) {
  const [friendRequests, setFriendRequests] = useState<FriendRequestData[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [emailToAdd, setEmailToAdd] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const unsubscribe = listenForFriendRequests(user.uid, (requests: FriendRequestData[]) => {
      Promise.all(
        requests.map(async (request) => {
          try {
            const userData = await getUserData(request.from);
            return {
              ...request,
              fromUsername: userData?.displayName || 'Unknown'
            };
          } catch (err) {
            console.error("Error enriching request:", err);
            return request;
          }
        })
      )
        .then(enrichedRequests => setFriendRequests(enrichedRequests))
        .catch(err => {
          setError("Failed to load friend requests");
          console.error(err);
        });
    });

    return () => {
      unsubscribe();
    };
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const unsubscribe = listenForFriends(user.uid, (friendIds: string[]) => {
      Promise.all(
        friendIds.map(async (id) => {
          try {
            const userData = await getUserData(id);
            return {
              id,
              username: userData?.displayName || 'Unknown'
            };
          } catch (err) {
            console.error("Error enriching friend:", err);
            return { id, username: 'Unknown' };
          }
        })
      )
        .then(enrichedFriends => {
          setFriends(enrichedFriends);
          setLoading(false);
        })
        .catch(err => {
          setError("Failed to load friends");
          console.error(err);
          setLoading(false);
        });
    });

    return () => {
      unsubscribe();
    };
  }, [user?.uid]);

  const handleSendRequest = async () => {
    if (!user?.uid) {
      setError("You must be logged in to send friend requests");
      return;
    }

    try {
      setError(null);
      if (!emailToAdd.trim()) {
        throw new Error("Please enter an email address");
      }
      await sendFriendRequest(user.uid, emailToAdd);
      setEmailToAdd("");
      alert("Friend request sent!");
    } catch (error) {
      const customError = error as CustomError;
      setError(customError.message || "An unknown error occurred");
    }
  };

  const handleAccept = async (request: FriendRequestData) => {
    if (!user?.uid) {
      setError("You must be logged in to accept friend requests");
      return;
    }

    try {
      setError(null);
      await acceptFriendRequest(request.id, request.from, request.to);
      alert("Friend request accepted!");
    } catch (error) {
      const customError = error as CustomError;
      setError(customError.message || "An unknown error occurred");
    }
  };

  if (!user) {
    return (
      <div className="w-64 bg-gray-800 text-white p-4">
        <p>Please sign in to manage friends</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-64 bg-gray-800 text-white p-4">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-lg font-bold mb-4">Friends</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-500 text-white rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          <input
            type="email"
            value={emailToAdd}
            onChange={(e) => setEmailToAdd(e.target.value)}
            placeholder="Friend's email address"
            className="w-full p-2 mb-2 rounded bg-gray-700 border border-gray-600"
          />
          <button
            onClick={handleSendRequest}
            className="w-full bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded"
          >
            Send Friend Request
          </button>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Friend Requests</h3>
          {friendRequests.length > 0 ? (
            friendRequests.map((req) => (
              <div key={req.id} className="flex justify-between items-center mb-2 bg-gray-700 p-2 rounded">
                <span className="text-sm truncate flex-1">{req.fromUsername}</span>
                <button
                  onClick={() => handleAccept(req)}
                  className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-sm ml-2"
                >
                  Accept
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400">No pending requests</p>
          )}
        </div>

        <div>
          <h3 className="font-semibold mb-2">Your Friends</h3>
          {friends.length > 0 ? (
            <ul className="text-sm">
              {friends.map((friend) => (
                <li 
                  key={friend.id} 
                  className="mb-1 bg-gray-700 p-2 rounded flex justify-between items-center"
                >
                  <span>{friend.username}</span>
                  <button
                    onClick={() => setSelectedChat(friend.id)}
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                  >
                    Message
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No friends yet</p>
          )}
        </div>
      </div>

      {selectedChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 w-96 h-96 rounded-lg shadow-lg">
            <DirectMessage
              otherUserId={selectedChat}
              currentUserId={user.uid}
              onClose={() => setSelectedChat(null)}
            />
          </div>
        </div>
      )}
    </>
  );
}
