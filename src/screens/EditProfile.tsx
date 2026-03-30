import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "motion/react";
import { useAuth, handleFirestoreError, OperationType } from "../AuthContext";
import { db } from "../firebase";
import { ChevronLeft, Camera, Save, X, Plus, Sparkles } from "lucide-react";

export const EditProfile: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: profile?.displayName || "",
    age: profile?.age || 18,
    bio: profile?.bio || "",
    gender: profile?.gender || "male",
    interestedIn: profile?.interestedIn || "female",
    occupation: profile?.occupation || "",
    education: profile?.education || "",
    interests: profile?.interests || [],
  });

  const [newInterest, setNewInterest] = useState("");

  const handleSave = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", profile.uid), {
        ...formData,
        updatedAt: serverTimestamp(),
      });
      navigate("/profile");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${profile.uid}`);
    } finally {
      setLoading(false);
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData({ ...formData, interests: [...formData.interests, newInterest.trim()] });
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setFormData({ ...formData, interests: formData.interests.filter((i) => i !== interest) });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a] pb-32">
      <header className="flex items-center justify-between px-8 py-8 sticky top-0 z-20 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center">
          <button 
            onClick={() => navigate("/profile")} 
            className="p-3 -ml-2 bg-gray-50 dark:bg-white/5 rounded-2xl text-gray-500 hover:text-brand-500 transition-all active:scale-95"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="ml-4 text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">Edit Profile</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center px-8 py-3 bg-brand-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-brand-500/20 hover:bg-brand-600 transition-all disabled:opacity-50 active:scale-95"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Save size={18} className="mr-2" />
          )}
          {loading ? "Saving" : "Save"}
        </button>
      </header>

      <div className="p-8 space-y-12">
        {/* Photos */}
        <section>
          <div className="flex items-center space-x-2 mb-6">
            <Camera size={18} className="text-brand-500" />
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Profile Photos</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="relative aspect-[3/4] bg-gray-50 dark:bg-white/5 rounded-[2rem] overflow-hidden border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center group cursor-pointer hover:border-brand-500 transition-all">
              <img 
                src={profile?.photos?.[0] || `https://picsum.photos/seed/${profile?.uid}/400/600`} 
                alt="Profile" 
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" 
              />
              <div className="relative z-10 flex flex-col items-center text-gray-400 group-hover:text-brand-500 transition-colors">
                <Camera size={28} />
                <span className="mt-2 text-[10px] font-black uppercase tracking-widest">Change</span>
              </div>
            </div>
            {[1, 2].map((i) => (
              <div key={i} className="aspect-[3/4] bg-gray-50 dark:bg-white/5 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center text-gray-300 hover:border-brand-500 hover:text-brand-500 transition-all cursor-pointer">
                <Plus size={28} />
              </div>
            ))}
          </div>
        </section>

        {/* Basic Info */}
        <section className="space-y-8">
          <div className="space-y-3">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Display Name</label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-brand-500/50 transition-all font-bold text-gray-900 dark:text-white"
              placeholder="Your name"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-brand-500/50 transition-all font-bold text-gray-900 dark:text-white"
              />
            </div>
            <div className="space-y-3">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-brand-500/50 transition-all font-bold text-gray-900 dark:text-white appearance-none"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-brand-500/50 transition-all font-bold text-gray-900 dark:text-white min-h-[160px] resize-none"
              placeholder="Tell your soulmate about yourself..."
            />
          </div>
        </section>

        {/* Interests */}
        <section>
          <div className="flex items-center space-x-2 mb-6">
            <Sparkles size={18} className="text-brand-500" />
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Interests</h3>
          </div>
          <div className="flex flex-wrap gap-3 mb-6">
            {formData.interests.map((interest) => (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                key={interest}
                className="flex items-center px-5 py-2.5 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-sm font-black rounded-2xl border border-brand-100 dark:border-brand-500/20"
              >
                {interest}
                <button onClick={() => removeInterest(interest)} className="ml-3 text-brand-300 hover:text-brand-500 transition-colors">
                  <X size={16} />
                </button>
              </motion.span>
            ))}
          </div>
          <div className="flex space-x-3">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Add a vibe..."
              className="flex-grow px-6 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-brand-500/50 transition-all font-bold text-gray-900 dark:text-white text-sm"
              onKeyPress={(e) => e.key === "Enter" && addInterest()}
            />
            <button
              onClick={addInterest}
              className="px-8 py-4 bg-gray-900 dark:bg-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-black dark:hover:bg-white/20 transition-all active:scale-95"
            >
              Add
            </button>
          </div>
        </section>

        {/* Work & Education */}
        <section className="space-y-8">
          <div className="space-y-3">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Occupation</label>
            <input
              type="text"
              value={formData.occupation}
              onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
              className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-brand-500/50 transition-all font-bold text-gray-900 dark:text-white"
              placeholder="What do you do?"
            />
          </div>
          <div className="space-y-3">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Education</label>
            <input
              type="text"
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-brand-500/50 transition-all font-bold text-gray-900 dark:text-white"
              placeholder="Where did you study?"
            />
          </div>
        </section>
      </div>
    </div>
  );
};
