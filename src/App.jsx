import { useState, useEffect } from "react";
import TabBar from "./components/TabBar";
import ConfigureTab from "./components/ConfigureTab";
import FormatTab from "./components/FormatTab";

export default function App() {
  const [activeTab, setActiveTab] = useState("configure");
  const [hasStyle, setHasStyle] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("sqlStyleRules");
    setHasStyle(!!saved);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-950 via-surface-900 to-slate-900 text-white">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <span className="text-xl">⚡</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              SQL Formatter
            </h1>
          </div>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Teach it your style once with AI — format every query instantly with pure JavaScript
          </p>
        </header>

        {/* Tab Bar */}
        <div className="flex justify-center mb-8">
          <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Tab Content */}
        <main className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/20">
          {activeTab === "configure" ? (
            <ConfigureTab onStyleExtracted={setHasStyle} />
          ) : (
            <FormatTab hasStyle={hasStyle} />
          )}
        </main>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="text-slate-600 text-xs">
            AI used once for style extraction • Formatting is 100% local JavaScript
          </p>
        </footer>
      </div>
    </div>
  );
}
