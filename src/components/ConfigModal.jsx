import { useState, useEffect } from "react";
import { extractStyle } from "../lib/groqClient";

const DEFAULT_RULES = {
  keywordCase: "upper",
  indentChar: " ",
  indentSize: 4,
  commaPosition: "end",
  aliasKeyword: "AS",
  andOrOnNewline: true,
  andOrIndented: true,
  joinConditionIndent: true,
  selectColumnsOnNewLine: true,
  linesBetweenClauses: 0,
  columnIndent: false,
  spaceInsideParens: false,
  semicolonOnNewline: false,
  openParenOnNewline: false,
  closingParenStyle: "newline",
  newlineBeforeKeywords: ["SELECT","FROM","WHERE","JOIN","LEFT JOIN","ON","GROUP BY","ORDER BY","HAVING"],
};

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer group">
      <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${checked ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
      </button>
    </label>
  );
}

function Select({ value, onChange, label, options }) {
  return (
    <label className="flex items-center justify-between gap-3">
      <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-2 py-1 bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 min-w-[100px]"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  );
}

function NumberInput({ value, onChange, label, min = 0, max = 16 }) {
  return (
    <label className="flex items-center justify-between gap-3">
      <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        min={min}
        max={max}
        className="w-16 px-2 py-1 bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-center text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
      />
    </label>
  );
}

function SectionTitle({ children }) {
  return (
    <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-4 mb-2 first:mt-0">{children}</h4>
  );
}

export default function ConfigModal({ onClose, onConfigured, onClearConfig, isConfigured }) {
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem("groqApiKey") || ""
  );
  const [sampleSQL, setSampleSQL] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(isConfigured ? "edit" : "extract");
  const [rules, setRules] = useState(() => {
    const saved = localStorage.getItem("sqlStyleRules");
    return saved ? JSON.parse(saved) : { ...DEFAULT_RULES };
  });

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
      const extractedRules = await extractStyle(sampleSQL);
      setRules({ ...DEFAULT_RULES, ...extractedRules });
      setStep("edit");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    localStorage.setItem("sqlStyleRules", JSON.stringify(rules));
    onConfigured();
  };

  const updateRule = (key, value) => {
    setRules(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-[#0f1117] rounded-2xl shadow-2xl shadow-black/30 border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col animate-scale-in max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 shrink-0">
          <h3 className="text-base font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <span>⚙️</span> Configuration
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">

          {/* Step Tabs */}
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
            <button
              onClick={() => setStep("extract")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${step === "extract" ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
            >
              1. Analyze Sample
            </button>
            <button
              onClick={() => setStep("edit")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${step === "edit" ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
            >
              2. Adjust Rules
            </button>
          </div>

          {/* Step 1: Extract */}
          {step === "extract" && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Groq API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="gsk_..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                />
                <p className="text-[11px] text-slate-400">
                  Get yours at <a href="https://console.groq.com" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">console.groq.com</a>
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Sample SQL</label>
                <textarea
                  value={sampleSQL}
                  onChange={(e) => setSampleSQL(e.target.value)}
                  placeholder="Paste a query formatted exactly how you like it..."
                  rows={5}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                />
              </div>

              <button
                onClick={handleExtractStyle}
                disabled={loading || !sampleSQL.trim()}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Analyzing...
                  </>
                ) : "Analyze Style →"}
              </button>
            </div>
          )}

          {/* Step 2: Edit Rules */}
          {step === "edit" && (
            <div className="space-y-1 animate-fade-in">

              <SectionTitle>General</SectionTitle>
              <div className="space-y-2.5 p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl">
                <Select
                  label="Keyword Case"
                  value={rules.keywordCase || "upper"}
                  onChange={(v) => updateRule("keywordCase", v)}
                  options={[
                    { value: "upper", label: "UPPER" },
                    { value: "lower", label: "lower" },
                    { value: "title", label: "Title" },
                  ]}
                />
                <NumberInput
                  label="Indent Size"
                  value={rules.indentSize || 4}
                  onChange={(v) => updateRule("indentSize", v)}
                  min={1}
                  max={8}
                />
                <Select
                  label="Alias Keyword"
                  value={rules.aliasKeyword || "AS"}
                  onChange={(v) => updateRule("aliasKeyword", v)}
                  options={[
                    { value: "AS", label: "AS" },
                    { value: "as", label: "as" },
                    { value: "none", label: "None" },
                  ]}
                />
              </div>

              <SectionTitle>SELECT Columns</SectionTitle>
              <div className="space-y-2.5 p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl">
                <Toggle
                  label="Each column on new line"
                  checked={rules.selectColumnsOnNewLine !== false}
                  onChange={(v) => updateRule("selectColumnsOnNewLine", v)}
                />
                <Select
                  label="Comma Position"
                  value={rules.commaPosition || "end"}
                  onChange={(v) => updateRule("commaPosition", v)}
                  options={[
                    { value: "end", label: "End of line" },
                    { value: "start", label: "Start of line" },
                  ]}
                />
              </div>

              <SectionTitle>JOIN & Conditions</SectionTitle>
              <div className="space-y-2.5 p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl">
                <Toggle
                  label="ON on new line (indented)"
                  checked={rules.joinConditionIndent !== false}
                  onChange={(v) => updateRule("joinConditionIndent", v)}
                />
                <Toggle
                  label="AND / OR on new line"
                  checked={rules.andOrOnNewline !== false}
                  onChange={(v) => updateRule("andOrOnNewline", v)}
                />
                <Toggle
                  label="AND / OR indented"
                  checked={rules.andOrIndented !== false}
                  onChange={(v) => updateRule("andOrIndented", v)}
                />
              </div>

              <SectionTitle>Layout</SectionTitle>
              <div className="space-y-2.5 p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl">
                <Toggle
                  label="Blank line between clauses"
                  checked={(rules.linesBetweenClauses || 0) === 1}
                  onChange={(v) => updateRule("linesBetweenClauses", v ? 1 : 0)}
                />
                <Toggle
                  label="Semicolon on new line"
                  checked={rules.semicolonOnNewline === true}
                  onChange={(v) => updateRule("semicolonOnNewline", v)}
                />
                <Select
                  label="Closing ) style"
                  value={rules.closingParenStyle || "newline"}
                  onChange={(v) => updateRule("closingParenStyle", v)}
                  options={[
                    { value: "newline", label: "New line" },
                    { value: "same", label: "Same line" },
                  ]}
                />
              </div>

              {isConfigured && (
                <button
                  onClick={() => {
                    onClearConfig();
                    setRules({ ...DEFAULT_RULES });
                    setStep("extract");
                    setSampleSQL("");
                  }}
                  className="w-full mt-2 py-2 text-xs font-medium text-red-500 hover:text-red-400 border border-red-200 dark:border-red-500/20 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                >
                  Reset Configuration
                </button>
              )}
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/30 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          {step === "edit" && (
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-500/20 transition-all"
            >
              Save Configuration
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
