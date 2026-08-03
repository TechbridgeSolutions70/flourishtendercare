import { useEffect, useState } from 'react';

const newsImageFiles = import.meta.glob('../Public/news/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const newsImageUrls = Object.entries(newsImageFiles)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
  .map(([, url]) => url);

const newsImageSources = {
  creche: newsImageUrls.find((url) => url.toLowerCase().includes('creche')),
  heroPic4: newsImageUrls.find((url) => url.toLowerCase().includes('hero pic4')),
  heropic1: newsImageUrls.find((url) => url.toLowerCase().includes('heropic1')),
  heropic2: newsImageUrls.find((url) => url.toLowerCase().includes('heropic2')),
  heropic3: newsImageUrls.find((url) => url.toLowerCase().includes('heropic3')),
  heropic5: newsImageUrls.find((url) => url.toLowerCase().includes('heropic5')),
};

const galleryItems = [
  {
    title: 'Creche welcome day',
    description: 'Little learners arrive in calm, colourful creche spaces designed for curiosity, comfort, and safe exploration.',
    image: newsImageSources.creche || newsImageUrls[0],
    alt: 'Young children arriving at a creche learning environment',
  },
  {
    title: 'Active class learning',
    description: 'A busy classroom scene celebrating movement, teamwork, and hands-on learning across early school groups.',
    image: newsImageSources.heroPic4 || newsImageUrls[1],
    alt: 'Children engaged in active school activities',
  },
  {
    title: 'Nursery story time',
    description: 'Nursery learners gather for story time and social play in a bright, welcoming space built for gentle growth.',
    image: newsImageSources.heropic1 || newsImageUrls[2],
    alt: 'Nursery children enjoying story time together',
    focusTop: true,
  },
  {
    title: 'Playful outdoor moments',
    description: 'Young learners enjoy outdoor play and discovery with friends, building confidence in every step.',
    image: newsImageSources.heropic3 || newsImageUrls[3],
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
