import NavBar from '../components/NavBar';
import TestimonialSection from '../components/TestimonialSection';

export default function TestimonialPage() {
  return (
    <div className="page-shell testimonial-page-shell">
      <NavBar />
      <header className="testimonial-page-hero">
        <div className="testimonial-page-hero-inner">
          <p className="eyebrow">Parent Voices</p>
          <h1>Real stories from the Flourish Tender Care community</h1>
          <p>Discover what families are saying about our values-driven learning environment, nurturing teachers, and joyful early years experience.</p>
        </div>
      </header>
      <main className="testimonial-page-main">
        <TestimonialSection />
      </main>

      <section className="testimonial-cta-section">
        <div className="testimonial-cta-shell">
          <div className="testimonial-cta-copy">
            <p className="eyebrow">Join the conversation</p>
            <h2>Have a story to share? We’d love to hear from you.</h2>
            <p>
              Submit a testimonial to help other families discover the Flourish Tender Care difference, or contact our admissions team to learn how to get started.
            </p>
          </div>
          <div className="testimonial-cta-actions">
            <a className="btn btn-primary" href="#testimonial-form">
              Share your story
            </a>
            <a className="btn btn-secondary" href="/#contact">
              Contact admissions
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
