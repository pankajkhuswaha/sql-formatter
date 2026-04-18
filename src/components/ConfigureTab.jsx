import { useState, useEffect } from "react";
import { extractStyle } from "../lib/groqClient";

export default function ConfigureTab({ onStyleExtracted }) {
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem("groqApiKey") || ""
  );
  const [sampleSQL, setSampleSQL] = useState("");
  const [styleRules, setStyleRules] = useState(() => {
    const saved = localStorage.getItem("sqlStyleRules");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Sync API key to localStorage on every keystroke
  useEffect(() => {
    localStorage.setItem("groqApiKey", apiKey);
  }, [apiKey]);

  const handleExtractStyle = async () => {
    if (!sampleSQL.trim()) {
      setError("Please paste a sample SQL query first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const rules = await extractStyle(sampleSQL);
      localStorage.setItem("sqlStyleRules", JSON.stringify(rules));
      setStyleRules(rules);
      onStyleExtracted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearStyle = () => {
    localStorage.removeItem("sqlStyleRules");
    setStyleRules(null);
    onStyleExtracted(false);
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* API Key Input */}
      <div className="space-y-2">
        <label
          htmlFor="api-key-input"
          className="flex items-center gap-2 text-sm font-medium text-slate-300"
        >
          <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          Groq API Key
        </label>
        <input
          id="api-key-input"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxx"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white
                     placeholder-slate-500 font-mono text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
                     transition-all duration-200"
        />
        <p className="text-xs text-slate-500">
          Get your free key at{" "}
          <a
            href="https://console.groq.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
          >
            console.groq.com
          </a>
        </p>
      </div>

      {/* Sample SQL Input */}
      <div className="space-y-2">
        <label
          htmlFor="sample-sql-input"
          className="flex items-center gap-2 text-sm font-medium text-slate-300"
        >
          <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
          Sample SQL Query
        </label>
        <textarea
          id="sample-sql-input"
          value={sampleSQL}
          onChange={(e) => setSampleSQL(e.target.value)}
          placeholder={`Paste a SQL query formatted in YOUR preferred style, e.g.:\n\nSELECT\n    u.id,\n    u.name,\n    u.email\nFROM users u\nWHERE u.active = 1\nORDER BY u.name ASC;`}
          rows={10}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white
                     placeholder-slate-500 font-mono text-sm leading-relaxed resize-none
                     focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50
                     transition-all duration-200"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          id="extract-style-btn"
          onClick={handleExtractStyle}
          disabled={loading}
          className="relative flex items-center gap-2 px-6 py-3 
                     bg-gradient-to-r from-indigo-500 to-purple-500
                     hover:from-indigo-400 hover:to-purple-400
                     disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed
                     text-white font-semibold text-sm rounded-xl
                     shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40
                     transition-all duration-300 cursor-pointer"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <span>🔍</span>
              Extract My Style
            </>
          )}
        </button>

        {styleRules && (
          <button
            id="clear-style-btn"
            onClick={handleClearStyle}
            className="flex items-center gap-2 px-5 py-3
                       bg-white/5 border border-white/10
                       hover:bg-red-500/10 hover:border-red-500/30
                       text-slate-400 hover:text-red-400
                       font-medium text-sm rounded-xl
                       transition-all duration-300 cursor-pointer"
          >
            <span>🗑️</span>
            Clear Style
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="animate-slide-up flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <span className="text-red-400 text-lg">⚠️</span>
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Style Preview */}
      {styleRules && (
        <div className="animate-slide-up space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-lg">✅</span>
            <h3 className="text-sm font-semibold text-slate-300">
              Extracted Style Rules
            </h3>
          </div>
          <pre
            id="style-preview"
            className="p-4 bg-black/30 border border-white/10 rounded-xl
                       text-emerald-300 text-xs font-mono leading-relaxed
                       overflow-x-auto"
          >
            {JSON.stringify(styleRules, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
