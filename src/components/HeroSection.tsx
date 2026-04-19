interface HeroSectionProps {
  isConfigured: boolean;
  onOpenConfig: () => void;
}
export default function HeroSection({ onOpenConfig, isConfigured }: HeroSectionProps) {
  return (
    <section className="relative z-10 px-4 sm:px-6 lg:px-8 pt-20 pb-16">
      <div className="max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide
          bg-slate-100 text-slate-600 border border-slate-200
          dark:bg-white/5 dark:text-slate-400 dark:border-white/10 mb-6"
        >
          <span className="text-blue-500">✦</span>
          Built for Developers
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
          <span className="text-slate-900 dark:text-white">Stop fixing AI SQL manually.</span>
          <br />
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Make it follow your style.</span>
        </h1>

        {/* Subtext */}
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          AI tools generate SQL in different formats every time. Paste one query in your preferred format—we learn it and apply the same style to
          every query instantly.
        </p>

        {/* Value Points (THIS IS WHAT YOU WERE MISSING) */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 mb-8 text-sm">
          <span className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">
            ⏱ Save time on formatting
          </span>

          <span className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">
            🎯 Your style, not AI’s
          </span>

          <span className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">
            ⚡ Consistent SQL every time
          </span>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4 mb-6">
          {!isConfigured && (
            <button
              onClick={onOpenConfig}
              className="px-8 py-4 rounded-full bg-slate-900 dark:bg-white 
              text-white dark:text-black font-semibold text-lg
              hover:scale-105 active:scale-95 transition shadow-lg"
            >
              ⚡ Start with Your Sample Query
            </button>
          )}

          {isConfigured && (
            <div className="mb-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20 text-sm font-medium animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Engine trained & ready. Use the comparison window below.
            </div>
          )}

          <p className="text-sm text-slate-500 dark:text-slate-500">Takes less than 30 seconds • No signup required</p>
        </div>

        {/* Trust Line */}
        <p className="text-xs text-slate-400 dark:text-slate-500">Runs locally • Your SQL never leaves your browser</p>
      </div>
    </section>
  );
}
