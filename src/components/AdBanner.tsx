import React from "react";

export const AdBanner: React.FC = () => {
  return (
    <div className="w-full p-2 bg-gray-50 dark:bg-gray-800 border-y border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center">
      <span className="text-[8px] text-gray-400 uppercase tracking-widest mb-1">Sponsored</span>
      <div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-xs font-medium italic">
        AdMob Banner Placeholder
      </div>
    </div>
  );
};
