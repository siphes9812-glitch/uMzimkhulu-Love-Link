import React from "react";
import { NavLink } from "react-router-dom";
import { Heart, MessageCircle, User, Compass } from "lucide-react";

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
      <div className="glass rounded-[2rem] px-6 py-4 flex items-center justify-between shadow-2xl">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center transition-all duration-300 ${
              isActive ? "text-brand-500 scale-110" : "text-gray-400 hover:text-gray-600"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Compass size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">Discover</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/matches"
          className={({ isActive }) =>
            `flex flex-col items-center transition-all duration-300 ${
              isActive ? "text-brand-500 scale-110" : "text-gray-400 hover:text-gray-600"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Heart size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">Matches</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/chats"
          className={({ isActive }) =>
            `flex flex-col items-center transition-all duration-300 ${
              isActive ? "text-brand-500 scale-110" : "text-gray-400 hover:text-gray-600"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <MessageCircle size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">Chats</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center transition-all duration-300 ${
              isActive ? "text-brand-500 scale-110" : "text-gray-400 hover:text-gray-600"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <User size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">Profile</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
};
