import { useEffect, useState } from 'react';

const newsImageFiles = import.meta.glob('../Public/news/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const newsImageUrls = Object.entries(newsImageFiles)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
  .map(([, url]) => url);

const galleryItems = [
  {
    title: 'Playful Learning in Action',
    description: 'Bright spaces, warm teachers, and joyful moments that make each day feel exciting and meaningful.',
    image: newsImageUrls[0] || 'https://via.placeholder.com/1200x800.png?text=News+Image+1',
    alt: 'Children learning in a bright classroom setting',
  },
  {
    title: 'Growing Through Discovery',
    description: 'Our children explore, create, and build confidence through hands-on activities and guided curiosity.',
    image: newsImageUrls[1] || 'https://via.placeholder.com/1200x800.png?text=News+Image+2',
    alt: 'Children exploring creative learning materials',
  },
  {
    title: 'A Community That Cares',
    description: 'Every child feels seen, supported, and celebrated as part of a warm and connected school family.',
    image: newsImageUrls[2] || 'https://via.placeholder.com/1200x800.png?text=News+Image+3',
    alt: 'A smiling school community gathering',
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
    <section id="news" className="section gallery-section" data-aos="fade-up">
      <div className="section-heading" data-aos="fade-up" data-aos-delay="80">
        <p className="eyebrow">News and events</p>
        <h2>Moments that capture our school spirit</h2>
      </div>

      <div className="gallery-shell" data-aos="fade-up" data-aos-delay="120">
        <div className="gallery-frame">
          <div className="gallery-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
            {galleryItems.map((item) => (
              <article key={item.title} className="gallery-slide">
                <img src={item.image} alt={item.alt} />
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
