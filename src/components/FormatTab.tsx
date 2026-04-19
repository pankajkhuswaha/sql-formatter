import { useState } from 'react';
import { formatSQL } from '../lib/sqlFormatter';
import { readStoredRules } from '../lib/storage';

interface FormatTabProps {
  hasStyle: boolean;
}

export default function FormatTab({ hasStyle }: FormatTabProps) {
  const [inputSQL, setInputSQL] = useState('');
  const [outputSQL, setOutputSQL] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    if (!inputSQL.trim()) return;

    const rules = readStoredRules();
    if (!rules) return;

    const formatted = formatSQL(inputSQL, rules);
    setOutputSQL(formatted);
  };

  const handleCopy = async () => {
    if (!outputSQL) return;
    try {
      await navigator.clipboard.writeText(outputSQL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = outputSQL;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {!hasStyle && (
        <div className="animate-slide-up flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <span className="text-amber-400 text-xl">!</span>
          <div>
            <p className="text-amber-300 text-sm font-semibold">
              No style configured
            </p>
            <p className="text-amber-400/70 text-xs mt-1">
              Switch to the Configure tab, paste a sample query, and click
              {' '}
              &ldquo;Extract My Style&rdquo; first.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="format-sql-input"
          className="flex items-center gap-2 text-sm font-medium text-slate-300"
        >
          <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Paste SQL to Format
        </label>
        <textarea
          id="format-sql-input"
          value={inputSQL}
          onChange={(e) => setInputSQL(e.target.value)}
          placeholder="Paste any SQL query here..."
          rows={10}
          disabled={!hasStyle}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white
                     placeholder-slate-500 font-mono text-sm leading-relaxed resize-none
                     focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50
                     disabled:opacity-40 disabled:cursor-not-allowed
                     transition-all duration-200"
        />
      </div>

      <button
        id="format-sql-btn"
        onClick={handleFormat}
        disabled={!hasStyle || !inputSQL.trim()}
        className="flex items-center gap-2 px-6 py-3
                   bg-gradient-to-r from-cyan-500 to-blue-500
                   hover:from-cyan-400 hover:to-blue-400
                   disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed
                   text-white font-semibold text-sm rounded-xl
                   shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40
                   transition-all duration-300 cursor-pointer"
      >
        <span>*</span>
        Format SQL
      </button>

      {outputSQL && (
        <div className="animate-slide-up space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 text-lg">SQL</span>
              <h3 className="text-sm font-semibold text-slate-300">
                Formatted Output
              </h3>
            </div>
            <button
              id="copy-output-btn"
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2
                         bg-white/5 border border-white/10
                         hover:bg-white/10 hover:border-white/20
                         text-slate-400 hover:text-white
                         font-medium text-xs rounded-lg
                         transition-all duration-200 cursor-pointer"
            >
              {copied ? (
                <>
                  <span className="text-green-400">OK</span>
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
          <pre
            id="formatted-output"
            className="p-4 bg-black/30 border border-white/10 rounded-xl
                       text-cyan-200 text-sm font-mono leading-relaxed
                       overflow-auto whitespace-pre max-h-[60vh]"
          >
            {outputSQL}
          </pre>
        </div>
      )}
    </div>
  );
}
