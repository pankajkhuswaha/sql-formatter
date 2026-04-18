export default function HeroSection({ isConfigured, onOpenConfig }) {
  return (
    <section className="relative z-10 px-4 sm:px-6 lg:px-8 pt-20 pb-6">
      <div className="max-w-5xl mx-auto">
        {/* Pain Point & Storytelling */}
        <div className="text-center max-w-3xl mx-auto mb-6 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 mb-8">
            <span className="text-blue-500">✦</span> The Formatting Solution
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <span className="text-gradient text-gradient-subtle">AI generates great SQL.</span>
            <br />
            <span className="text-gradient text-gradient-primary">But it ruins your standards.</span>
          </h2>

          {/* Premium Workflow Cards */}
          <div className="relative max-w-5xl mx-auto mt-6 mb-6 text-left">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">

              {/* Card 1: The Chaos */}
              <div className="bg-white/80 dark:bg-[#0a0a0a]/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/50 dark:border-white/10 hover:border-red-500/30 dark:hover:border-red-500/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-colors duration-500"></div>

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-500/10 dark:to-rose-500/5 text-red-500 flex items-center justify-center mb-6 shadow-sm border border-red-100 dark:border-red-500/20 group-hover:scale-110 transition-transform duration-500 relative z-10">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight relative z-10">1. The Chaos</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium relative z-10">
                  ChatGPT and Claude rarely respect your team's strict formatting. You waste time manually fixing JOINs, casing, and line breaks.
                </p>
              </div>

              {/* Card 2: The Learning */}
              <div className="bg-white/80 dark:bg-[#0a0a0a]/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/50 dark:border-white/10 hover:border-purple-500/30 dark:hover:border-purple-500/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors duration-500"></div>

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-50 to-fuchsia-100 dark:from-purple-500/10 dark:to-fuchsia-500/5 text-purple-500 flex items-center justify-center mb-6 shadow-sm border border-purple-100 dark:border-purple-500/20 group-hover:scale-110 transition-transform duration-500 relative z-10">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight relative z-10">2. The Learning</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium relative z-10">
                  We use AI just once to <strong className="text-slate-800 dark:text-slate-200">extract your exact visual style</strong> from a single sample query. No continuous API costs.
                </p>
              </div>

              {/* Card 3: The Standardization */}
              <div className="bg-white/80 dark:bg-[#0a0a0a]/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/50 dark:border-white/10 hover:border-green-500/30 dark:hover:border-green-500/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-colors duration-500"></div>

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-500/10 dark:to-emerald-500/5 text-green-500 flex items-center justify-center mb-6 shadow-sm border border-green-100 dark:border-green-500/20 group-hover:scale-110 transition-transform duration-500 relative z-10">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight relative z-10">3. The Standard</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium relative z-10">
                  Our engine runs 100% locally in your browser, instantly formatting any chaotic AI output back to your perfect standard.
                </p>
              </div>

            </div>
          </div>

          {!isConfigured ? (
            <div className="mt-4 flex flex-col items-center justify-center gap-4">
              <button
                onClick={onOpenConfig}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black font-semibold text-sm rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(0,112,243,0.5)]"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <span className="relative z-10 text-lg">⚙️</span>
                <span className="relative z-10">Configure Your Style Now</span>
                <svg className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <p className="text-xs text-slate-500 dark:text-slate-500">Takes less than 30 seconds. Requires a free Groq API key.</p>
            </div>
          ) : (
            <div className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20 text-sm font-medium animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Engine trained & ready. Use the comparison window below.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
