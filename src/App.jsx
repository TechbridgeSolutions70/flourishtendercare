import { useEffect, useState, useLayoutEffect } from 'react';
import Hero from './components/Hero';
import NavBar from './components/NavBar';
import HeroPostSection from './components/HeroPostSection';
import SurveyPage from './pages/SurveyPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import HeroStatsSection from './components/HeroStatsSection';
import AboutSection from './components/AboutSection';
import ProgramsSection from './components/ProgramsSection';
import NewsSection from './components/NewsSection';
import TestimonialSection from './components/TestimonialSection';
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
  const normalizePath = () => {
    if (typeof window === 'undefined') return '';
    return window.location.pathname.replace(/\/+$/, '').toLowerCase();
  };

  const isSurveyRoute = () => {
    const path = normalizePath();
    const search = new URLSearchParams(window.location.search);
    return ['/existing_parent', '/prospective_parent', '/survey'].includes(path) || search.get('survey') === '1';
  };

  const isTestimonialRoute = () => {
    const path = normalizePath();
    return path === '/testimonial' || path === '/testimonials';
  };

  const isAdminLoginRoute = () => {
    const path = normalizePath();
    return ['/login', '/admin', '/admin/login', '/admins', '/admins/login'].includes(path);
  };

  const isAdminRoute = () => {
    const path = normalizePath();
    return ['/dashboard', '/admin/dashboard', '/admins/dashboard'].includes(path);
  };
  const [surveyPageActive, setSurveyPageActive] = useState(() => isSurveyRoute());
  const [testimonialPageActive, setTestimonialPageActive] = useState(() => isTestimonialRoute());
  const [adminPageActive, setAdminPageActive] = useState(() => isAdminRoute());
  const [adminLoginPageActive, setAdminLoginPageActive] = useState(() => isAdminLoginRoute());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem('flurish-theme', theme);
  }, [theme]);


  useLayoutEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const updateTopbarSpace = () => {
      const topbar = document.querySelector('.topbar');
      const topStrip = document.querySelector('.top-strip');
      const extraSpacing = 8; // smaller breathing room
      const topStripHeight = topStrip ? Math.ceil(topStrip.getBoundingClientRect().height) : 0;
      if (topbar) {
        // clamp to avoid extreme values
        const measured = Math.ceil(topbar.getBoundingClientRect().height + extraSpacing);
        const clamped = Math.max(48, Math.min(140, measured));
        document.documentElement.style.setProperty('--topbar-space', `${clamped}px`);
      } else {
        document.documentElement.style.setProperty('--topbar-space', '56px');
      }
      document.documentElement.style.setProperty('--topbar-offset', `${topStripHeight}px`);
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
    const resolveAnchor = (href) => {
      if (!href) return null;
      const hashIndex = href.indexOf('#');
      if (hashIndex === -1) return null;
      const selector = href.slice(hashIndex);
      return selector && selector !== '#' ? selector : null;
    };

    const links = Array.from(document.querySelectorAll('.nav-links a'));
    if (!links.length) return undefined;

    const sections = links
      .map((l) => {
        const selector = resolveAnchor(l.getAttribute('href'));
        return selector ? document.querySelector(selector) : null;
      })
      .filter(Boolean);

    const onClick = (e) => {
      e.preventDefault();
      const selector = resolveAnchor(e.currentTarget.getAttribute('href'));
      const target = selector ? document.querySelector(selector) : null;
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
    const handleScroll = (e) => {
      const scrollableElement = e.target || window;
      const scrollTop = scrollableElement.scrollY !== undefined ? scrollableElement.scrollY : scrollableElement.scrollTop;
      setShowScrollTop(scrollTop > 220);
    };

    // Listen on the scrollable container (page-shell or window)
    const pageShell = document.querySelector('.page-shell');
    if (pageShell) {
      pageShell.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll({ target: pageShell });
      return () => pageShell.removeEventListener('scroll', handleScroll);
    }

    // Fallback to window scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll({ target: window });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const syncRoute = () => {
      setSurveyPageActive(isSurveyRoute());
      setTestimonialPageActive(isTestimonialRoute());
      setAdminPageActive(isAdminRoute());
      setAdminLoginPageActive(isAdminLoginRoute());
    };

    syncRoute();
    window.addEventListener('popstate', syncRoute);
    return () => window.removeEventListener('popstate', syncRoute);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setPageReady(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (surveyPageActive || testimonialPageActive) return undefined;

    const openModal = window.setTimeout(() => setShowNewsModal(true), 1200);
    return () => window.clearTimeout(openModal);
  }, [surveyPageActive, testimonialPageActive]);

  const chooseTheme = (nextTheme) => {
    setTheme(nextTheme);
    setShowThemePrompt(false);
  }; 

  if (testimonialPageActive) {
    return (
      <div className="page-shell testimonial-page-shell">
        <NavBar />
        <main className="testimonial-page-main">
          <TestimonialSection />
        </main>
      </div>
    );
  }

  if (surveyPageActive) {
    return <SurveyPage />;
  }

  if (adminLoginPageActive) {
    return <AdminLogin />;
  }

  if (adminPageActive) {
    return <AdminDashboard />;
  }

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
    <div className="page-shell" onClick={() => setPanelOpen(false)}>
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
        onClick={(event) => {
          event.stopPropagation();
          setPanelOpen((prev) => !prev);
        }}
        aria-label="Open WhatsApp and theme settings"
      >
        <span>☁</span>
      </button>

      <div className={`floating-panel ${panelOpen ? 'open' : ''}`} onClick={(event) => event.stopPropagation()}>
        <div className="floating-panel-header">
          <div>
            <p className="panel-label">Quick access</p>
            <h3>WhatsApp & Theme</h3>
          </div>
          <button className="panel-close" type="button" onClick={() => setPanelOpen(false)}>
            ×
          </button>
        </div>

        <div className="panel-block">
          <p className="panel-copy">Tap WhatsApp to chat directly, or switch the theme instantly.</p>
          <a
            className="btn btn-secondary"
            href="https://api.whatsapp.com/send?phone=2348094834708&text=Hello%20Flourish%20Tender%20Care%2C%20I%20need%20help%20with%20admissions%20and%20school%20information."
            target="_blank"
            rel="noreferrer"
            onClick={() => setPanelOpen(false)}
          >
            Chat on WhatsApp
          </a>
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
          onClick={() => {
            const pageShell = document.querySelector('.page-shell');
            if (pageShell) {
              pageShell.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
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
        <TestimonialSection />
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
