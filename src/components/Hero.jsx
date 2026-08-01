function Hero() {
  return (
    <header className="hero">
      <nav className="topbar">
        <div className="brand">
          <span className="brand-mark">FT</span>
          <div>
            <h1>Flourish Tender Care</h1>
            <p>Nurturing minds, shaping futures</p>
          </div>
        </div>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#programs">Programs</a>
          <a href="#events">Events</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <div className="hero-content">
        <div>
          <p className="eyebrow">A joyful, future-focused school</p>
          <h2>Where learning meets love, curiosity and confidence.</h2>
          <p className="hero-copy">
            We create a warm, child-centered environment where every learner is inspired to thrive academically, socially, and emotionally.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#contact">Apply for admission</a>
            <a className="btn btn-secondary" href="#about">Discover more</a>
          </div>
        </div>
        <div className="hero-card">
          <h3>Why parents choose us</h3>
          <ul>
            <li>Play-based and inquiry-driven learning</li>
            <li>Strong values and character development</li>
            <li>Bright, safe and nurturing classrooms</li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Hero;
