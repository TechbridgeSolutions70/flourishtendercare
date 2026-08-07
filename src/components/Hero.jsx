import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';

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
      const slideContent = [
        {
          caption: 'A welcoming campus for every child',
          title: 'A safe and inspiring place for children to learn and grow.',
          description: 'Bright classrooms, open play spaces and caring teachers come together to create a calm setting for discovery, growth and joyful learning.',
        },
        {
          caption: 'Gentle care in our Creche',
          title: 'Warm, attentive care for little ones in our Creche.',
          description: 'With nurturing teachers and a soothing environment, babies and toddlers are encouraged to bond, grow and discover the world around them with comfort.',
        },
        {
          caption: 'Curiosity in Nursery',
          title: 'Playful learning that builds curiosity and confidence in Nursery.',
          description: 'Play-based activities spark imagination, strengthen language and support each child’s social and emotional growth in a joyful way.',
        },
        {
          caption: 'Ready for Primary',
          title: 'Strong academics and values for confident Primary learners.',
          description: 'Our lessons encourage inquiry, discipline and leadership so children are prepared for the next stage with confidence and clarity.',
        },
        {
          caption: 'A well-rounded school experience',
          title: 'Every child is encouraged to shine through learning and creativity.',
          description: 'Through engaging classroom experiences and expressive activities, we nurture communication, imagination and self-belief in every child.',
        },
        {
          caption: 'A school that grows with families',
          title: 'A caring school community where families and children grow together.',
          description: 'At Flourish Tender Care, every milestone is celebrated and every family feels welcomed into the journey of learning and growth.',
        },
      ];

      const selected = slideContent[index % slideContent.length];
      const lowerImageName = imageUrl.toLowerCase();

      return {
        ...selected,
        backgroundImage: imageUrl,
        backgroundPosition: lowerImageName.includes('heropic1') || lowerImageName.includes('hero pic4') ? 'center 10%' : lowerImageName.includes('creche') ? 'center 30%' : 'center 35%',
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
  const [previous, setPrevious] = useState(null);
  const progressRef = useRef(null);
  const intervalMs = 6500;

  useEffect(() => {
    const tick = () => {
      setCurrent((value) => {
        setPrevious(value);
        return (value + 1) % heroSlides.length;
      });
    };
    const interval = setInterval(tick, intervalMs);
    return () => clearInterval(interval);
  }, []);

  const slide = heroSlides[current];
  const prevSlide = previous !== null ? heroSlides[previous] : null;

  useEffect(() => {
    const el = progressRef.current;
    if (!el) return undefined;
    el.style.animation = 'none';
    el.offsetWidth;
    el.style.animation = `progress ${intervalMs}ms linear forwards`;
    return undefined;
  }, [current]);

  useEffect(() => {
    if (previous === null) return undefined;
    const timeoutId = window.setTimeout(() => setPrevious(null), 900);
    return () => window.clearTimeout(timeoutId);
  }, [previous]);

  const goTo = (index) => {
    if (index === current) return;
    setPrevious(current);
    setCurrent(index);
  };

 

  return (
    <header className="hero hero-slider">
      <div className="hero-background-layer">
        {prevSlide && (
          <div
            key={prevSlide.backgroundImage}
            className="hero-background hero-background-prev"
            style={{ backgroundImage: `url(${prevSlide.backgroundImage})`, backgroundPosition: prevSlide.backgroundPosition }}
          />
        )}
        <div
          key={slide.backgroundImage}
          className="hero-background hero-background-current"
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
          <div className="hero-copy-panel">
            <div className="hero-copy-inner">
              <div className="hero-copy-animated">
                <p className="hero-badge">Where Every Child Discovers Their Potential</p>
                <p className="eyebrow">{slide.caption}</p>
                <h2 className="hero-title">{slide.title}</h2>
                <p className="hero-copy-text">{slide.description}</p>
                <div className="hero-actions">
                  <a className="btn btn-primary" href={slide.ctaPrimaryHref}>{slide.ctaPrimary}</a>
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
              <img src={slideItem.backgroundImage} alt="" loading="lazy" />
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
