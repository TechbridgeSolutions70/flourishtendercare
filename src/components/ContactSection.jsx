import { useState } from 'react';
import { useToast } from './ToastProvider';

function ContactSection() {
  const { addToast } = useToast();
  const [status, setStatus] = useState('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('sending');

    try {
      const { saveContactMessage } = await import('../lib/supabaseClient');
      const { error } = await saveContactMessage(formData);

      if (error) {
        setStatus('error');
        addToast('Unable to send your message. Please try again.', { type: 'error', duration: 5000 });
        return;
      }

      setStatus('sent');
      addToast('Message sent successfully. We will get back to you soon.', { type: 'success', duration: 5000 });
      setFormData({ name: '', email: '', message: '' });
    } catch (_unexpectedError) {
      setStatus('error');
      addToast('Unable to send your message. Please try again.', { type: 'error', duration: 5000 });
    }
  };

  return (
    <section id="contact" className="section section-alt contact-section">
      <div className="section-heading">
        <p className="eyebrow">Talk with us</p>
        <h2>Ready to connect? We’re here to help.</h2>
      </div>

      <div className="contact-grid">
        <div className="contact-copy card">
          <h3>Visit or message us</h3>
          <p>We welcome questions from parents and caregivers. Reach out to schedule a tour, learn about admissions, or hear more about our programs.</p>
          <p>
            <strong>Address:</strong><br />
            #5 Muyibat Ashani Street, Peaceville Estate, Badore, Ajah, Lagos
          </p>
          <p>
            <strong>Email:</strong><br />
            <a href="mailto:info@flourishtendercare.com.ng">info@flourishtendercare.com.ng</a>
          </p>
          <p>
            <strong>Phone:</strong><br />
            <a href="tel:+2348037383820">(+234) 803 738 3820</a>
          </p>
        </div>

        <form className="contact-form card" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your name"
            />
          </label>
          <label className="form-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
            />
          </label>
          <label className="form-field">
            <span>Message</span>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Tell us how we can help"
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
            {status === 'sent' ? 'Message sent' : status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          {status === 'sent' && (
            <p className="form-success">Thanks! We’ll reach out soon.</p>
          )}
          {status === 'error' && (
            <p className="form-error">Unable to send your message. Please try again.</p>
          )}
        </form>
      </div>
    </section>
  );
}

export default ContactSection;
