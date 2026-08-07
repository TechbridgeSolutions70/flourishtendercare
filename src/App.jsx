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
import { useToast } from './components/ToastProvider';
function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [showWhatsAppTip, setShowWhatsAppTip] = useState(false);
  const [whatsAppTipIndex, setWhatsAppTipIndex] = useState(0);
  const { addToast } = useToast();
  const whatsappTips = [
    'Chat with us now',
    'Need admissions help?',
    'Questions? We reply',
  ];
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
    let tipTimeoutId;
    const showNextTip = () => {
      setWhatsAppTipIndex((current) => (current + 1) % whatsappTips.length);
      setShowWhatsAppTip(true);
      clearTimeout(tipTimeoutId);
      tipTimeoutId = window.setTimeout(() => setShowWhatsAppTip(false), 7000);
    };

    showNextTip();
    const tipIntervalId = window.setInterval(showNextTip, 12000);

    return () => {
      clearInterval(tipIntervalId);
      clearTimeout(tipTimeoutId);
    };
  }, [whatsappTips.length]);

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
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.style.colorScheme = 'light';
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setPageReady(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const consentKey = 'flourish-privacy-consent';
    const hasConsented = window.localStorage.getItem(consentKey);

    if (!hasConsented) {
      const timer = window.setTimeout(() => {
        addToast('We use cookies and browser storage to remember your privacy choice and improve your visit. Tap Agree to continue.', {
          type: 'info',
          duration: 10000,
          action: {
            label: 'Agree',
            onClick: () => {
              window.localStorage.setItem(consentKey, 'accepted');
              addToast('Thanks for helping us keep your privacy choice on this device.', { type: 'success', duration: 4000 });
            },
          },
        });
      }, 1400);

      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [addToast]);

  useEffect(() => {
    if (surveyPageActive || testimonialPageActive) return undefined;

    const openModal = window.setTimeout(() => setShowNewsModal(true), 1200);
    return () => window.clearTimeout(openModal);
  }, [surveyPageActive, testimonialPageActive]);

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
    <div className="page-shell">
      <div className="floating-cta">
        <div className={`whatsapp-tip ${showWhatsAppTip ? 'show' : ''}`} role="status" aria-live="polite">
          {whatsappTips[whatsAppTipIndex]}
        </div>
        <button
          className="floating-launcher"
          type="button"
          onClick={() => window.open('https://api.whatsapp.com/send?phone=2348094834708&text=Hello%20Flourish%20Tender%20Care%2C%20I%20need%20help%20with%20admissions%20and%20school%20information.', '_blank', 'noopener,noreferrer')}
          aria-label="Open WhatsApp chat"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.672.149-.198.297-.767.967-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.148-.173.198-.297.298-.495.099-.198.05-.372-.025-.52-.075-.149-.672-1.611-.92-2.204-.242-.58-.487-.5-.672-.51l-.572-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.693.626.712.227 1.36.195 1.872.118.571-.085 1.758-.72 2.006-1.415.248-.695.248-1.29.173-1.415-.074-.124-.272-.198-.57-.347z" fill="white" />
            <path d="M12.005 2a9.98 9.98 0 0 0-8.517 14.814L2 22l4.436-1.163A9.98 9.98 0 1 0 12.005 2zm0 18.3a8.124 8.124 0 0 1-4.264-1.139l-.305-.18-2.63.69.701-2.564-.198-.324A8.092 8.092 0 1 1 20.1 12.005 8.064 8.064 0 0 1 12.005 20.3z" fill="white" opacity="0.35" />
          </svg>
        </button>
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
