import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export const Splash: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#0a0502] overflow-hidden">
      {/* Atmospheric Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-30 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #f43f5e 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #be123c 0%, transparent 70%)' }}
        />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 1.2, 
          ease: "easeOut"
        }}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="p-6 bg-brand-500 rounded-[2.5rem] shadow-2xl shadow-brand-500/40"
        >
          <Heart size={64} fill="white" className="text-white" />
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-8 text-center"
        >
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">
            LoveLink
          </h1>
          <div className="mt-2 h-1 w-12 bg-brand-500 mx-auto rounded-full" />
          <p className="mt-4 text-brand-100/60 font-medium tracking-widest uppercase text-[10px]">
            Connecting hearts for free
          </p>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-12 left-0 right-0 flex justify-center">
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 h-1.5 bg-brand-500 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
