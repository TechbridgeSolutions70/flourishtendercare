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
          <div className="strip-left">Admissions open — Entrance exams: 15, 20 & 27 March 2025</div>
          <div className="strip-right">Call us: 0909 663 0728 · info@flourish.example</div>
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

        <div className="topbar-actions">
          <a className="btn btn-secondary" href="https://portal.flourishtendercare.com.ng/apply" target="_blank" rel="noreferrer">Apply</a>
          <a className="btn btn-primary" href="https://portal.flourishtendercare.com.ng/signin" target="_blank" rel="noreferrer">Portal</a>
        </div>

        <button
          className={`mobile-toggle ${mobileOpen ? 'open' : ''}`}
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="hamburger" />
        </button>
      </nav>

      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`} role="dialog" aria-hidden={!mobileOpen}>
        <a href="#about" onClick={() => setMobileOpen(false)}>About</a>
        <a href="#programs" onClick={() => setMobileOpen(false)}>Programs</a>
        <a href="#gallery" onClick={() => setMobileOpen(false)}>Gallery</a>
        <a href="#contact" onClick={() => setMobileOpen(false)}>Contact</a>
      </div>
    </>
  );
}

export default NavBar;
