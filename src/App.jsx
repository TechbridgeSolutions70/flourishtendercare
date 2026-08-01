import { useEffect, useState } from 'react';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import ProgramsSection from './components/ProgramsSection';
import NewsSection from './components/NewsSection';
import FaqSection from './components/FaqSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    const storedTheme = window.localStorage.getItem('flurish-theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [showThemePrompt, setShowThemePrompt] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !window.localStorage.getItem('flurish-theme');
  });
  const [panelOpen, setPanelOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem('flurish-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 220);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setPageReady(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  const chooseTheme = (nextTheme) => {
    setTheme(nextTheme);
    setShowThemePrompt(false);
  }; 

  if (!pageReady) {
    return (
      <div className="page-shell page-skeleton-shell" aria-label="Loading content">
        <div className="page-skeleton-hero">
          <div className="page-skeleton-line long" />
          <div className="page-skeleton-line medium" />
          <div className="page-skeleton-line short" />
          <div className="page-skeleton-row">
            <div className="page-skeleton-pill" />
            <div className="page-skeleton-pill" />
          </div>
        </div>

        <div className="page-skeleton-grid">
          <div className="page-skeleton-card">
            <div className="page-skeleton-line long" />
            <div className="page-skeleton-line medium" />
            <div className="page-skeleton-line short" />
          </div>
          <div className="page-skeleton-card">
            <div className="page-skeleton-line long" />
            <div className="page-skeleton-line medium" />
            <div className="page-skeleton-line short" />
          </div>
          <div className="page-skeleton-card">
            <div className="page-skeleton-line long" />
            <div className="page-skeleton-line medium" />
            <div className="page-skeleton-line short" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      {showThemePrompt && (
        <div className="theme-choice-overlay" role="dialog" aria-modal="true">
          <div className="theme-choice-card">
            <p className="eyebrow">Personalize your view</p>
            <h2>Choose your perfect vibe</h2>
            <p>Pick a starting theme for the site and adjust it anytime from the floating panel.</p>
            <div className="theme-choice-actions">
              <button className="btn btn-primary" onClick={() => chooseTheme('light')}>
                Light mode
              </button>
              <button className="btn btn-secondary" onClick={() => chooseTheme('dark')}>
                Dark mode
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        className={`floating-launcher ${panelOpen ? 'active' : ''}`}
        type="button"
        onClick={() => setPanelOpen((prev) => !prev)}
        aria-label="Open theme settings"
      >
        <span>☁</span>
      </button>

      <div className={`floating-panel ${panelOpen ? 'open' : ''}`}>
        <div className="floating-panel-header">
          <div>
            <p className="panel-label">Quick access</p>
            <h3>Whatapps</h3>
          </div>
          <button className="panel-close" type="button" onClick={() => setPanelOpen(false)}>
            ×
          </button>
        </div>

        <div className="panel-block">
          <p className="panel-copy">Switch the experience from bright to cinematic in one tap.</p>
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
          >
            <span>{theme === 'dark' ? 'Dark mode' : 'Light mode'}</span>
            <span className="switch-track">
              <span className="switch-thumb" />
            </span>
          </button>
        </div>
      </div>

      {showScrollTop && (
        <button
          className="scroll-top-button"
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll back to top"
        >
          ↑
        </button>
      )}

      <Hero />
      <main>
        <AboutSection />
        <ProgramsSection />
        <NewsSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
