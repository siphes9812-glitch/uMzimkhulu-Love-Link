import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot, getDocs, doc, getDoc, orderBy } from "firebase/firestore";
import { motion } from "motion/react";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";
import { Match, UserProfile } from "../types";
import { Heart, Search, MessageCircle, ChevronRight, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AdBanner } from "../components/AdBanner";

export const ChatList: React.FC = () => {
  const { profile } = useAuth();
  const [chats, setChats] = useState<(Match & { otherUser: UserProfile })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) return;

    const q = query(
      collection(db, "matches"),
      where("users", "array-contains", profile.uid),
      orderBy("lastMessageAt", "desc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatsData = await Promise.all(
        snapshot.docs.map(async (matchDoc) => {
          const data = matchDoc.data() as Match;
          const otherUid = data.users.find((uid) => uid !== profile.uid);
          const otherUserSnap = await getDoc(doc(db, "users", otherUid!));
          return {
            ...data,
            otherUser: otherUserSnap.data() as UserProfile,
          };
        })
      );
      setChats(chatsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile]);

  const filteredChats = chats.filter(chat => 
    chat.otherUser.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-[#0a0a0a]">
      <div className="w-12 h-12 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a] pb-24">
      <header className="px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">Messages</h1>
            <p className="mt-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              {chats.length} Active {chats.length === 1 ? "Chat" : "Chats"}
            </p>
          </div>
          <div className="p-2.5 bg-brand-50 dark:bg-brand-500/10 rounded-xl">
            <MessageCircle className="text-brand-500" size={20} />
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search your soulmates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-5 py-3.5 bg-gray-50 dark:bg-white/5 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all font-medium text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
          />
        </div>
      </header>

      <div className="px-4 mb-4">
        <AdBanner />
      </div>

      <div className="flex-grow px-4">
        {filteredChats.length > 0 ? (
          <div className="space-y-1">
            {filteredChats.map((chat, index) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/chat/${chat.id}`)}
                className="flex items-center p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer group active:scale-[0.98]"
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-brand-100 dark:border-brand-500/20 group-hover:border-brand-500 transition-colors">
                    <img
                      src={chat.otherUser.photos?.[0] || `https://picsum.photos/seed/${chat.otherUser.uid}/400/600`}
                      alt={chat.otherUser.displayName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {chat.otherUser.isOnline && (
                    <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#0a0a0a] rounded-full shadow-sm" />
                  )}
                </div>
                
                <div className="flex-grow ml-3.5 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-gray-900 dark:text-white tracking-tight text-base">
                      {chat.otherUser.displayName}
                    </h3>
                    {chat.lastMessageAt && (
                      <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                        {formatDistanceToNow(new Date(chat.lastMessageAt.toString()), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs text-gray-500 font-medium truncate pr-4">
                      {chat.lastMessage || "Say something sweet! ✨"}
                    </p>
                    {chat.unreadCount && chat.unreadCount > 0 && (
                      <div className="bg-brand-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[1.125rem] text-center">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={18} className="text-brand-500" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-brand-500 rounded-full blur-2xl opacity-10 animate-pulse" />
              <div className="relative w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-[2rem] flex items-center justify-center">
                <MessageCircle className="text-gray-300 dark:text-gray-600" size={32} />
              </div>
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
              {searchQuery ? "No soulmates found" : "No messages yet"}
            </h3>
            <p className="mt-3 text-gray-500 text-sm font-medium max-w-[200px] mx-auto leading-relaxed">
              {searchQuery 
                ? "Try searching for someone else or check your spelling."
                : "Matches will appear here once you start chatting. Go find your match!"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate("/")}
                className="mt-8 px-8 py-3.5 bg-brand-500 text-white font-bold rounded-xl shadow-xl shadow-brand-500/20 hover:bg-brand-600 transition-all active:scale-95"
              >
                Start Discovering
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
