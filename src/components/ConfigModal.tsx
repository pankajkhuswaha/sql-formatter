// @ts-nocheck

import { useState } from 'react';
import { extractStyle } from '../lib/groqClient';

const DEFAULT_RULES = {
  // ── Dialect ──────────────────────────────────────────────
  dialectMode: 'postgresql', // "postgresql" | "mysql" | "mssql"

  // ── Keyword / Identifier ─────────────────────────────────
  keywordCase: 'upper',
  indentChar: ' ',
  indentSize: 4,
  aliasKeyword: 'AS',

  // ── SELECT Columns ───────────────────────────────────────
  selectColumnsOnNewLine: true,
  columnsPerRow: 1, // columns per row when selectColumnsOnNewLine = false
  commaPosition: 'end', // "end" | "start"
  columnIndent: false,
  columnIndentSize: 4,

  // ── Line / Width ─────────────────────────────────────────
  maxLineWidth: 120, // 0 = unlimited
  alignColumnAliases: false, // pad col names so aliases line up

  // ── Spacing ──────────────────────────────────────────────
  spaceAfterComma: 1, // spaces after comma (inside inline exprs)
  spaceAroundOperators: true, // space around = < > != etc.
  spaceInsideParens: false, // space after ( and before )
  spaceAfterFunctionName: false, // space between func name and (

  // ── JOIN & Conditions ────────────────────────────────────
  joinConditionIndent: true,
  andOrOnNewline: true,
  andOrIndented: true,

  // ── Layout ───────────────────────────────────────────────
  linesBetweenClauses: 0,
  semicolonOnNewline: false,
  openParenOnNewline: false,
  closingParenStyle: 'newline',
  newlineBeforeKeywords: ['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING'],
};

// Dialect preset overrides
const DIALECT_PRESETS = {
  mssql: {
    dialectMode: 'mssql',
    keywordCase: 'upper',
    aliasKeyword: 'AS',
    indentSize: 4,
    commaPosition: 'end',
    spaceInsideParens: false,
    maxLineWidth: 120,
  },
  mysql: {
    dialectMode: 'mysql',
    keywordCase: 'upper',
    aliasKeyword: 'AS',
    indentSize: 2,
    commaPosition: 'end',
    spaceInsideParens: false,
    maxLineWidth: 100,
  },
  postgresql: {
    dialectMode: 'postgresql',
    keywordCase: 'upper',
    aliasKeyword: 'AS',
    indentSize: 4,
    commaPosition: 'end',
    spaceInsideParens: false,
    maxLineWidth: 120,
  },
};

// ─── Small UI Atoms ──────────────────────────────────────────────────────────

function Toggle({ checked, onChange, label, hint }) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer group">
      <span className="flex flex-col">
        <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
          {label}
        </span>
        {hint && <span className="text-[10px] text-slate-400">{hint}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 flex-shrink-0 ${checked ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`}
        />
      </button>
    </label>
  );
}

function Select({ value, onChange, label, options, hint }) {
  return (
    <label className="flex items-center justify-between gap-3">
      <span className="flex flex-col">
        <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>
        {hint && <span className="text-[10px] text-slate-400">{hint}</span>}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-2 py-1 bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 min-w-[110px] flex-shrink-0"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function NumberInput({ value, onChange, label, hint, min = 0, max = 999 }) {
  return (
    <label className="flex items-center justify-between gap-3">
      <span className="flex flex-col">
        <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>
        {hint && <span className="text-[10px] text-slate-400">{hint}</span>}
      </span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        min={min}
        max={max}
        className="w-20 px-2 py-1 bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-center text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 flex-shrink-0"
      />
    </label>
  );
}

function SectionTitle({ children, icon }) {
  return (
    <div className="flex items-center gap-1.5 mt-5 mb-2 first:mt-0">
      {icon && <span className="text-base leading-none">{icon}</span>}
      <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{children}</h4>
    </div>
  );
}

// ─── Dialect Card Selector ────────────────────────────────────────────────────

const DIALECTS = [
  {
    id: 'postgresql',
    label: 'PostgreSQL',
    icon: '🐘',
    desc: 'pg, Supabase, Neon…',
    color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/40',
    activeRing: 'ring-blue-500',
  },
  {
    id: 'mysql',
    label: 'MySQL',
    icon: '🐬',
    desc: 'MySQL, MariaDB…',
    color: 'from-orange-500/20 to-yellow-500/20 border-orange-500/40',
    activeRing: 'ring-orange-500',
  },
  {
    id: 'mssql',
    label: 'MSSQL / T-SQL',
    icon: '🪟',
    desc: 'SQL Server, Azure SQL…',
    color: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/40',
    activeRing: 'ring-indigo-500',
  },
];

function DialectSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {DIALECTS.map((d) => {
        const active = value === d.id;
        return (
          <button
            key={d.id}
            type="button"
            onClick={() => onChange(d.id)}
            className={`
              flex flex-col items-center gap-1 p-2.5 rounded-xl border text-center
              transition-all duration-200 text-xs font-medium
              bg-gradient-to-br ${d.color}
              ${
                active
                  ? `ring-2 ${d.activeRing} text-slate-900 dark:text-white shadow-md`
                  : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }
            `}
          >
            <span className="text-xl">{d.icon}</span>
            <span className="font-semibold leading-tight">{d.label}</span>
            {/* <span className="text-[9px] text-slate-400 leading-tight">{d.desc}</span> */}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main Modal ──────────────────────────────────────────────────────────────

export default function ConfigModal({ onClose, onConfigured, onClearConfig, isConfigured }) {
  const [sampleSQL, setSampleSQL] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const [step, setStep] = useState(isConfigured ? 'edit' : 'extract');
  const [rules, setRules] = useState(() => {
    const saved = localStorage.getItem('sqlStyleRules');
    return saved ? { ...DEFAULT_RULES, ...JSON.parse(saved) } : { ...DEFAULT_RULES };
  });
  // dialect is driven from rules.dialectMode; derive a local convenience
  const dialect = rules.dialectMode || 'postgresql';

  const handleExtractStyle = async () => {
    if (!sampleSQL.trim()) {
      setError('Please paste a sample SQL query first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const extractedRules = await extractStyle(sampleSQL, dialect);
      // Preserve the dialect the user picked in Step 1
      setRules((prev) => ({ ...DEFAULT_RULES, ...prev, ...extractedRules, dialectMode: dialect }));
      setStep('edit');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDialectChange = (d) => {
    const preset = DIALECT_PRESETS[d] || {};
    setRules((prev) => ({ ...prev, ...preset, dialectMode: d }));
  };

  const handleSave = () => {
    localStorage.setItem('sqlStyleRules', JSON.stringify(rules));
    onConfigured();
  };

  const updateRule = (key, value) => {
    setRules((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl bg-white dark:bg-[#0f1117] rounded-2xl shadow-2xl shadow-black/30 border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col animate-scale-in max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 shrink-0">
          <h3 className="text-base font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <span>⚙️</span> Formatter Configuration
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Step Tabs */}
        <div className="px-4 pt-3 shrink-0">
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
            {[
              { id: 'extract', label: '1. Analyze Sample' },
              { id: 'edit', label: '2. Adjust Rules' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStep(tab.id)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  step === tab.id
                    ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {step === 'extract' && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Which database are you using?</label>
                </div>
                <DialectSelector value={dialect} onChange={handleDialectChange} />
              </div>

              {/* Sample SQL */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Sample SQL</label>
                <textarea
                  value={sampleSQL}
                  onChange={(e) => setSampleSQL(e.target.value)}
                  placeholder="Paste a query formatted exactly how you like it…"
                  rows={6}
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
                    Analyzing…
                  </>
                ) : (
                  <>
                    <span>🔍</span>
                    Analyze Style →
                  </>
                )}
              </button>
            </div>
          )}

          {/* ── Step 2: Edit Rules ── */}
          {step === 'edit' && (
            <div className="space-y-1 animate-fade-in">
              {/* <SectionTitle icon="🗄️">Database Dialect</SectionTitle>
              <div className="p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl">
                <DialectSelector value={rules.dialectMode || 'postgresql'} onChange={handleDialectChange} />
              </div> */}

              {/* KEYWORDS */}
              <SectionTitle icon="🔤">Keywords & Identifiers</SectionTitle>
              <div className="space-y-2.5 p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl">
                <Select
                  label="Keyword Case"
                  value={rules.keywordCase || 'upper'}
                  onChange={(v) => updateRule('keywordCase', v)}
                  options={[
                    { value: 'upper', label: 'UPPER' },
                    { value: 'lower', label: 'lower' },
                    { value: 'title', label: 'Title' },
                  ]}
                />
                <Select
                  label="Alias Keyword"
                  value={rules.aliasKeyword || 'AS'}
                  onChange={(v) => updateRule('aliasKeyword', v)}
                  options={[
                    { value: 'AS', label: 'AS' },
                    { value: 'as', label: 'as' },
                    { value: 'none', label: 'None (omit)' },
                  ]}
                />
              </div>

              {/* INDENTATION */}
              <SectionTitle icon="⇥">Indentation</SectionTitle>
              <div className="space-y-2.5 p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl">
                <Select
                  label="Indent Character"
                  value={rules.indentChar === '\t' ? 'tab' : 'space'}
                  onChange={(v) => updateRule('indentChar', v === 'tab' ? '\t' : ' ')}
                  options={[
                    { value: 'space', label: 'Spaces' },
                    { value: 'tab', label: 'Tabs' },
                  ]}
                />
                <NumberInput
                  label="Indent Size"
                  hint="spaces per indent level"
                  value={rules.indentSize || 4}
                  onChange={(v) => updateRule('indentSize', v)}
                  min={1}
                  max={8}
                />
              </div>

              {/* SELECT COLUMNS */}
              <SectionTitle icon="📋">SELECT Columns</SectionTitle>
              <div className="space-y-2.5 p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl">
                <Toggle
                  label="Each column on new line"
                  hint="one column per line in SELECT"
                  checked={rules.selectColumnsOnNewLine !== false}
                  onChange={(v) => updateRule('selectColumnsOnNewLine', v)}
                />
                {!rules.selectColumnsOnNewLine && (
                  <NumberInput
                    label="Columns per row"
                    hint="how many columns before line break"
                    value={rules.columnsPerRow || 3}
                    onChange={(v) => updateRule('columnsPerRow', Math.max(1, v))}
                    min={1}
                    max={20}
                  />
                )}
                <Select
                  label="Comma Position"
                  value={rules.commaPosition || 'end'}
                  onChange={(v) => updateRule('commaPosition', v)}
                  options={[
                    { value: 'end', label: 'End of line  (x,' },
                    { value: 'start', label: 'Start of line  (, x' },
                  ]}
                />
                <Toggle
                  label="Align column aliases"
                  hint="pad col names so AS aliases line up"
                  checked={rules.alignColumnAliases === true}
                  onChange={(v) => updateRule('alignColumnAliases', v)}
                />
              </div>

              {/* LINE WIDTH */}
              <SectionTitle icon="📏">Line Width & Wrapping</SectionTitle>
              <div className="space-y-2.5 p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl">
                <NumberInput
                  label="Max line width"
                  hint="chars before auto-wrap (0 = unlimited)"
                  value={rules.maxLineWidth ?? 120}
                  onChange={(v) => updateRule('maxLineWidth', v)}
                  min={0}
                  max={300}
                />
              </div>

              {/* SPACING */}
              <SectionTitle icon="↔️">Spacing</SectionTitle>
              <div className="space-y-2.5 p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl">
                <NumberInput
                  label="Spaces after comma"
                  hint="inside function calls / IN lists"
                  value={rules.spaceAfterComma ?? 1}
                  onChange={(v) => updateRule('spaceAfterComma', Math.max(0, Math.min(4, v)))}
                  min={0}
                  max={4}
                />
                <Toggle
                  label="Space around operators"
                  hint="a = b  vs  a=b"
                  checked={rules.spaceAroundOperators !== false}
                  onChange={(v) => updateRule('spaceAroundOperators', v)}
                />
                <Toggle
                  label="Space inside parentheses"
                  hint="( x )  vs  (x)"
                  checked={rules.spaceInsideParens === true}
                  onChange={(v) => updateRule('spaceInsideParens', v)}
                />
                <Toggle
                  label="Space after function name"
                  hint="COUNT (x)  vs  COUNT(x)"
                  checked={rules.spaceAfterFunctionName === true}
                  onChange={(v) => updateRule('spaceAfterFunctionName', v)}
                />
              </div>

              {/* JOIN & CONDITIONS */}
              <SectionTitle icon="🔗">JOIN & Conditions</SectionTitle>
              <div className="space-y-2.5 p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl">
                <Toggle
                  label="ON on new line (indented)"
                  hint="JOIN tbl t\n    ON t.id = ..."
                  checked={rules.joinConditionIndent !== false}
                  onChange={(v) => updateRule('joinConditionIndent', v)}
                />
                <Toggle label="AND / OR on new line" checked={rules.andOrOnNewline !== false} onChange={(v) => updateRule('andOrOnNewline', v)} />
                <Toggle label="AND / OR indented" checked={rules.andOrIndented !== false} onChange={(v) => updateRule('andOrIndented', v)} />
              </div>

              {/* LAYOUT */}
              <SectionTitle icon="📐">Layout</SectionTitle>
              <div className="space-y-2.5 p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl">
                <Toggle
                  label="Blank line between clauses"
                  checked={(rules.linesBetweenClauses || 0) === 1}
                  onChange={(v) => updateRule('linesBetweenClauses', v ? 1 : 0)}
                />
                <Toggle
                  label="Semicolon on new line"
                  checked={rules.semicolonOnNewline === true}
                  onChange={(v) => updateRule('semicolonOnNewline', v)}
                />
                <Select
                  label="Closing ) style"
                  value={rules.closingParenStyle || 'newline'}
                  onChange={(v) => updateRule('closingParenStyle', v)}
                  options={[
                    { value: 'newline', label: 'New line' },
                    { value: 'same', label: 'Same line' },
                  ]}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center gap-3 shrink-0">
          {/* Left side: dialect badge OR reset controls */}
          <div className="flex items-center gap-2 min-w-0">
            {isConfigured && !confirmReset && (
              <button
                onClick={() => setConfirmReset(true)}
                title="Reset all configuration and start over"
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-400 hover:text-red-400 dark:hover:text-red-400 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Reset
              </button>
            )}
            {isConfigured && confirmReset && (
              <div className="flex items-center gap-2 animate-fade-in">
                <span className="text-[11px] text-red-400 font-medium whitespace-nowrap">Reset everything?</span>
                <button
                  onClick={() => {
                    localStorage.removeItem('sqlStyleRules_seeded'); // allow re-seed on next load
                    onClearConfig();
                    setRules({ ...DEFAULT_RULES });
                    setStep('extract');
                    setSampleSQL('');
                    setConfirmReset(false);
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all"
                >
                  Yes, reset
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            )}
            {!isConfigured && (
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                {DIALECTS.find((d) => d.id === (rules.dialectMode || 'postgresql'))?.icon}
                {DIALECTS.find((d) => d.id === (rules.dialectMode || 'postgresql'))?.label}
              </span>
            )}
          </div>

          {/* Right side: Cancel + Save */}
          <div className="flex gap-3 shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            {step === 'edit' && (
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
    </div>
  );
}
