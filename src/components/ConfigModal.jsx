import { useState, useEffect } from "react";
import { extractStyle } from "../lib/groqClient";

export default function ConfigModal({ onClose, onConfigured, onClearConfig, isConfigured }) {
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem("groqApiKey") || ""
  );
  const [sampleSQL, setSampleSQL] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      onConfigured();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-surface-900 rounded-2xl shadow-2xl shadow-black/20 border border-surface-200 dark:border-white/10 overflow-hidden flex flex-col animate-scale-in">
        <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-white/10">
          <h3 className="text-lg font-semibold text-surface-800 dark:text-white flex items-center gap-2">
            <span className="text-accent-500">⚙️</span> Configuration
          </h3>
          <button
            onClick={onClose}
            className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          {isConfigured && (
             <div className="p-4 bg-sage-50 dark:bg-sage-500/10 border border-sage-200 dark:border-sage-500/20 rounded-xl flex items-center justify-between">
                <span className="text-sage-600 dark:text-sage-400 text-sm font-medium">Style is currently configured.</span>
                <button
                  onClick={() => {
                    onClearConfig();
                    setSampleSQL("");
                  }}
                  className="text-xs px-3 py-1.5 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors"
                >
                  Clear Style
                </button>
             </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Groq API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="gsk_..."
              className="w-full px-4 py-2.5 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/50 transition-all"
            />
            <p className="text-xs text-surface-500">
               Get yours at <a href="https://console.groq.com" target="_blank" rel="noreferrer" className="text-accent-500 hover:underline">console.groq.com</a>
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Sample SQL</label>
            <textarea
              value={sampleSQL}
              onChange={(e) => setSampleSQL(e.target.value)}
              placeholder="Paste a query formatted exactly how you like it..."
              rows={6}
              className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent-500/50 transition-all"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-surface-200 dark:border-white/10 bg-surface-50/50 dark:bg-surface-800/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExtractStyle}
            disabled={loading || !sampleSQL.trim()}
            className="px-6 py-2.5 bg-accent-600 hover:bg-accent-500 disabled:bg-surface-300 dark:disabled:bg-surface-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-accent-500/25 transition-all flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing...
              </>
            ) : "Save Configuration"}
          </button>
        </div>
      </div>
    </div>
  );
}
