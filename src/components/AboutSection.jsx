import { useState } from 'react';

const aboutSlides = [
  {
    title: 'Our Mission',
    summary: 'At Flourish TenderCare School, we nurture every child’s potential and character through joyful, inquiry-driven learning, strong values, and diverse opportunities that build creativity and leadership for the 21st century.',
    details: 'We create a secure and stimulating environment where children grow in confidence, curiosity, and character.',
  },
  {
    title: 'Our Vision',
    summary: 'To discover and activate greatness in every child, raising communities of intentional learners nurtured for global relevance.',
    details: 'Our vision is to inspire lifelong learning through excellence, creativity, and purposeful care at every stage.',
  },
  {
    title: 'Core Values',
    summary: 'GODLINESS: Build positive character in every pupil. EXCELLENCE: Striving for outstanding performance in all endeavours. VALUE-ORIENTED: Embodying values that shape character and actions. CREATIVITY: Encouraging innovation and imagination. CHILD-CENTEREDNESS: Prioritising the needs and well-being of every child. FAMILY CENTEREDNESS: Nurturing strong family bonds and partnerships. FUN: Creating a joyful and engaging learning environment.',
    details: 'These values shape our daily interactions, our teaching, and the warm community we build around every child.',
  },
];

function AboutSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="about" className="section about-section" data-aos="fade-up">
      <div className="about-intro" data-aos="fade-up" data-aos-delay="80">
        <p className="eyebrow">About Us</p>
        <h2>Flourish Tender Care passionately nurtures children in Lagos, Nigeria.</h2>
        <p>
          Our caring and supportive environment helps children grow into well-rounded, confident, and academically excellent students.
        </p>
        <p>
          We believe in fostering a love for learning and empowering each child to reach their full potential. Join us in cultivating a brighter future for our children, where they can flourish and thrive in their educational journey.
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
