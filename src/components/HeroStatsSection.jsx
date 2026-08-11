import { useState, useRef, useEffect } from 'react';
import directorPhoto from '../Public/peopel/pic23.jpg';
import schoolLogo from '../Public/logo/logo1.jpeg';
const vid1 = new URL('../Public/video/vid1.mp4', import.meta.url).href;
const vid2 = new URL('../Public/video/vid2.mp4', import.meta.url).href;

export default function HeroStatsSection() {
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
            {(() => {
              // Internal HTML5 player with a simple two-item playlist: default to vid2, next switches to vid1.
              const envVideo = import.meta.env && import.meta.env.VITE_LOCAL_VIDEO_URL;
              const defaultVideo = envVideo || vid2; // default is vid2
              const videoRef = useRef(null);
              const [currentSrc, setCurrentSrc] = useState(defaultVideo);

              useEffect(() => {
                // If envVideo changes externally, update source
                if (envVideo && envVideo !== currentSrc) setCurrentSrc(envVideo);
                // eslint-disable-next-line react-hooks/exhaustive-deps
              }, [envVideo]);

              const handleNext = () => {
                // Switch to vid1 when Next clicked
                setCurrentSrc(vid1);
                // play after source update
                setTimeout(() => videoRef.current && videoRef.current.play && videoRef.current.play(), 80);
              };

              return (
                <>
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
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </section>
  );
}
