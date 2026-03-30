import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { motion } from "motion/react";
import { ChevronLeft, Bell, Shield, Eye, HelpCircle, FileText, Trash2, LogOut, ChevronRight, Sparkles, Heart } from "lucide-react";

export const Settings: React.FC = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const settingsGroups = [
    {
      title: "Account",
      items: [
        { icon: <Bell size={20} />, label: "Notifications", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
        { icon: <Shield size={20} />, label: "Privacy & Safety", color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
        { icon: <Eye size={20} />, label: "Visibility", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
      ]
    },
    {
      title: "Support",
      items: [
        { icon: <HelpCircle size={20} />, label: "Help Center", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
        { icon: <FileText size={20} />, label: "Terms of Service", color: "text-gray-500", bg: "bg-gray-50 dark:bg-white/5" },
        { icon: <FileText size={20} />, label: "Privacy Policy", color: "text-gray-500", bg: "bg-gray-50 dark:bg-white/5" },
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a] pb-32">
      <header className="flex items-center px-8 py-6 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-20 border-b border-gray-100 dark:border-white/5">
        <button 
          onClick={() => navigate("/profile")} 
          className="p-3 -ml-3 bg-gray-50 dark:bg-white/5 rounded-2xl text-gray-500 hover:text-brand-500 transition-all active:scale-95"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="ml-4">
          <h1 className="text-2xl font-black tracking-tighter uppercase italic text-brand-500 leading-none">Settings</h1>
          <p className="mt-1 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Customize your experience</p>
        </div>
      </header>

      <div className="p-8 space-y-12">
        {settingsGroups.map((group, i) => (
          <section key={i}>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 px-2 flex items-center">
              <Sparkles size={12} className="mr-2 text-brand-500" />
              {group.title}
            </h3>
            <div className="space-y-3">
              {group.items.map((item, j) => (
                <motion.button
                  key={j}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-between w-full p-5 bg-gray-50 dark:bg-white/5 rounded-[2rem] transition-all group"
                >
                  <div className="flex items-center">
                    <div className={`p-3 rounded-2xl ${item.bg} ${item.color} mr-5 group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <span className="font-black uppercase tracking-widest text-[11px] text-gray-700 dark:text-gray-300">{item.label}</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-brand-500 transition-colors" />
                </motion.button>
              ))}
            </div>
          </section>
        ))}

        <section>
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 px-2 flex items-center">
            <Heart size={12} className="mr-2 text-brand-500" />
            Actions
          </h3>
          <div className="space-y-4">
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={signOut}
              className="flex items-center justify-between w-full p-5 bg-gray-50 dark:bg-white/5 rounded-[2rem] transition-all group border border-transparent hover:border-brand-500/20"
            >
              <div className="flex items-center">
                <div className="p-3 bg-gray-100 dark:bg-white/10 rounded-2xl text-gray-500 mr-5 group-hover:bg-brand-500 group-hover:text-white transition-all">
                  <LogOut size={20} />
                </div>
                <span className="font-black uppercase tracking-widest text-[11px] text-gray-700 dark:text-gray-300">Logout</span>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-brand-500 transition-colors" />
            </motion.button>

            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-between w-full p-5 bg-red-50/50 dark:bg-red-900/10 rounded-[2rem] transition-all group border border-transparent hover:border-red-500/20"
            >
              <div className="flex items-center">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-2xl text-red-500 mr-5 group-hover:bg-red-500 group-hover:text-white transition-all">
                  <Trash2 size={20} />
                </div>
                <span className="font-black uppercase tracking-widest text-[11px] text-red-600">Delete Account</span>
              </div>
              <ChevronRight size={18} className="text-red-300 group-hover:text-red-500 transition-colors" />
            </motion.button>
          </div>
        </section>

        <div className="text-center py-12">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-full mb-4">
            <Heart size={12} className="text-brand-500 fill-brand-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Umzimkhulu Love Link v1.0.0</span>
          </div>
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Made with passion for true connection</p>
        </div>
      </div>
    </div>
  );
};
