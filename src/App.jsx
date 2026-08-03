import { useEffect, useState, useLayoutEffect } from 'react';
import Hero from './components/Hero';
import NavBar from './components/NavBar';
import HeroPostSection from './components/HeroPostSection';
import HeroStatsSection from './components/HeroStatsSection';
import AboutSection from './components/AboutSection';
import ProgramsSection from './components/ProgramsSection';
import NewsSection from './components/NewsSection';
import FaqSection from './components/FaqSection';
import ContactSection from './components/ContactSection';
import AdmissionsSection from './components/AdmissionsSection';
import Footer from './components/Footer';
import NewsModal from './components/NewsModal';

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
  const [showNewsModal, setShowNewsModal] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem('flurish-theme', theme);
  }, [theme]);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const updateTopbarSpace = () => {
      const topbar = document.querySelector('.topbar');
      const extraSpacing = 8; // smaller breathing room
      if (topbar) {
        // clamp to avoid extreme values
        const measured = Math.ceil(topbar.getBoundingClientRect().height + extraSpacing);
        const clamped = Math.max(48, Math.min(140, measured));
        document.documentElement.style.setProperty('--topbar-space', `${clamped}px`);
      } else {
        document.documentElement.style.setProperty('--topbar-space', '56px');
      }
    };

    updateTopbarSpace();
    window.addEventListener('resize', updateTopbarSpace);
    const ro = new ResizeObserver(updateTopbarSpace);
    const tb = document.querySelector('.topbar');
    if (tb) ro.observe(tb);

    return () => {
      window.removeEventListener('resize', updateTopbarSpace);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    // Active nav link highlighting + smooth scroll behavior
    const links = Array.from(document.querySelectorAll('.nav-links a'));
    if (!links.length) return undefined;

    const sections = links.map((l) => document.querySelector(l.getAttribute('href'))).filter(Boolean);

    const onClick = (e) => {
      e.preventDefault();
      const target = document.querySelector(e.currentTarget.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.documentElement.classList.remove('mobile-nav-open');
    };

    links.forEach((l) => l.addEventListener('click', onClick));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((s) => observer.observe(s));

    return () => {
      links.forEach((l) => l.removeEventListener('click', onClick));
      observer.disconnect();
    };
  }, [pageReady]);

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

  useEffect(() => {
    const openModal = window.setTimeout(() => setShowNewsModal(true), 1200);
    return () => window.clearTimeout(openModal);
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
            <p className="eyebrow">Personalize the experience</p>
            <h2>Choose a viewing mode for your school website</h2>
            <p>Select the look that feels most comfortable for you. You can change it anytime from the floating settings button.</p>
            <div className="theme-choice-actions">
              <button className="btn btn-primary" onClick={() => chooseTheme('light')}>
                Bright light mode
              </button>
              <button className="btn btn-secondary" onClick={() => chooseTheme('dark')}>
                Calm dark mode
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

      <NavBar />
      <Hero />
      <main>
        <HeroPostSection />
        <HeroStatsSection />
        <AboutSection />
        <ProgramsSection />
        <NewsSection />
        <FaqSection />
        <AdmissionsSection />
        <ContactSection />
      </main>
      <Footer />
      <NewsModal visible={showNewsModal} onClose={() => setShowNewsModal(false)} />
    </div>
  );
}

export default App;
