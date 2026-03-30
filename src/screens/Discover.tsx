import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { collection, query, where, getDocs, limit, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";
import { UserProfile } from "../types";
import { Heart, X, Info, MapPin, Star, Search, MessageCircle } from "lucide-react";
import { AdBanner } from "../components/AdBanner";

interface SwipeCardProps {
  user: UserProfile;
  onSwipe: (dir: "left" | "right") => void | Promise<void>;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ user, onSwipe }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-50, -150], [0, 1]);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) onSwipe("right");
    else if (info.offset.x < -100) onSwipe("left");
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
    >
      <div className="relative w-full h-full bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-premium border border-gray-100 dark:border-white/5">
        <img
          src={user.photos?.[0] || `https://picsum.photos/seed/${user.uid}/400/600`}
          alt={user.displayName}
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        
        {/* Overlays */}
        <motion.div style={{ opacity: likeOpacity }} className="absolute top-12 left-12 border-4 border-green-500 rounded-2xl px-6 py-2 rotate-[-15deg] z-20">
          <span className="text-5xl font-black text-green-500 uppercase tracking-tighter italic">LIKE</span>
        </motion.div>
        <motion.div style={{ opacity: nopeOpacity }} className="absolute top-12 right-12 border-4 border-brand-500 rounded-2xl px-6 py-2 rotate-[15deg] z-20">
          <span className="text-5xl font-black text-brand-500 uppercase tracking-tighter italic">NOPE</span>
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="flex items-end justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-4xl font-black tracking-tight">{user.displayName}, {user.age}</h2>
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-gray-300 text-sm font-medium">
                <MapPin size={16} className="mr-1.5 text-brand-400" />
                <span>{user.location?.city || "Nearby"} • 2 miles away</span>
              </div>
            </div>
            <button className="p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl hover:bg-white/20 transition-all">
              <Info size={24} />
            </button>
          </div>
          
          <p className="mt-4 text-gray-200 leading-relaxed font-medium line-clamp-2">
            {user.bio}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-5">
            {user.interests?.slice(0, 3).map((interest, i) => (
              <span key={i} className="px-4 py-1.5 text-xs font-bold bg-white/10 backdrop-blur-xl border border-white/10 rounded-full uppercase tracking-wider">
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Discover: React.FC = () => {
  const { profile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchPopup, setMatchPopup] = useState<UserProfile | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "users"),
        where("uid", "!=", profile.uid),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      const fetchedUsers = querySnapshot.docs.map(doc => doc.data() as UserProfile);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSwipe = async (userId: string, direction: "left" | "right") => {
    if (!profile) return;
    
    const swipedUser = users.find(u => u.uid === userId);
    setUsers(prev => prev.filter(u => u.uid !== userId));

    if (direction === "right") {
      const likeId = `${profile.uid}_${userId}`;
      await setDoc(doc(db, "likes", likeId), {
        fromUid: profile.uid,
        toUid: userId,
        createdAt: serverTimestamp(),
      });

      const reverseLikeId = `${userId}_${profile.uid}`;
      const reverseLikeSnap = await getDoc(doc(db, "likes", reverseLikeId));
      
      if (reverseLikeSnap.exists()) {
        const matchId = [profile.uid, userId].sort().join("_");
        await setDoc(doc(db, "matches", matchId), {
          id: matchId,
          users: [profile.uid, userId],
          createdAt: serverTimestamp(),
          lastMessage: null,
          lastMessageAt: serverTimestamp()
        });
        if (swipedUser) setMatchPopup(swipedUser);
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-[#0a0a0a]">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-brand-100 rounded-full" />
        <div className="absolute inset-0 w-20 h-20 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="mt-6 text-gray-400 font-bold uppercase tracking-widest text-xs">Finding matches...</p>
    </div>
  );

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto overflow-hidden bg-white dark:bg-[#0a0a0a]">
      <header className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-brand-500 rounded-lg">
            <Heart className="text-white" fill="white" size={18} />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-brand-500 uppercase italic">Umzimkhulu Love Link</h1>
        </div>
        <button className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl text-gray-400 hover:text-brand-500 transition-all">
          <Star size={24} />
        </button>
      </header>

      <div className="px-4">
        <AdBanner />
      </div>

      <div className="flex-grow relative px-6 py-4">
        <AnimatePresence>
          {users.length > 0 ? (
            users.map((user) => (
              <SwipeCard
                key={user.uid}
                user={user}
                onSwipe={(dir) => handleSwipe(user.uid, dir)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-32 h-32 bg-gray-50 dark:bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 animate-float">
                <Search className="text-gray-300 dark:text-gray-600" size={48} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Out of People!</h3>
              <p className="mt-4 text-gray-500 font-medium leading-relaxed">
                You've seen everyone nearby. Try expanding your search radius or check back later.
              </p>
              <button
                onClick={fetchUsers}
                className="mt-10 px-10 py-4 bg-brand-500 text-white font-bold rounded-2xl shadow-xl shadow-brand-500/20 hover:bg-brand-600 transition-all active:scale-95"
              >
                Refresh Discovery
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center space-x-8 pb-32">
        <button
          onClick={() => users.length > 0 && handleSwipe(users[users.length - 1].uid, "left")}
          className="w-20 h-20 flex items-center justify-center bg-white dark:bg-gray-900 text-gray-400 rounded-[2rem] shadow-premium hover:scale-110 active:scale-90 transition-all border border-gray-100 dark:border-white/5"
        >
          <X size={36} strokeWidth={3} />
        </button>
        <button
          onClick={() => users.length > 0 && handleSwipe(users[users.length - 1].uid, "right")}
          className="w-20 h-20 flex items-center justify-center bg-brand-500 text-white rounded-[2rem] shadow-2xl shadow-brand-500/30 hover:scale-110 active:scale-90 transition-all"
        >
          <Heart size={36} fill="white" strokeWidth={3} />
        </button>
      </div>

      {/* Match Popup */}
      <AnimatePresence>
        {matchPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0502]/95 p-8"
          >
            <motion.div
              initial={{ scale: 0.8, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              className="flex flex-col items-center text-center w-full max-w-sm"
            >
              <div className="relative mb-12">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-brand-500 rounded-full blur-3xl opacity-50"
                />
                <h2 className="relative text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
                  It's a<br />
                  <span className="text-brand-500">Match!</span>
                </h2>
              </div>

              <div className="flex items-center justify-center -space-x-6 mb-12 relative">
                <motion.div
                  initial={{ x: -40, rotate: -10 }}
                  animate={{ x: 0, rotate: -5 }}
                  className="relative z-10"
                >
                  <img
                    src={profile?.photos?.[0] || "https://picsum.photos/seed/you/200/200"}
                    alt="You"
                    className="w-36 h-36 rounded-[2.5rem] border-4 border-white object-cover shadow-2xl shadow-black/50"
                  />
                </motion.div>
                <motion.div
                  initial={{ x: 40, rotate: 10 }}
                  animate={{ x: 0, rotate: 5 }}
                  className="relative z-0"
                >
                  <img
                    src={matchPopup.photos?.[0] || `https://picsum.photos/seed/${matchPopup.uid}/200/200`}
                    alt={matchPopup.displayName}
                    className="w-36 h-36 rounded-[2.5rem] border-4 border-white object-cover shadow-2xl shadow-black/50"
                  />
                </motion.div>
                <div className="absolute -bottom-4 z-20 p-3 bg-brand-500 rounded-2xl shadow-xl">
                  <Heart size={24} fill="white" className="text-white" />
                </div>
              </div>

              <p className="text-gray-300 text-lg font-medium mb-12 leading-relaxed">
                You and <span className="text-white font-bold">{matchPopup.displayName}</span> have liked each other.
              </p>

              <div className="w-full space-y-4">
                <button
                  onClick={() => setMatchPopup(null)}
                  className="w-full py-5 bg-brand-500 text-white font-black rounded-2xl text-lg uppercase tracking-widest shadow-xl shadow-brand-500/20 hover:bg-brand-600 transition-all active:scale-95 flex items-center justify-center space-x-3"
                >
                  <MessageCircle size={20} />
                  <span>Send a Message</span>
                </button>
                <button
                  onClick={() => setMatchPopup(null)}
                  className="w-full py-5 bg-white/5 text-white font-black rounded-2xl text-lg uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all active:scale-95"
                >
                  Keep Swiping
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
