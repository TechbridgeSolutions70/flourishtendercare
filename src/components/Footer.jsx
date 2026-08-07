import { useMemo, useState } from 'react';
import PrivacyModal from './PrivacyModal';

function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const socialLinks = useMemo(() => [
    { label: 'Facebook', href: 'https://facebook.com/flourishtendercare1', icon: 'f' },
    { label: 'Instagram', href: 'https://instagram.com/flourishtendercare1', icon: 'i' },
    { label: 'LinkedIn', href: 'https://linkedin.com/company/flourishtendercare1', icon: 'in' },
  ], []);

  return (
    <>
      <footer id="contact" className="footer">
        <div className="footer-content" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '0.7rem', alignItems: 'start' }}>
          <div className="footer-info" style={{ display: 'grid', gap: '0.2rem' }}>
            <h3>Visit our school</h3>
            <p>#5 Muyibat Ashani Street, Peaceville Estate, Badore, Ajah, Lagos</p>
            <p>Email: admin@flourishtendercare.com.ng</p>
            <p>Phone: +234 803 738 3820</p>
            <p className="footer-year" style={{ marginTop: '0.1rem', alignSelf: 'flex-start', textAlign: 'left' }}>© 2026 Flourish Tendercare School</p>
          </div>

          <div className="footer-actions">
            <div className="footer-links">
              <button type="button" className="footer-link-button" onClick={() => setPrivacyOpen(true)}>
                Privacy notice
              </button>
            </div>
            <div className="footer-socials" aria-label="Social links">
              {socialLinks.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="social-link" aria-label={link.label}>
                  {link.label === 'Facebook' ? 'f' : link.label === 'Instagram' ? '◉' : 'in'}
                </a>
              ))}
            </div>
            <a className="btn btn-primary" href="mailto:admin@flourishtendercare.com.ng">Schedule a visit</a>
          </div>
        </div>
      </footer>
      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </>
  );
}

export default Footer;
