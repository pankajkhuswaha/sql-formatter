interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenConfig: () => void;
  isConfigured: boolean;
}

export default function Header({
  darkMode,
  onToggleDarkMode,
  onOpenConfig,
  isConfigured,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-surface-900/70 border-b border-surface-200/60 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-700 rounded-lg flex items-center justify-center shadow-md shadow-accent-500/20">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-surface-800 dark:text-white tracking-tight">
              SQL <span className="text-accent-500">Formatter</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="header-config-btn"
              onClick={onOpenConfig}
              className="relative flex items-center gap-2 px-3.5 py-2 text-sm font-medium
                         text-surface-600 dark:text-surface-300
                         hover:text-surface-800 dark:hover:text-white
                         hover:bg-surface-100 dark:hover:bg-white/5
                         rounded-xl transition-all duration-200 cursor-pointer"
              title="Configure formatting style"
            >
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="hidden sm:inline">Configure</span>
              {isConfigured && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-sage-400 rounded-full border-2 border-white dark:border-surface-900" />
              )}
            </button>

            <button
              id="dark-mode-toggle"
              onClick={onToggleDarkMode}
              className="flex items-center justify-center w-10 h-10 rounded-xl
                         text-surface-500 dark:text-surface-400
                         hover:text-surface-700 dark:hover:text-surface-200
                         hover:bg-surface-100 dark:hover:bg-white/5
                         transition-all duration-200 cursor-pointer"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
