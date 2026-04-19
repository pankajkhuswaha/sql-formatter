import { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ConfigModal from './components/ConfigModal';
import FormatterPanel from './components/FormatterPanel';

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });
  const [showConfig, setShowConfig] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sqlStyleRules');
    setIsConfigured(!!saved);
  }, []);

  // Apply dark mode class to html element
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleConfigSuccess = () => {
    setIsConfigured(true);
    setShowConfig(false);
  };

  const handleClearConfig = () => {
    localStorage.removeItem('sqlStyleRules');
    setIsConfigured(false);
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-grid-pattern">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenConfig={() => setShowConfig(true)}
        isConfigured={isConfigured}
      />

      {/* Config Modal */}
      {showConfig && (
        <ConfigModal
          onClose={() => setShowConfig(false)}
          onConfigured={handleConfigSuccess}
          onClearConfig={handleClearConfig}
          isConfigured={isConfigured}
        />
      )}

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <HeroSection isConfigured={isConfigured} onOpenConfig={() => setShowConfig(true)} />

        {/* Formatter Panel */}
        {isConfigured && (
          <div className="animate-fade-in">
            <FormatterPanel />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center border-t border-slate-200/50 dark:border-white/5 mt-4">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Made with <span className="text-red-500">❤️</span> by Pankaj Khuswaha and AI
        </p>
      </footer>
    </div>
  );
}
