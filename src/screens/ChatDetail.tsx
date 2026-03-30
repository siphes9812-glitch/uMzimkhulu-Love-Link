import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, getDoc } from "firebase/firestore";
import { useAuth, handleFirestoreError, OperationType } from "../AuthContext";
import { db } from "../firebase";
import { Message, UserProfile, Match } from "../types";
import { ChevronLeft, Send, Info, MoreVertical, Phone, Video, Heart, Smile, Plus } from "lucide-react";
import { format } from "date-fns";

export const ChatDetail: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<UserProfile | null>(null);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!matchId || !profile) return;

    const fetchOtherUser = async () => {
      try {
        const matchSnap = await getDoc(doc(db, "matches", matchId));
        if (matchSnap.exists()) {
          const matchData = matchSnap.data() as Match;
          const otherUid = matchData.users.find((uid) => uid !== profile.uid);
          const otherUserSnap = await getDoc(doc(db, "users", otherUid!));
          setOtherUser(otherUserSnap.data() as UserProfile);
        }
      } catch (error) {
        console.error("Error fetching other user:", error);
      }
    };

    fetchOtherUser();

    const q = query(
      collection(db, "matches", matchId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(messagesData);
      setLoading(false);
      setTimeout(scrollToBottom, 100);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `matches/${matchId}/messages`);
    });

    return () => unsubscribe();
  }, [matchId, profile]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !matchId || !profile) return;

    const text = inputText.trim();
    setInputText("");

    try {
      await addDoc(collection(db, "matches", matchId, "messages"), {
        senderUid: profile.uid,
        text,
        createdAt: serverTimestamp(),
        read: false,
      });

      await updateDoc(doc(db, "matches", matchId), {
        lastMessage: text,
        lastMessageAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `matches/${matchId}/messages`);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-[#0a0a0a]">
      <div className="w-12 h-12 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-[#0a0a0a]">
      {/* Header */}
      <header className="glass sticky top-0 z-20 flex items-center justify-between px-4 py-4 md:px-8 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center">
          <button onClick={() => navigate("/chats")} className="p-2 -ml-2 text-gray-400 hover:text-brand-500 transition-all">
            <ChevronLeft size={28} />
          </button>
          <div className="flex items-center ml-2 cursor-pointer" onClick={() => navigate(`/profile/${otherUser?.uid}`)}>
            <div className="relative">
              <img
                src={otherUser?.photos?.[0] || `https://picsum.photos/seed/${otherUser?.uid}/200/200`}
                alt={otherUser?.displayName}
                className="w-11 h-11 rounded-2xl object-cover border border-gray-100 dark:border-white/10"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-[#0a0a0a] rounded-full" />
            </div>
            <div className="ml-3">
              <h3 className="font-black text-base text-gray-900 dark:text-white leading-tight">{otherUser?.displayName}</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Active now</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button className="p-2.5 text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-xl transition-all"><Phone size={20} /></button>
          <button className="p-2.5 text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-xl transition-all"><Video size={20} /></button>
          <button className="p-2.5 text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-xl transition-all"><MoreVertical size={20} /></button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto px-6 py-8 space-y-6 scrollbar-hide">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-brand-500 rounded-full blur-2xl opacity-20 animate-pulse" />
            <div className="relative w-20 h-20 bg-brand-50 dark:bg-brand-500/10 rounded-[2rem] flex items-center justify-center">
              <Heart className="text-brand-500" size={32} fill="currentColor" />
            </div>
          </div>
          <p className="text-xs text-gray-400 font-black uppercase tracking-[0.2em]">You matched with {otherUser?.displayName}</p>
          <p className="text-[10px] text-gray-400 mt-2 font-medium">Start the conversation with a friendly hello!</p>
        </div>

        {messages.map((msg, index) => {
          const isMe = msg.senderUid === profile?.uid;
          const showTime = index === messages.length - 1 || 
            (messages[index + 1] && messages[index + 1].senderUid !== msg.senderUid);

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[80%] px-5 py-3.5 text-sm font-medium shadow-sm transition-all hover:shadow-md ${
                  isMe
                    ? "bg-brand-500 text-white rounded-3xl rounded-tr-none"
                    : "bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white rounded-3xl rounded-tl-none border border-gray-100 dark:border-white/5"
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
              </div>
              {showTime && (
                <span className="text-[9px] mt-1.5 text-gray-400 font-bold uppercase tracking-widest px-2">
                  {msg.createdAt && format(new Date(msg.createdAt.toString()), "HH:mm")}
                </span>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-white/5 pb-24 md:pb-8">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <button type="button" className="p-3 bg-gray-50 dark:bg-white/5 text-gray-400 rounded-2xl hover:text-brand-500 transition-all">
            <Plus size={24} />
          </button>
          
          <div className="flex-grow relative">
            <input
              type="text"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-base font-medium"
            />
            <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-500 transition-all">
              <Smile size={24} />
            </button>
          </div>

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-14 h-14 flex items-center justify-center bg-brand-500 text-white rounded-2xl shadow-xl shadow-brand-500/20 hover:bg-brand-600 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
          >
            <Send size={24} fill="white" className="ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
};
