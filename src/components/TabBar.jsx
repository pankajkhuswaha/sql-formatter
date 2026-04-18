import { useState } from "react";

export default function TabBar({ activeTab, onTabChange }) {
  const tabs = [
    { id: "configure", label: "Configure", icon: "⚙️" },
    { id: "format", label: "Format", icon: "✨" },
  ];

  return (
    <div className="relative flex items-center gap-1 p-1 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          id={`tab-${tab.id}`}
          onClick={() => onTabChange(tab.id)}
          className={`
            relative z-10 flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold
            transition-all duration-300 ease-out cursor-pointer
            ${
              activeTab === tab.id
                ? "text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/25"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }
          `}
        >
          <span className="text-base">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
