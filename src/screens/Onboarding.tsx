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
    <div className="flex flex-col min-h-screen p-8 bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white">
      <div className="flex items-center justify-between mb-12">
        {step > 1 ? (
          <button 
            onClick={prevStep} 
            className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl text-gray-500 hover:text-brand-500 transition-all active:scale-95"
          >
            <ChevronLeft size={24} />
          </button>
        ) : <div className="w-[52px]" />}
        
        <div className="flex items-center space-x-2">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center">
              <div
                className={`h-2 w-8 rounded-full transition-all duration-500 ${
                  step > i ? "bg-brand-500" : "bg-gray-100 dark:bg-white/5"
                } ${step === i + 1 ? "w-12 bg-brand-500" : ""}`}
              />
            </div>
          ))}
        </div>
        <div className="w-[52px]" />
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
            <div className="mb-10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-500 bg-brand-500/10 px-3 py-1 rounded-full">Step 01</span>
              <h2 className="mt-4 text-5xl font-black tracking-tighter uppercase italic leading-none">What's your <span className="text-brand-500">name?</span></h2>
              <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-[10px]">This is how you'll appear on Umzimkhulu Love Link.</p>
            </div>

            <div className="space-y-10">
              <div className="group">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 group-focus-within:text-brand-500 transition-colors">First Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="w-full px-0 py-4 text-3xl font-black bg-transparent border-b-4 border-gray-100 dark:border-white/5 focus:outline-none focus:border-brand-500 transition-all placeholder:text-gray-200 dark:placeholder:text-white/5"
                />
              </div>
              <div className="group">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 group-focus-within:text-brand-500 transition-colors">Your Age</label>
                <div className="flex items-center space-x-4">
                  <Calendar className="text-brand-500" size={24} />
                  <input
                    type="number"
                    min="18"
                    max="100"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                    className="w-full px-0 py-4 text-3xl font-black bg-transparent border-b-4 border-gray-100 dark:border-white/5 focus:outline-none focus:border-brand-500 transition-all"
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
            <div className="mb-10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-500 bg-brand-500/10 px-3 py-1 rounded-full">Step 02</span>
              <h2 className="mt-4 text-5xl font-black tracking-tighter uppercase italic leading-none">Tell us <span className="text-brand-500">more</span></h2>
              <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-[10px]">Help us find the right people for you.</p>
            </div>

            <div className="space-y-12">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">I am a</label>
                <div className="grid grid-cols-3 gap-4">
                  {["male", "female", "other"].map((g) => (
                    <button
                      key={g}
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={`py-5 rounded-[2rem] border-4 font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 ${
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
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Interested in</label>
                <div className="grid grid-cols-3 gap-4">
                  {["male", "female", "both"].map((i) => (
                    <button
                      key={i}
                      onClick={() => setFormData({ ...formData, interestedIn: i })}
                      className={`py-5 rounded-[2rem] border-4 font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 ${
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
            <div className="mb-10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-500 bg-brand-500/10 px-3 py-1 rounded-full">Step 03</span>
              <h2 className="mt-4 text-5xl font-black tracking-tighter uppercase italic leading-none">Your <span className="text-brand-500">Vibe</span></h2>
              <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-[10px]">Show off your personality!</p>
            </div>

            <div className="space-y-10">
              <div className="flex justify-center">
                <div className="relative w-48 h-64 bg-gray-100 dark:bg-white/5 rounded-[3rem] overflow-hidden border-4 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center group cursor-pointer transition-all hover:border-brand-500/50">
                  <img src={formData.photos[0]} alt="Profile" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" />
                  <div className="relative z-10 p-4 bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-xl group-hover:scale-110 transition-transform">
                    <Camera size={24} className="text-brand-500" />
                  </div>
                  <span className="mt-4 text-[10px] font-black uppercase tracking-widest relative z-10 text-gray-500">Change Photo</span>
                </div>
              </div>
              <div className="group">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 group-focus-within:text-brand-500 transition-colors">About Me</label>
                <textarea
                  placeholder="Write a little about yourself..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-6 py-5 bg-gray-50 dark:bg-white/5 border-none rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-brand-500/20 transition-all min-h-[140px] font-bold text-gray-900 dark:text-white placeholder:text-gray-400"
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
            <div className="mb-10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-500 bg-brand-500/10 px-3 py-1 rounded-full">Step 04</span>
              <h2 className="mt-4 text-5xl font-black tracking-tighter uppercase italic leading-none">Almost <span className="text-brand-500">there!</span></h2>
              <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-[10px]">Where are you located?</p>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center text-center">
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="relative mb-10"
              >
                <div className="absolute inset-0 bg-brand-500 rounded-full blur-3xl opacity-20" />
                <div className="relative p-10 bg-brand-500 rounded-[3rem] text-white shadow-2xl shadow-brand-500/40">
                  <MapPin size={64} />
                </div>
              </motion.div>
              <h3 className="text-4xl font-black tracking-tighter uppercase italic text-brand-500">{formData.location.city}</h3>
              <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-[10px] max-w-[200px]">We'll use your location to find matches nearby.</p>
              <button className="mt-8 text-brand-500 font-black uppercase tracking-widest text-[10px] hover:underline decoration-4 underline-offset-8">Change Location</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-12">
        <button
          onClick={step === 4 ? handleFinish : nextStep}
          disabled={loading || (step === 1 && !formData.displayName)}
          className="w-full py-6 flex items-center justify-center font-black uppercase tracking-[0.2em] text-sm text-white bg-brand-500 rounded-[2rem] shadow-2xl shadow-brand-500/30 hover:bg-brand-600 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {step === 4 ? "Start Matching" : "Continue"}
              {step < 4 && <ChevronRight size={20} className="ml-2" />}
              {step === 4 && <Sparkles size={20} className="ml-2" />}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
