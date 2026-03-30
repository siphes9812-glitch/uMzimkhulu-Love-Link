import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";
import { Camera, MapPin, ChevronRight, ChevronLeft, Heart, Sparkles, User, Calendar, Target } from "lucide-react";

export const Onboarding: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    displayName: "",
    age: 18,
    gender: "male",
    interestedIn: "female",
    bio: "",
    photos: ["https://picsum.photos/seed/user/400/600"],
    interests: [],
    location: { city: "New York", latitude: 40.7128, longitude: -74.0060 },
  });

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleFinish = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const profileData = {
        ...formData,
        uid: user.uid,
        email: user.email,
        role: "user",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(doc(db, "users", user.uid), profileData);
      window.location.href = "/"; // Force reload to refresh auth context
    } catch (error) {
      console.error("Error creating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: "Basics", icon: <User size={16} /> },
    { title: "Identity", icon: <Target size={16} /> },
    { title: "Profile", icon: <Camera size={16} /> },
    { title: "Location", icon: <MapPin size={16} /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white items-center">
      <div className="w-full max-w-md flex flex-col min-h-screen p-6">
        <div className="flex items-center justify-between mb-8">
        {step > 1 ? (
          <button 
            onClick={prevStep} 
            className="p-2.5 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-500 hover:text-brand-500 transition-all active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
        ) : <div className="w-[44px]" />}
        
        <div className="flex items-center space-x-1.5">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center">
              <div
                className={`h-1.5 w-6 rounded-full transition-all duration-500 ${
                  step > i ? "bg-brand-500" : "bg-gray-100 dark:bg-white/5"
                } ${step === i + 1 ? "w-10 bg-brand-500" : ""}`}
              />
            </div>
          ))}
        </div>
        <div className="w-[44px]" />
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="flex-grow flex flex-col"
          >
            <div className="mb-8">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-500 bg-brand-500/10 px-2.5 py-0.5 rounded-full">Step 01</span>
              <h2 className="mt-3 text-4xl font-black tracking-tighter uppercase italic leading-none">What's your <span className="text-brand-500">name?</span></h2>
              <p className="mt-3 text-gray-500 font-bold uppercase tracking-widest text-[9px]">This is how you'll appear on Umzimkhulu Love Link.</p>
            </div>

            <div className="space-y-8 max-w-sm">
              <div className="group">
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 group-focus-within:text-brand-500 transition-colors">First Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="w-full px-0 py-3 text-2xl font-black bg-transparent border-b-2 border-gray-100 dark:border-white/5 focus:outline-none focus:border-brand-500 transition-all placeholder:text-gray-200 dark:placeholder:text-white/5"
                />
              </div>
              <div className="group">
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 group-focus-within:text-brand-500 transition-colors">Your Age</label>
                <div className="flex items-center space-x-3">
                  <Calendar className="text-brand-500" size={20} />
                  <input
                    type="number"
                    min="18"
                    max="100"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                    className="w-full max-w-[100px] px-0 py-3 text-2xl font-black bg-transparent border-b-2 border-gray-100 dark:border-white/5 focus:outline-none focus:border-brand-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="flex-grow flex flex-col"
          >
            <div className="mb-8">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-500 bg-brand-500/10 px-2.5 py-0.5 rounded-full">Step 02</span>
              <h2 className="mt-3 text-4xl font-black tracking-tighter uppercase italic leading-none">Tell us <span className="text-brand-500">more</span></h2>
              <p className="mt-3 text-gray-500 font-bold uppercase tracking-widest text-[9px]">Help us find the right people for you.</p>
            </div>

            <div className="space-y-10">
              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">I am a</label>
                <div className="grid grid-cols-3 gap-3">
                  {["male", "female", "other"].map((g) => (
                    <button
                      key={g}
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={`py-4 rounded-2xl border-2 font-black uppercase tracking-widest text-[9px] transition-all active:scale-95 ${
                        formData.gender === g
                          ? "border-brand-500 bg-brand-500 text-white shadow-xl shadow-brand-500/30"
                          : "border-gray-100 dark:border-white/5 text-gray-400"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Interested in</label>
                <div className="grid grid-cols-3 gap-3">
                  {["male", "female", "both"].map((i) => (
                    <button
                      key={i}
                      onClick={() => setFormData({ ...formData, interestedIn: i })}
                      className={`py-4 rounded-2xl border-2 font-black uppercase tracking-widest text-[9px] transition-all active:scale-95 ${
                        formData.interestedIn === i
                          ? "border-brand-500 bg-brand-500 text-white shadow-xl shadow-brand-500/30"
                          : "border-gray-100 dark:border-white/5 text-gray-400"
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="flex-grow flex flex-col"
          >
            <div className="mb-8">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-500 bg-brand-500/10 px-2.5 py-0.5 rounded-full">Step 03</span>
              <h2 className="mt-3 text-4xl font-black tracking-tighter uppercase italic leading-none">Your <span className="text-brand-500">Vibe</span></h2>
              <p className="mt-3 text-gray-500 font-bold uppercase tracking-widest text-[9px]">Show off your personality!</p>
            </div>

            <div className="space-y-8 max-w-sm">
              <div className="flex justify-center">
                <div className="relative w-40 h-56 bg-gray-100 dark:bg-white/5 rounded-[2rem] overflow-hidden border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center group cursor-pointer transition-all hover:border-brand-500/50">
                  <img src={formData.photos[0]} alt="Profile" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" />
                  <div className="relative z-10 p-3 bg-white dark:bg-[#0a0a0a] rounded-xl shadow-xl group-hover:scale-110 transition-transform">
                    <Camera size={20} className="text-brand-500" />
                  </div>
                  <span className="mt-3 text-[9px] font-black uppercase tracking-widest relative z-10 text-gray-500">Change Photo</span>
                </div>
              </div>
              <div className="group">
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 group-focus-within:text-brand-500 transition-colors">About Me</label>
                <textarea
                  placeholder="Write a little about yourself..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/20 transition-all min-h-[120px] font-bold text-gray-900 dark:text-white placeholder:text-gray-400 text-sm"
                />
              </div>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="flex-grow flex flex-col"
          >
            <div className="mb-8">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-500 bg-brand-500/10 px-2.5 py-0.5 rounded-full">Step 04</span>
              <h2 className="mt-3 text-4xl font-black tracking-tighter uppercase italic leading-none">Almost <span className="text-brand-500">there!</span></h2>
              <p className="mt-3 text-gray-500 font-bold uppercase tracking-widest text-[9px]">Where are you located?</p>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center text-center">
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="relative mb-8"
              >
                <div className="absolute inset-0 bg-brand-500 rounded-full blur-3xl opacity-20" />
                <div className="relative p-8 bg-brand-500 rounded-[2.5rem] text-white shadow-2xl shadow-brand-500/40">
                  <MapPin size={48} />
                </div>
              </motion.div>
              <h3 className="text-3xl font-black tracking-tighter uppercase italic text-brand-500">{formData.location.city}</h3>
              <p className="mt-3 text-gray-500 font-bold uppercase tracking-widest text-[9px] max-w-[180px]">We'll use your location to find matches nearby.</p>
              <button className="mt-6 text-brand-500 font-black uppercase tracking-widest text-[9px] hover:underline decoration-2 underline-offset-4">Change Location</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8">
        <button
          onClick={step === 4 ? handleFinish : nextStep}
          disabled={loading || (step === 1 && !formData.displayName)}
          className="w-full py-4.5 flex items-center justify-center font-black uppercase tracking-[0.2em] text-xs text-white bg-brand-500 rounded-2xl shadow-2xl shadow-brand-500/30 hover:bg-brand-600 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {step === 4 ? "Start Matching" : "Continue"}
              {step < 4 && <ChevronRight size={18} className="ml-2" />}
              {step === 4 && <Sparkles size={18} className="ml-2" />}
            </>
          )}
        </button>
      </div>
      </div>
    </div>
  );
};
