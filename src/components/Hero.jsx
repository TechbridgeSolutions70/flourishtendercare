import { useEffect, useMemo, useRef, useState } from 'react';
import AOS from 'aos';

const heroImageFiles = import.meta.glob('../Public/hero/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const heroImageUrls = Object.entries(heroImageFiles)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
  .map(([, url]) => url);

const heroSlides = heroImageUrls.length
  ? heroImageUrls.map((imageUrl, index) => {
      const captions = [
        'School compound & campus life',
        'Curiosity in every corner',
        'Ready for the next step',
      ];
      const titles = [
        'Welcome to our campus — where learning begins with a safe, inspiring environment.',
        'Playful discovery that builds confidence in Nursery.',
        'Primary-ready learners with character and purpose.',
      ];
      const descriptions = [
        'Tour our gardens, classrooms and activity spaces, designed to support every child’s growth in a caring, confident way.',
        'Stories, movement, and hands-on activities turn learning into something exciting and memorable.',
        'We blend academic strength with values, independence, and joyful challenge for lasting growth.',
      ];

      return {
        caption: captions[index % captions.length],
        title: titles[index % titles.length],
        description: descriptions[index % descriptions.length],
        backgroundImage: imageUrl,
        backgroundPosition: imageUrl.toLowerCase().includes('heropic1') ? 'center 10%' : 'center 35%',
        ctaPrimary: 'Apply Now',
        ctaPrimaryHref: 'https://portal.flourishtendercare.com.ng/apply',
        ctaSecondary: 'Read More',
        ctaSecondaryHref: '#news',
      };
    })
  : [
      {
        caption: 'School compound & campus life',
        title: 'Welcome to our campus — where learning begins with a safe, inspiring environment.',
        description:
          'Tour our gardens, classrooms and activity spaces, designed to support every child’s growth in a caring, confident way.',
        backgroundImage:
          'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80',
        ctaPrimary: 'About the School',
        ctaPrimaryHref: '#about',
        ctaSecondary: 'Apply Now',
        ctaSecondaryHref: 'https://portal.flourishtendercare.com.ng/apply',
      },
      {
        caption: 'Curiosity in every corner',
        title: 'Playful discovery that builds confidence in Nursery.',
        description:
          'Stories, movement, and hands-on activities turn learning into something exciting and memorable.',
        backgroundImage:
          'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80',
        highlights: ['Story time', 'Early literacy', 'Social confidence'],
        ctaPrimary: 'Enroll in Nursery',
        ctaPrimaryHref: 'https://portal.flourishtendercare.com.ng/apply',
        ctaSecondary: 'Request Nursery Brochure',
        ctaSecondaryHref: '#contact',
      },
      {
        caption: 'Ready for the next step',
        title: 'Primary-ready learners with character and purpose.',
        description:
          'We blend academic strength with values, independence, and joyful challenge for lasting growth.',
        backgroundImage:
          'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1600&q=80',
        highlights: ['Leadership', 'Values', 'Academic strength'],
        ctaPrimary: 'Apply for Primary',
        ctaPrimaryHref: 'https://portal.flourishtendercare.com.ng/apply',
        ctaSecondary: 'Book a School Tour',
        ctaSecondaryHref: '#contact',
      },
    ];

function Hero() {
  const [current, setCurrent] = useState(0);
  const [zoomDirection, setZoomDirection] = useState('in');
  const progressRef = useRef(null);
  const intervalMs = 6500;

  useEffect(() => {
    const tick = () => setCurrent((value) => (value + 1) % heroSlides.length);
    const interval = setInterval(tick, intervalMs);
    return () => clearInterval(interval);
  }, []);

  const slide = heroSlides[current];

  useEffect(() => {
    const el = progressRef.current;
    if (!el) return undefined;
    el.style.animation = 'none';
    // force reflow to restart the progress animation
    // eslint-disable-next-line no-unused-expressions
    el.offsetWidth;
    el.style.animation = `progress ${intervalMs}ms linear forwards`;
    return undefined;
  }, [current]);

  useEffect(() => {
    AOS.refresh();
    setZoomDirection(Math.random() > 0.5 ? 'in' : 'out');
  }, [current, slide]);

  const handlePrev = () => setCurrent((value) => (value - 1 + heroSlides.length) % heroSlides.length);
  const handleNext = () => setCurrent((value) => (value + 1) % heroSlides.length);
  const goTo = (index) => setCurrent(index);

 

  return (
    <header className="hero hero-slider" data-aos="fade">
      <div className="hero-background-layer">
        <div
          key={slide.backgroundImage}
          className={`hero-background hero-background-current hero-background-zoom-${zoomDirection}`}
          style={{ backgroundImage: `url(${slide.backgroundImage})`, backgroundPosition: slide.backgroundPosition }}
        />
      </div>
      <div className="hero-marquee" aria-hidden>
        <div className="marquee-inner">ADMISSIONS OPEN — Apply for 2026/2027 • Limited spaces available • Apply now</div>
      </div>
      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />

      

      <div className="hero-content">
        <div className="hero-slide">
          <div className="hero-copy-panel" key={slide.caption} data-aos="fade-up" data-aos-delay="120">
            <div className="hero-copy-inner">
              <div className="hero-copy-animated">
                <p className="hero-badge">Where Every Child Discovers Their Potential</p>
                <p className="eyebrow">{slide.caption}</p>
                <h2 className="hero-title">{slide.title}</h2>
                <p className="hero-copy-text">{slide.description}</p>
                <div className="hero-actions">
                  <a className="btn btn-primary" href={slide.ctaPrimaryHref}>{slide.ctaPrimary}</a>
                  <a className="btn btn-secondary" href={slide.ctaSecondaryHref}>{slide.ctaSecondary}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-thumbs" aria-hidden>
        <div className="thumbs-list">
          {heroSlides.map((slideItem, index) => (
            <button
              key={index}
              type="button"
              className={`thumb ${index === current ? 'active' : ''}`}
              onClick={() => goTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            >
              <img src={slideItem.backgroundImage} alt="" />
            </button>
          ))}
        </div>
        <div className="thumb-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={(current / heroSlides.length) * 100}>
          <div ref={progressRef} className="thumb-progress-inner" />
        </div>
      </div>

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
