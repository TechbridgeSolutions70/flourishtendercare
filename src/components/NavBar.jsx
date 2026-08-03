import { useEffect, useState } from 'react';
import logo from '../Public/logo/logo1.jpeg';

function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) document.documentElement.classList.add('mobile-nav-open');
    else document.documentElement.classList.remove('mobile-nav-open');
  }, [mobileOpen]);

  return (
    <>
      <div className="top-strip">
        <div className="top-strip-inner">
          <div className="strip-left">
            <div className="social-links" aria-label="Social links">
              <a href="https://www.facebook.com/flourishtendercare" target="_blank" rel="noreferrer noopener" className="social-link" aria-label="Facebook">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2.1v-2.9h2.1V9.4c0-2.1 1.3-3.3 3.2-3.3.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2v1.5h2.3l-.4 2.9h-1.9v7A10 10 0 0 0 22 12"/></svg>
              </a>
              <a href="https://www.instagram.com/flourishtendercare" target="_blank" rel="noreferrer noopener" className="social-link" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5zm0 2.6A1.9 1.9 0 1 1 13.9 12 1.9 1.9 0 0 1 12 10.1zm4.7-3.4a.8.8 0 1 1-.8.8.8.8 0 0 1 .8-.8z"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/flourishtendercare" target="_blank" rel="noreferrer noopener" className="social-link" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M4.98 3.5A2.5 2.5 0 1 0 4.98 8.5 2.5 2.5 0 0 0 4.98 3.5zM3 9h4v12H3V9zm7 0h3.7v1.6h.1c.5-1 1.9-2 3.9-2 4.2 0 5 2.8 5 6.4V21h-4v-5.2c0-1.2 0-2.8-1.7-2.8-1.7 0-2 1.4-2 2.7V21h-4V9z"/></svg>
              </a>
            </div>
          </div>
          <div className="strip-center">admin@flourishtendercare.com.ng</div>
          <div className="strip-right">+234 803 738 3820</div>
        </div>
      </div>
      <nav className="topbar">
        <div className="brand">
          <img src={logo} alt="Flourish Tender Care logo" className="brand-logo" />
          <div>
            <h1>Flourish Tender Care</h1>
            <p>Nurturing minds, shaping futures</p>
          </div>
        </div>
        <div className="nav-links">
          <a href="#about" onClick={() => setMobileOpen(false)}>About</a>
          <a href="#programs" onClick={() => setMobileOpen(false)}>Programs</a>
          <a href="#gallery" onClick={() => setMobileOpen(false)}>Gallery</a>
          <a href="#news" onClick={() => setMobileOpen(false)}>News</a>
          <a href="#contact" onClick={() => setMobileOpen(false)}>Contact</a>
        </div>

        <button
          className={`mobile-toggle ${mobileOpen ? 'open' : ''}`}
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="hamburger" />
        </button>

        <div className="topbar-actions desktop-only">
          <a className="btn btn-secondary" href="https://portal.flourishtendercare.com.ng/apply" target="_blank" rel="noreferrer">Apply</a>
          <a className="btn btn-primary" href="https://portal.flourishtendercare.com.ng/signin" target="_blank" rel="noreferrer">Portal</a>
        </div>
      </nav>

      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`} role="dialog" aria-hidden={!mobileOpen}>
        <a href="#about" onClick={() => setMobileOpen(false)}>About</a>
        <a href="#programs" onClick={() => setMobileOpen(false)}>Programs</a>
        <a href="#news" onClick={() => setMobileOpen(false)}>News</a>
        <a href="#contact" onClick={() => setMobileOpen(false)}>Contact</a>
        <a className="btn btn-secondary mobile-nav-btn" href="https://portal.flourishtendercare.com.ng/apply" target="_blank" rel="noreferrer" onClick={() => setMobileOpen(false)}>Apply</a>
        <a className="btn btn-primary mobile-nav-btn" href="https://portal.flourishtendercare.com.ng/signin" target="_blank" rel="noreferrer" onClick={() => setMobileOpen(false)}>Portal</a>
      </div>
    </>
  );
}

export default NavBar;
