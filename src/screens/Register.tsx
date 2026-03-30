import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { motion } from "motion/react";
import { auth } from "../firebase";
import { Heart, Mail, Lock, ChevronLeft, UserPlus, Sparkles } from "lucide-react";

export const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/onboarding");
    } catch (err: any) {
      if (err.code === "auth/operation-not-allowed") {
        setError("Email/Password sign-in is not enabled in the Firebase Console. Please enable it in the Auth settings.");
      } else {
        setError(err.message || "Failed to register");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-8 bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white items-center justify-center">
      <div className="w-full max-w-sm">
        <button 
          onClick={() => navigate("/welcome")} 
          className="p-3 mb-8 -ml-2 w-fit bg-gray-50 dark:bg-white/5 rounded-2xl text-gray-500 hover:text-brand-500 transition-all active:scale-95"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex flex-col items-center mb-10 text-center">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-brand-500 rounded-full blur-2xl opacity-20 animate-pulse" />
            <div className="relative p-4 bg-brand-500 rounded-[1.5rem] shadow-2xl shadow-brand-500/40">
              <UserPlus size={32} color="white" fill="white" />
            </div>
          </motion.div>
          <h1 className="mt-8 text-4xl font-black tracking-tighter uppercase italic text-brand-500 leading-none">Join Us</h1>
          <p className="mt-3 text-gray-500 font-bold uppercase tracking-widest text-[9px]">Start your journey to find true love</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
        <div className="space-y-3">
          <div className="relative group">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all font-bold text-gray-900 dark:text-white placeholder:text-gray-400 text-sm"
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors" size={18} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all font-bold text-gray-900 dark:text-white placeholder:text-gray-400 text-sm"
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors" size={18} />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-white/5 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all font-bold text-gray-900 dark:text-white placeholder:text-gray-400 text-sm"
              required
            />
          </div>
        </div>

        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-bold text-center text-red-500 uppercase tracking-widest"
          >
            {error}
          </motion.p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 font-black uppercase tracking-widest text-xs text-white bg-brand-500 rounded-2xl shadow-2xl shadow-brand-500/30 hover:bg-brand-600 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Sparkles size={16} className="mr-2" />
              Sign Up
            </>
          )}
        </button>

        <p className="text-xs font-bold text-center text-gray-500 uppercase tracking-widest">
          Already have an account? <Link to="/login" className="text-brand-500 hover:underline">Login</Link>
        </p>
      </form>
      </div>
    </div>
  );
};
