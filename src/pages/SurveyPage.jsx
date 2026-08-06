import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Survey from '../components/Survey';

export default function SurveyPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const pageShell = document.querySelector('.page-shell');
    if (pageShell) {
      pageShell.scrollTop = 0;
    } else {
      window.scrollTo(0, 0);
    }

    const handleScroll = (e) => {
      const scrollableElement = e.target || window;
      const scrollTop = scrollableElement.scrollY !== undefined ? scrollableElement.scrollY : scrollableElement.scrollTop;
      setShowScrollTop(scrollTop > 220);
    };

    if (pageShell) {
      pageShell.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll({ target: pageShell });
      return () => pageShell.removeEventListener('scroll', handleScroll);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll({ target: window });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="page-shell survey-page-shell">
      <NavBar />
      <main className="survey-page-main">
        <Survey />
      </main>
      <Footer />

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
    </div>
  );
}
