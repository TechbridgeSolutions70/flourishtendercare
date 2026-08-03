const heroHighlights = [
  'Limited spaces available for 2026/2027',
  'A calm, secure day school experience',
  'Individual attention from expert caregivers',
];

export default function HeroPostSection() {
  return (
    <section id="admissions-highlights" className="section hero-post-section" data-aos="fade-up">
      <div className="hero-post-shell">
        <div className="hero-post-copy" data-aos="fade-up" data-aos-delay="80">
          <p className="eyebrow">Admissions now open</p>
          <h2>Secure your child’s place at Flourish Tender Care today.</h2>
          <p>
            Our school offers a gentle, values-led environment where children grow academically, socially, and emotionally.
          </p>
          <ul className="hero-post-list">
            {heroHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="hero-post-actions">
            <a className="btn btn-primary" href="https://portal.flourishtendercare.com.ng/apply" target="_blank" rel="noreferrer">
              Apply via Portal
            </a>
            <a className="btn btn-secondary" href="#contact">
              Request Prospectus
            </a>
          </div>
        </div>

        <div className="hero-post-card" data-aos="fade-up" data-aos-delay="120">
          <p className="hero-card-label">Welcome Address</p>
          <h3>We create a joyful path for every learner.</h3>
          <p className="hero-card-subtitle">
            Flourish Tender Care is built around safety, warm relationships, and meaningful learning each day.
          </p>
          <div className="hero-post-card-meta">
            <span>Founder message</span>
            <strong>Mrs. Abiola Johnson</strong>
          </div>
          <a className="btn btn-secondary" href="#about">
            Read the welcome message
          </a>
        </div>
      </div>
    </section>
  );
}
