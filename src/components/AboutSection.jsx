import { useState } from 'react';

const aboutSlides = [
  {
    title: 'Our Mission',
    summary: 'To nurture every child’s potential through joyful learning, strong values, and compassionate guidance.',
    details: 'We create a secure and stimulating environment where children grow in confidence, curiosity, and character.',
  },
  {
    title: 'Our Vision',
    summary: 'To raise confident, capable, and future-ready learners who make meaningful contributions to the world.',
    details: 'Our vision is to inspire lifelong learning through excellence, creativity, and purposeful care at every stage.',
  },
  {
    title: 'Core Values',
    summary: 'Godliness, excellence, creativity, care, and family partnership guide all that we do.',
    details: 'These values shape our daily interactions, our teaching, and the warm community we build around every child.',
  },
];

function AboutSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="about" className="section about-section" data-aos="fade-up">
      <div className="about-intro" data-aos="fade-up" data-aos-delay="80">
        <p className="eyebrow">About the school</p>
        <h2>A caring school community grounded in purpose and warmth.</h2>
        <p>
          Flourish Tender Care is a nurturing environment where children feel secure, inspired, and ready for every next step.
        </p>
      </div>

      <div className="about-slider-shell" data-aos="fade-up" data-aos-delay="140">
        <div className="about-tab-row" role="tablist" aria-label="About school sections">
          {aboutSlides.map((item, index) => (
            <button
              key={item.title}
              type="button"
              className={`about-tab ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
            >
              {item.title}
            </button>
          ))}
        </div>

        <div className="about-slider-viewport">
          <div className="about-slider-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
            {aboutSlides.map((item) => (
              <article key={item.title} className="about-slide">
                <h3>{item.title}</h3>
                <p className="about-slide-summary">{item.summary}</p>
                <p className="about-slide-details">{item.details}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
