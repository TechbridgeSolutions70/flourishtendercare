import NavBar from '../components/NavBar';
import TestimonialSection from '../components/TestimonialSection';
import Footer from '../components/Footer';

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

      <Footer />
    </div>
  );
}
