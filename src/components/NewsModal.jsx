import { useEffect, useState } from 'react';
import CrecheImage from '../Public/downloaded files/image/Creche.png';
import NurseryOneImage from '../Public/downloaded files/image/Nursery 1.png';
import PlaygroupTwoImage from '../Public/downloaded files/image/playgroup 2.png';
import PrimarySectionsImage from '../Public/downloaded files/image/primarySections.png';

const newsUpdates = [
  {
    title: 'Creche learning spaces ready for young learners',
    description: 'Our creche classrooms are designed to be safe, inviting, and full of age-appropriate learning corners for early discovery.',
    image: CrecheImage,
    alt: 'Caring creche classroom environment for toddlers',
    footer: 'Creche updates and early years learning news.',
  },
  {
    title: 'Summer lessons and learning camps',
    description: 'Explore our summer programme designed to keep curious young minds active, creative, and growing over the break.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    alt: 'Children doing summer learning activities outdoors',
    footer: 'Creative lessons, small-group learning, and summer play.',
  },
  {
    title: 'Playgroup discovery days bring joy and friendship',
    description: 'Our playgroup team supports children through playful learning, social connections, and creative experiences every day.',
    image: PlaygroupTwoImage,
    alt: 'Young children playing and learning together in playgroup',
    footer: 'Playgroup highlights, activities, and stories.',
  },
  {
    title: 'Primary sections ready for vibrant learning',
    description: 'Explore our colourful primary spaces where learners build literacy, creativity, and confidence through guided activities.',
    image: PrimarySectionsImage,
    alt: 'Primary section classroom and activity zones',
    footer: 'Primary school news and classroom experiences.',
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
      <div className="modal-card news-modal-card" onClick={(event) => event.stopPropagation()}>
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
            <img src={activeItem.image} alt={activeItem.alt} className="news-modal-image" />
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
