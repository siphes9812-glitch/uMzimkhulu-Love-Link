import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot, getDocs, doc, getDoc } from "firebase/firestore";
import { motion } from "motion/react";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";
import { Match, UserProfile } from "../types";
import { Heart, Search, MessageCircle, Sparkles } from "lucide-react";

export const Matches: React.FC = () => {
  const { profile } = useAuth();
  const [matches, setMatches] = useState<(Match & { otherUser: UserProfile })[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) return;

    const q = query(
      collection(db, "matches"),
      where("users", "array-contains", profile.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const matchesData = await Promise.all(
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
      setMatches(matchesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-[#0a0a0a]">
      <div className="w-12 h-12 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a] pb-24">
      <header className="px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">Matches</h1>
            <p className="mt-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              {matches.length} {matches.length === 1 ? "Soulmate" : "Soulmates"} found
            </p>
          </div>
          <div className="p-2.5 bg-brand-50 dark:bg-brand-500/10 rounded-xl">
            <Sparkles className="text-brand-500" size={20} />
          </div>
        </div>
      </header>

      <div className="flex-grow px-4">
        {matches.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {matches.map((match) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => navigate(`/chat/${match.id}`)}
                className="relative aspect-[3/4] rounded-[1.5rem] overflow-hidden shadow-premium hover:shadow-2xl transition-all cursor-pointer group border border-gray-100 dark:border-white/5"
              >
                <img
                  src={match.otherUser.photos?.[0] || `https://picsum.photos/seed/${match.otherUser.uid}/400/600`}
                  alt={match.otherUser.displayName}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <p className="font-black text-base tracking-tight leading-tight">
                    {match.otherUser.displayName}, {match.otherUser.age}
                  </p>
                  <div className="flex items-center mt-1 space-x-1">
                    <div className="w-1 h-1 bg-green-500 rounded-full" />
                    <span className="text-[8px] font-bold uppercase tracking-widest text-gray-300">Online</span>
                  </div>
                </div>

                <div className="absolute top-2 right-2 p-1.5 bg-white/20 backdrop-blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <MessageCircle size={14} className="text-white" fill="white" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-brand-500 rounded-full blur-2xl opacity-10 animate-pulse" />
              <div className="relative w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-[2rem] flex items-center justify-center">
                <Heart className="text-gray-300 dark:text-gray-600" size={32} />
              </div>
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">No matches yet</h3>
            <p className="mt-3 text-gray-500 text-sm font-medium max-w-[200px] mx-auto leading-relaxed">
              Don't worry! Your perfect match is just a swipe away.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-8 px-8 py-3.5 bg-brand-500 text-white font-bold rounded-xl shadow-xl shadow-brand-500/20 hover:bg-brand-600 transition-all active:scale-95"
            >
              Start Discovering
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
