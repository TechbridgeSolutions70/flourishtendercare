import { useEffect, useState } from 'react';
import { useToast } from './ToastProvider';

const testimonials = [
  {
    name: 'Mrs. Amina Kazeem',
    excerpt:
      'The nurturing teachers and calm learning environment have made our daughter feel confident and excited about school every day.',
    full:
      'The nurturing teachers and calm learning environment have made our daughter feel confident and excited about school every day. We love the way the school partners with parents and celebrates every small milestone in her learning journey.',
  },
  {
    name: 'Mr. Chinedu Nwosu',
    excerpt:
      'Flourish Tender Care balances fun with strong academic values, and my son is learning to lead with kindness.',
    full:
      'Flourish Tender Care balances fun with strong academic values, and my son is learning to lead with kindness. The staff listens carefully to our concerns and supports his growth both in the classroom and at home.',
  },
  {
    name: 'Mrs. Funke Bello',
    excerpt:
      'The school’s warm community and values-based education have helped our family feel secure and hopeful for our child’s future.',
    full:
      'The school’s warm community and values-based education have helped our family feel secure and hopeful for our child’s future. Every day, we see her curiosity bloom thanks to the teachers and the joyful, inquiry-led learning approach.',
  },
  {
    name: 'Mr. Olumide Adebayo',
    excerpt:
      'The teachers focus on character, creativity, and confidence, which is exactly the experience we wanted for our child.',
    full:
      'The teachers focus on character, creativity, and confidence, which is exactly the experience we wanted for our child. The school makes sure every child feels valued and ready to explore the world with purpose.',
  },
];

function TestimonialSection({ modalMode = false, onClose }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [testimonialName, setTestimonialName] = useState('');
  const [testimonialText, setTestimonialText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((value) => (value + 1) % testimonials.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  const goToPrev = () => setActiveIndex((value) => (value - 1 + testimonials.length) % testimonials.length);
  const goToNext = () => setActiveIndex((value) => (value + 1) % testimonials.length);

  const content = (
    <div className={modalMode ? 'testimonial-modal-content' : 'testimonial-section-content'}>
      {!modalMode && (
        <div className="section-heading">
          <p className="eyebrow">Testimonials</p>
          <h2>Parents share what it’s like to learn here</h2>
        </div>
      )}

      <div className="testimonial-shell">
        <div className="testimonial-card">
          <div className="testimonial-card-grid">
            <div className="testimonial-slider-panel">
              <div className="testimonial-frame">
                <div className="testimonial-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                  {testimonials.map((item) => (
                    <article key={item.name} className="testimonial-slide">
                      <p className="testimonial-quote">“{item.excerpt}”</p>
                      <p className="testimonial-author">— {item.name}</p>
                      <button type="button" className="btn btn-ghost testimonial-readmore" onClick={() => setSelectedTestimonial(item)}>
                        Read more
                      </button>
                    </article>
                  ))}
                </div>
              </div>

              <div className="testimonial-controls">
                <button className="testimonial-control" type="button" onClick={goToPrev} aria-label="Previous testimonial">
                  ←
                </button>
                <div className="testimonial-dots">
                  {testimonials.map((item, index) => (
                    <button
                      key={item.name}
                      type="button"
                      className={`testimonial-dot ${index === activeIndex ? 'active' : ''}`}
                      onClick={() => setActiveIndex(index)}
                      aria-label={`Go to testimonial by ${item.name}`}
                    />
                  ))}
                </div>
                <button className="testimonial-control" type="button" onClick={goToNext} aria-label="Next testimonial">
                  →
                </button>
              </div>
            </div>

            <div className="testimonial-form-panel">
              <div className="section-heading">
                <h2>Submit a parent testimonial</h2>
              </div>
              {submitted ? (
                <div className="testimonial-success">
                  <h3>Thank you for your testimonial!</h3>
                  <p>Your feedback has been recorded. We appreciate your support and will review your message shortly.</p>
                  <button className="btn btn-secondary" type="button" onClick={() => setSubmitted(false)}>
                    Submit another
                  </button>
                </div>
              ) : (
                <form
                  className="testimonial-form"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    setSubmitError('');

                    try {
                      const { saveTestimonial } = await import('../lib/supabaseClient');
                      const { error } = await saveTestimonial({ name: testimonialName, text: testimonialText });
                      if (error) {
                        setSubmitError('Unable to send testimonial. Please try again.');
                        addToast('Unable to send testimonial. Please try again.', { type: 'error', duration: 5000 });
                        return;
                      }

                      setSubmitted(true);
                      setTestimonialName('');
                      setTestimonialText('');
                      addToast('Testimonial sent successfully. Thank you!', { type: 'success', duration: 5000 });
                    } catch (_unexpectedError) {
                      setSubmitError('Unable to send testimonial. Please try again.');
                      addToast('Unable to send testimonial. Please try again.', { type: 'error', duration: 5000 });
                    }
                  }}
                >
                  <div className="testimonial-input-row">
                    <label>
                      Full Name
                      <input
                        type="text"
                        value={testimonialName}
                        onChange={(event) => setTestimonialName(event.target.value)}
                        placeholder="Jane Doe"
                        required
                      />
                    </label>
                  </div>
                  <label>
                    Testimonial
                    <textarea
                      value={testimonialText}
                      onChange={(event) => setTestimonialText(event.target.value)}
                      placeholder="Share what you love about Flourish Tender Care."
                      rows={6}
                      required
                    />
                  </label>
                  <div className="testimonial-actions">
                    <button className="btn btn-secondary" type="button" onClick={() => {
                      setTestimonialName('');
                      setTestimonialText('');
                      setSubmitError('');
                    }}>
                      Reset
                    </button>
                    <button className="btn btn-primary" type="submit">
                      Send Testimonial
                    </button>
                  </div>
                  {submitError && <p className="form-error">{submitError}</p>}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedTestimonial && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={() => setSelectedTestimonial(null)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-body">
              <p className="eyebrow">Full testimonial</p>
              <h3>{selectedTestimonial.name}</h3>
              <p>{selectedTestimonial.full}</p>
              <button className="btn btn-primary" type="button" onClick={() => setSelectedTestimonial(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (modalMode) {
    return (
      <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
        <div className="modal-card testimonial-modal-card" onClick={(event) => event.stopPropagation()}>
          <div className="modal-body">
            <button type="button" className="modal-close" onClick={onClose} aria-label="Close testimonial modal">
              ×
            </button>
            {content}
          </div>
        </div>
      </div>
    );
  }

  return content;
}

export default TestimonialSection;
