import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Mail, Chrome } from "lucide-react";
import { useAuth } from "../AuthContext";

export const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (error) {
      console.error("Google sign in failed:", error);
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1516589174184-c685266e430c?auto=format&fit=crop&q=80&w=1000" 
          alt="Welcome" 
          className="w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col px-8 pb-12">
        <div className="mt-20">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex items-center space-x-3"
          >
            <div className="p-2 bg-brand-500 rounded-xl">
              <Heart size={24} fill="white" className="text-white" />
            </div>
            <span className="text-white font-black tracking-tighter text-2xl uppercase italic">LoveLink</span>
          </motion.div>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-12"
          >
            <h1 className="text-6xl font-black text-white leading-[0.9] tracking-tighter uppercase italic">
              Find Your<br />
              <span className="text-brand-500">Perfect</span><br />
              Match.
            </h1>
            <p className="mt-6 text-gray-300 text-lg font-medium max-w-[280px] leading-relaxed">
              The only dating app that's 100% free, forever. No hidden costs.
            </p>
          </motion.div>
        </div>

        <div className="mt-auto space-y-4">
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center space-x-3 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-100 transition-all active:scale-[0.98]"
          >
            <Chrome size={20} />
            <span>Continue with Google</span>
          </motion.button>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            onClick={() => navigate("/register")}
            className="w-full flex items-center justify-center space-x-3 py-4 bg-brand-500 text-white font-bold rounded-2xl shadow-lg shadow-brand-500/20 hover:bg-brand-600 transition-all active:scale-[0.98]"
          >
            <Mail size={20} />
            <span>Sign up with Email</span>
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="pt-4 text-center"
          >
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <button 
                onClick={() => navigate("/login")}
                className="text-white font-bold underline underline-offset-4"
              >
                Log in
              </button>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Decorative Rail Text */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:block">
        <p className="writing-vertical-rl rotate-180 text-[10px] font-bold tracking-[0.3em] text-white/20 uppercase">
          Authentic • Free • Inclusive • Love
        </p>
      </div>
    </div>
  );
};
