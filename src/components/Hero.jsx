import { useEffect, useState } from 'react';
import logo from '../Public/logo/logo1.jpeg';

const heroSlides = [
  {
    caption: 'A joyful, future-focused school',
    title: 'Where learning meets love, curiosity and confidence.',
    description:
      'We create a warm, child-centered environment where every learner is inspired to thrive academically, socially, and emotionally.',
    backgroundImage:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80',
    featuredImage:
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=900&q=80',
    cardSubtitle: 'Play-based learning, powerful growth, and calm support.',
    cardPoints: ['Play-based exploration', 'Creative thinking practice', 'Hands-on learning labs'],
  },
  {
    caption: 'Safe, inspiring classrooms for every child',
    title: 'Growing creative thinkers with kindness and curiosity.',
    description:
      'Our curriculum blends exploration, imagination, and social-emotional learning for lifelong growth.',
    backgroundImage:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80',
    featuredImage:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80',
    cardSubtitle: 'A caring community where each student is seen and supported.',
    cardPoints: ['Gentle guidance from teachers', 'Strong family connection', 'A safe, joyful environment'],
  },
  {
    caption: 'Playful learning, meaningful growth',
    title: 'Hands-on discovery and joyful learning every day.',
    description:
      'Students build confidence through purposeful play, strong values, and warm relationships.',
    backgroundImage:
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1600&q=80',
    featuredImage:
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80',
    cardSubtitle: 'Confidence, curiosity, and character through everyday discovery.',
    cardPoints: ['Character development', 'Social-emotional support', 'Every child feels valued'],
  },
];

function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((value) => (value + 1) % heroSlides.length);
    }, 6500);

    return () => clearInterval(interval);
  }, []);

  const slide = heroSlides[current];

  const handlePrev = () => setCurrent((value) => (value - 1 + heroSlides.length) % heroSlides.length);
  const handleNext = () => setCurrent((value) => (value + 1) % heroSlides.length);

  return (
    <header className="hero hero-slider" data-aos="fade">
      <div className="hero-background" style={{ backgroundImage: `url(${slide.backgroundImage})` }} />

      <nav className="topbar">
        <div className="brand">
          <img src={logo} alt="Flourish Tender Care logo" className="brand-logo" />
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
        <div className="hero-slide">
          <div className="hero-copy-panel" key={slide.caption} data-aos="fade-right" data-aos-delay="120">
            <div className="hero-copy-inner">
              <div className="hero-copy-animated">
                <p className="eyebrow">{slide.caption}</p>
                <h2>{slide.title}</h2>
                <p className="hero-copy-text">{slide.description}</p>
                <div className="hero-actions">
                  <a className="btn btn-primary" href="#contact">
                    Apply for admission
                  </a>
                  <a className="btn btn-secondary" href="#about">
                    Discover more
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-card" key={`${slide.caption}-card`} data-aos="fade-left" data-aos-delay="220">
            <div className="hero-card-animated">
              <p className="hero-card-label">Why parents choose us</p>
              <h3>What families love</h3>
              <p className="hero-card-subtitle">{slide.cardSubtitle}</p>
              <ul>
                {slide.cardPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <button className="hero-control hero-control-left" type="button" onClick={handlePrev} aria-label="Previous slide">
        ‹
      </button>

      <button className="hero-control hero-control-right" type="button" onClick={handleNext} aria-label="Next slide">
        ›
      </button>

      <div className="hero-pagination">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`hero-dot ${index === current ? 'active' : ''}`}
            type="button"
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </header>
  );
}

export default Hero;
