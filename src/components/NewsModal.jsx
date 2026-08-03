import { useEffect, useState } from 'react';
import HeroCreche from '../Public/news/Creche.jpg.jpeg';
import HeroPic4 from '../Public/news/hero pic4.jpeg';
import HeroPicOne from '../Public/news/heropic1.jpeg';
import HeroPic5 from '../Public/news/heropic5.jpeg';

const newsUpdates = [
  {
    title: 'Creche classroom launch event',
    description: 'Our creche spaces welcome little learners with warm classrooms, playful learning corners, and caring staff.',
    image: HeroCreche,
    alt: 'Creche classroom setup with colourful learning areas',
    footer: 'Creche admissions and early years news.',
  },
  {
    title: 'Active learning day in school',
    description: 'Students enjoyed a full day of hands-on lessons, teamwork, and creative activities across our learning spaces.',
    image: HeroPic4,
    alt: 'Children engaged in a classroom activity',
    footer: 'School events and student experiences.',
  },
  {
    title: 'Nursery programme intake now open',
    description: 'Our nurturing nursery programme is open for enrollment, offering early literacy, social play, and gentle routines.',
    image: HeroPicOne,
    alt: 'Nursery children learning together',
    footer: 'Nursery admissions and programme updates.',
    focusTop: true,
  },
  {
    title: 'Primary class showcase',
    description: 'See how our primary sections build confidence through classroom discovery, reading, and group projects.',
    image: HeroPic5,
    alt: 'Primary school children in a classroom setting',
    footer: 'Primary school news and activities.',
  },
];

export default function NewsModal({ visible, onClose }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeItem = newsUpdates[activeIndex];
  const goPrev = () => setActiveIndex((value) => (value - 1 + newsUpdates.length) % newsUpdates.length);
  const goNext = () => setActiveIndex((value) => (value + 1) % newsUpdates.length);

  useEffect(() => {
    if (!visible) return undefined;

    const interval = window.setInterval(() => {
      setActiveIndex((value) => (value + 1) % newsUpdates.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [visible]);

  useEffect(() => {
    if (visible) setActiveIndex(0);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-card news-modal-card news-modal-card--compact" onClick={(event) => event.stopPropagation()}>
        <div className="modal-body">
          <div className="modal-header">
            <div>
              <p className="eyebrow">{activeItem.footer}</p>
              <h3>{activeItem.title}</h3>
              <p>{activeItem.description}</p>
            </div>
            <button type="button" className="modal-close" onClick={onClose} aria-label="Close modal">
              ×
            </button>
          </div>

          <div className="news-modal-image-wrap">
            <img
              src={activeItem.image}
              alt={activeItem.alt}
              className={`news-modal-image ${activeItem.focusTop ? 'focus-top' : ''}`}
            />
          </div>

          <div className="news-update-actions news-update-actions--centered">
            <a className="btn btn-primary" href="https://portal.flourishtendercare.com.ng/apply" target="_blank" rel="noreferrer">
              Apply now
            </a>
            <a className="btn btn-ghost" href="#news" onClick={onClose}>
              Read more
            </a>
          </div>

          <div className="news-modal-nav">
            <button className="news-modal-arrow" type="button" onClick={goPrev} aria-label="Previous news">
              ‹
            </button>
            <button className="news-modal-arrow" type="button" onClick={goNext} aria-label="Next news">
              ›
            </button>
          </div>

          <div className="news-modal-dots">
            {newsUpdates.map((item, index) => (
              <button
                key={item.title}
                type="button"
                className={`news-modal-dot ${index === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to ${item.title}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
