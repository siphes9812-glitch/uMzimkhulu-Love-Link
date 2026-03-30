import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, getDocs, limit, orderBy } from "firebase/firestore";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../AuthContext";
import { db } from "../firebase";
import { UserProfile, Report } from "../types";
import { ChevronLeft, Users, ShieldAlert, BarChart3, Trash2, Ban, CheckCircle, XCircle, Sparkles, Heart, Activity, ShieldCheck } from "lucide-react";

export const AdminDashboard: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"users" | "reports" | "stats">("stats");

  useEffect(() => {
    if (!profile || profile.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const usersSnap = await getDocs(query(collection(db, "users"), limit(50)));
        setUsers(usersSnap.docs.map(doc => doc.data() as UserProfile));

        const reportsSnap = await getDocs(query(collection(db, "reports"), orderBy("createdAt", "desc"), limit(50)));
        setReports(reportsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report)));
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profile, navigate]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-[#0a0a0a]">
      <div className="relative">
        <div className="absolute inset-0 bg-brand-500 rounded-full blur-2xl opacity-20 animate-pulse" />
        <div className="w-16 h-16 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
      </div>
      <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-brand-500 animate-pulse">Accessing Secure Vault</p>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a] pb-32">
      <header className="px-8 py-8 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-20 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate("/profile")} 
              className="p-3 -ml-3 bg-gray-50 dark:bg-white/5 rounded-2xl text-gray-500 hover:text-brand-500 transition-all active:scale-95"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="ml-4">
              <h1 className="text-2xl font-black tracking-tighter uppercase italic text-brand-500 leading-none">Admin Panel</h1>
              <p className="mt-1 text-gray-400 font-bold uppercase tracking-widest text-[10px] flex items-center">
                <ShieldCheck size={12} className="mr-1 text-green-500" />
                Secure Access Granted
              </p>
            </div>
          </div>
          <div className="p-3 bg-brand-500/10 rounded-2xl">
            <Activity size={20} className="text-brand-500" />
          </div>
        </div>
        
        <div className="flex mt-8 p-1.5 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5">
          {[
            { id: "stats", label: "Stats", icon: <BarChart3 size={18} /> },
            { id: "users", label: "Users", icon: <Users size={18} /> },
            { id: "reports", label: "Reports", icon: <ShieldAlert size={18} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-grow flex items-center justify-center py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === tab.id 
                  ? "bg-white dark:bg-white/10 text-brand-500 shadow-xl shadow-brand-500/10" 
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="p-8">
        <AnimatePresence mode="wait">
          {activeTab === "stats" && (
            <motion.div 
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Total Users", value: users.length, color: "text-gray-900 dark:text-white", icon: <Users size={16} /> },
                  { label: "Active Today", value: 12, color: "text-brand-500", icon: <Activity size={16} /> },
                  { label: "Total Matches", value: 48, color: "text-blue-500", icon: <Heart size={16} /> },
                  { label: "Open Reports", value: reports.filter(r => r.status === 'pending').length, color: "text-red-500", icon: <ShieldAlert size={16} /> }
                ].map((stat, i) => (
                  <div key={i} className="p-6 bg-gray-50 dark:bg-white/5 rounded-[2.5rem] border border-gray-100 dark:border-white/5 group hover:border-brand-500/20 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-white dark:bg-white/5 rounded-xl text-gray-400 group-hover:text-brand-500 transition-colors">
                        {stat.icon}
                      </div>
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <h3 className={`text-4xl font-black tracking-tighter italic ${stat.color}`}>{stat.value}</h3>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "users" && (
            <motion.div 
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {users.map((user, i) => (
                <motion.div 
                  key={user.uid} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-5 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5 group hover:border-brand-500/20 transition-all"
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <img src={user.photos?.[0]} alt={user.displayName} className="w-14 h-14 rounded-2xl object-cover border-2 border-white dark:border-[#0a0a0a] shadow-lg" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-[#0a0a0a] rounded-full" />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-black uppercase tracking-widest text-[11px] text-gray-900 dark:text-white">{user.displayName}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-3 bg-white dark:bg-white/5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-95">
                      <Ban size={18} />
                    </button>
                    <button className="p-3 bg-white dark:bg-white/5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-95">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "reports" && (
            <motion.div 
              key="reports"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {reports.length > 0 ? (
                reports.map((report, i) => (
                  <motion.div 
                    key={report.id} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-6 bg-red-50/30 dark:bg-red-900/5 rounded-[2.5rem] border border-red-100 dark:border-red-900/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-red-500 rounded-xl text-white">
                          <ShieldAlert size={16} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-red-600">
                          {report.reason}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {new Date(report.createdAt.toString()).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-6 leading-relaxed bg-white dark:bg-[#0a0a0a]/40 p-4 rounded-2xl border border-red-100/50 dark:border-red-900/10">
                      {report.details || "No additional details provided."}
                    </p>
                    <div className="flex space-x-3">
                      <button className="flex-grow py-4 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-green-600 transition-all flex items-center justify-center shadow-lg shadow-green-500/20 active:scale-95">
                        <CheckCircle size={16} className="mr-2" />
                        Resolve
                      </button>
                      <button className="flex-grow py-4 bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all flex items-center justify-center active:scale-95">
                        <XCircle size={16} className="mr-2" />
                        Dismiss
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                  <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-full mb-6">
                    <Sparkles size={48} className="text-gray-200" />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tighter italic text-gray-400">All Clear!</h3>
                  <p className="mt-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest">No pending reports to review.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
