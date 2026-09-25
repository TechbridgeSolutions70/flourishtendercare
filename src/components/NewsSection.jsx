import { useEffect, useState } from 'react';
import crecheNewsImage from '../Public/news/Creche.jpg.jpeg';
import heroPic4NewsImage from '../Public/news/hero pic4.jpeg';
import nurseryStoryImage from '../Public/news/heropic1.jpeg';
import outdoorLearningImage from '../Public/news/heropic3.jpeg';

const galleryItems = [
  {
    title: 'Creche welcome day',
    description: 'Little learners arrive in calm, colourful creche spaces designed for curiosity, comfort, and safe exploration.',
    image: crecheNewsImage,
    alt: 'Young children arriving at a creche learning environment',
  },
  {
    title: 'Active class learning',
    description: 'A busy classroom scene celebrating movement, teamwork, and hands-on learning across early school groups.',
    image: heroPic4NewsImage,
    alt: 'Children engaged in active school activities',
  },
  {
    title: 'Nursery story time',
    description: 'Nursery learners gather for story time and social play in a bright, welcoming space built for gentle growth.',
    image: nurseryStoryImage,
    alt: 'Nursery children enjoying story time together',
    focusTop: true,
  },
  {
    title: 'Playful outdoor moments',
    description: 'Young learners enjoy outdoor play and discovery with friends, building confidence in every step.',
    image: outdoorLearningImage,
    alt: 'Children playing together during outdoor school activities',
  },
];

function NewsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((value) => (value + 1) % galleryItems.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, []);

  const goToPrev = () => setActiveIndex((value) => (value - 1 + galleryItems.length) % galleryItems.length);
  const goToNext = () => setActiveIndex((value) => (value + 1) % galleryItems.length);

  return (
    <section id="news" className="section gallery-section">
      <div className="section-heading">
        <p className="eyebrow">News and events</p>
        <h2>Moments that capture our school spirit</h2>
      </div>

      <div className="gallery-shell">
        <div className="gallery-frame">
          <div className="gallery-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
            {galleryItems.map((item) => (
              <article key={item.title} className="gallery-slide">
                <img src={item.image} alt={item.alt} className={item.focusTop ? 'focus-top' : ''} />
                <div className="gallery-copy">
                  <p className="eyebrow">Featured moment</p>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <button className="btn btn-primary" type="button" onClick={() => setSelectedItem(item)}>
                    Read more
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="gallery-controls">
          <button className="gallery-control" type="button" onClick={goToPrev} aria-label="Previous slide">
            ←
          </button>
          <div className="gallery-dots">
            {galleryItems.map((item, index) => (
              <button
                key={item.title}
                type="button"
                className={`gallery-dot ${index === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to ${item.title}`}
              />
            ))}
          </div>
          <button className="gallery-control" type="button" onClick={goToNext} aria-label="Next slide">
            →
          </button>
        </div>
      </div>

      {selectedItem && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={() => setSelectedItem(null)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <img src={selectedItem.image} alt={selectedItem.alt} />
            <div className="modal-body">
              <p className="eyebrow">Full view</p>
              <h3>{selectedItem.title}</h3>
              <p>{selectedItem.description}</p>
              <button className="btn btn-primary" type="button" onClick={() => setSelectedItem(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default NewsSection;
