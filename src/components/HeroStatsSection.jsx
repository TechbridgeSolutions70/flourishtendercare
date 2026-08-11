import { useState, useRef, useEffect, useMemo } from 'react';
import directorPhoto from '../Public/peopel/pic23.jpg';
import schoolLogo from '../Public/logo/logo1.jpeg';

export default function HeroStatsSection() {
  // Playlist and player state
  const envVideo = import.meta.env && import.meta.env.VITE_LOCAL_VIDEO_URL;
  const videos = useMemo(() => {
    const map = import.meta.glob('../Public/video/*.{mp4,webm}', { eager: true, as: 'url' });
    const entries = Object.keys(map).map((p) => ({ path: p, url: map[p] }));
    entries.sort((a, b) => a.path.localeCompare(b.path));
    const urls = entries.map((e) => e.url);
    if (envVideo) {
      const found = urls.findIndex((u) => u === envVideo || u.includes(envVideo));
      if (found === -1) return [envVideo, ...urls];
    }
    return urls;
  }, [envVideo]);

  const initialIndex = useMemo(() => {
    const idx = videos.findIndex((u) => u.includes('vid2'));
    return idx === -1 ? 0 : idx;
  }, [videos]);

  const videoRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (envVideo) {
      const i = videos.findIndex((u) => u === envVideo || u.includes(envVideo));
      if (i !== -1) setCurrentIndex(i);
    }
  }, [videos, envVideo]);

  const handleNext = () => {
    setCurrentIndex((i) => (i + 1) % (videos.length || 1));
    setTimeout(() => videoRef.current && videoRef.current.play && videoRef.current.play(), 80);
  };

  const currentSrc = videos[currentIndex] || envVideo || '';

  return (
    <section className="section welcome-address-section">
      <div className="welcome-address-shell">
        <div className="welcome-copy">
          <p className="eyebrow">Welcome Address</p>
          <h2>
            Flourish Tender Care was founded to provide a total-child education that is warm, secure, and future-ready.
          </h2>
          <p>
            Our mission is to raise confident learners through nurturing relationships, meaningful classroom experiences, and strong family partnerships.
          </p>
          <p>
            From early years to primary, our school supports each child with caring teachers, thoughtful spaces, and a joyful pace of learning.
          </p>

          <div className="welcome-profile-card">
            <div className="welcome-profile-avatar">
              <img src={directorPhoto} alt="Coach Roseline Iraoya" />
            </div>
            <div className="welcome-profile-copy">
              <h3>Coach Roseline Iraoya</h3>
              <span>Executive Director, Flourish Tender Care</span>
            </div>
          </div>
        </div>

        <div className="welcome-video">
          <div className="video-frame">
            <div className="video-badge">Explore with Flourish</div>

            <video
              ref={videoRef}
              className="internal-welcome-video"
              src={currentSrc}
              controls
              playsInline
              preload="metadata"
              poster={schoolLogo}
            />

            <button className="video-next-button" type="button" onClick={handleNext} aria-label="Play next video">
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
