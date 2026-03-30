import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { Settings, Edit2, Shield, Heart, Star, MapPin, Camera, ChevronRight, LogOut, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export const Profile: React.FC = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  if (!profile) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a] pb-32">
      <header className="relative h-[450px] overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={profile.photos?.[0] || `https://picsum.photos/seed/${profile.uid}/800/1200`}
          alt={profile.displayName}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
        
        <div className="absolute top-8 right-8 flex space-x-3">
          <button
            onClick={() => navigate("/settings")}
            className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl text-white border border-white/20 hover:bg-white/20 transition-all active:scale-95"
          >
            <Settings size={22} />
          </button>
        </div>

        <div className="absolute bottom-12 left-8 right-8 text-white">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-3 py-1 bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-brand-500/30">
                  Premium Member
                </span>
                {profile.isVerified && (
                  <CheckCircle2 size={16} className="text-blue-400" fill="currentColor" />
                )}
              </div>
              <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">
                {profile.displayName}, {profile.age}
              </h1>
              <div className="flex items-center mt-3 text-gray-300 font-bold uppercase tracking-widest text-[10px]">
                <MapPin size={14} className="mr-1.5 text-brand-500" />
                <span>{profile.location?.city || "Nearby"}</span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/profile/edit")}
              className="p-5 bg-brand-500 rounded-[2rem] text-white shadow-2xl shadow-brand-500/40 hover:bg-brand-600 transition-all"
            >
              <Edit2 size={28} />
            </motion.button>
          </div>
        </div>
      </header>

      <div className="px-8 -mt-8 relative z-10 space-y-10">
        {/* Stats Card */}
        <div className="grid grid-cols-3 gap-6 p-6 bg-white dark:bg-white/5 backdrop-blur-2xl rounded-[2.5rem] shadow-premium border border-gray-100 dark:border-white/5">
          <div className="flex flex-col items-center">
            <div className="p-3 bg-brand-50 dark:bg-brand-500/10 rounded-2xl text-brand-500 mb-3">
              <Heart size={22} fill="currentColor" />
            </div>
            <span className="text-xl font-black text-gray-900 dark:text-white tracking-tight">124</span>
            <span className="text-[9px] text-gray-400 uppercase tracking-widest font-black mt-1">Likes</span>
          </div>
          <div className="flex flex-col items-center border-x border-gray-100 dark:border-white/10">
            <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-500 mb-3">
              <Star size={22} fill="currentColor" />
            </div>
            <span className="text-xl font-black text-gray-900 dark:text-white tracking-tight">18</span>
            <span className="text-[9px] text-gray-400 uppercase tracking-widest font-black mt-1">Matches</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-2xl text-purple-500 mb-3">
              <Shield size={22} fill="currentColor" />
            </div>
            <span className="text-xl font-black text-gray-900 dark:text-white tracking-tight">92%</span>
            <span className="text-[9px] text-gray-400 uppercase tracking-widest font-black mt-1">Score</span>
          </div>
        </div>

        {/* About */}
        <section>
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles size={18} className="text-brand-500" />
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase italic">My Story</h3>
          </div>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium text-lg">
            {profile.bio || "No bio added yet. Tell people about yourself!"}
          </p>
        </section>

        {/* Interests */}
        <section>
          <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase italic mb-4">Interests</h3>
          <div className="flex flex-wrap gap-3">
            {profile.interests?.length ? (
              profile.interests.map((interest, i) => (
                <span key={i} className="px-6 py-3 bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-2xl border border-gray-100 dark:border-white/5 hover:border-brand-500 transition-colors">
                  {interest}
                </span>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic font-medium">No interests added yet.</p>
            )}
          </div>
        </section>

        {/* Account Options */}
        <section className="space-y-4 pt-4">
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center justify-between w-full p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 hover:border-brand-500 transition-all active:scale-[0.98] group"
          >
            <div className="flex items-center">
              <div className="p-3 bg-white dark:bg-white/10 rounded-2xl text-gray-500 group-hover:text-brand-500 transition-colors">
                <Settings size={22} />
              </div>
              <span className="font-black text-gray-900 dark:text-white ml-4 tracking-tight">Account Settings</span>
            </div>
            <ChevronRight size={22} className="text-gray-300 group-hover:text-brand-500 transition-colors" />
          </button>

          <button
            onClick={signOut}
            className="flex items-center justify-between w-full p-6 bg-red-50/50 dark:bg-red-500/5 rounded-3xl border border-red-100 dark:border-red-500/10 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all active:scale-[0.98] group"
          >
            <div className="flex items-center">
              <div className="p-3 bg-white dark:bg-white/10 rounded-2xl text-red-500">
                <LogOut size={22} />
              </div>
              <span className="font-black text-red-600 ml-4 tracking-tight">Logout</span>
            </div>
            <ChevronRight size={22} className="text-red-300" />
          </button>
        </section>
      </div>
    </div>
  );
};
