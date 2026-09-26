import { useMemo, useState } from 'react';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import PrivacyModal from './PrivacyModal';

function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const socialLinks = useMemo(() => [
    { label: 'Facebook', href: 'https://www.facebook.com/flourishtendercare1', icon: Facebook },
    { label: 'Instagram', href: 'https://www.instagram.com/flourishtendercare1', icon: Instagram },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/flourishtendercare1', icon: Linkedin },
  ], []);

  return (
    <>
      <footer id="contact" className="footer">
        <div className="footer-content">
          <div className="footer-column footer-info">
            <h3>Visit our school</h3>
            <p>#5 Muyibat Ashani Street</p>
            <p>Peaceville Estate, Badore</p>
            <p>Ajah, Lagos</p>
          </div>

          <div className="footer-column footer-contact">
            <h3>Contact us</h3>
            <p><a href="mailto:admin@flourishtendercare.com.ng">admin@flourishtendercare.com.ng</a></p>
            <p><a href="tel:+2348037383820">+234 803 738 3820</a></p>
          </div>

          <div className="footer-column footer-actions">
            <h3>Stay connected</h3>
            <div className="footer-links">
              <button type="button" className="footer-link-button" onClick={() => setPrivacyOpen(true)}>
                Privacy notice
              </button>
            </div>
            <div className="footer-socials" aria-label="Social links">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" className="social-link" aria-label={label}>
                  <Icon size={18} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-column footer-visit-cta">
            <h3>Come and see us</h3>
            <p>Discover a joyful learning environment for your child.</p>
            <a className="btn btn-primary" href="mailto:admin@flourishtendercare.com.ng">Schedule a visit</a>
          </div>
        </div>
        <p className="footer-year">© 2026 Flourish Tendercare School</p>
      </footer>
      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </>
  );
}

export default Footer;
