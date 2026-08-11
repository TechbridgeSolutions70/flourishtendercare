import directorPhoto from '../Public/peopel/pic23.jpg';
import schoolLogo from '../Public/logo/logo1.jpeg';
const welcomeVideo = new URL('../Public/video/vid1.mp4', import.meta.url).href;

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
              // Use an internal HTML5 video player. Configure the source via Vite env: VITE_LOCAL_VIDEO_URL
              // Example values:
              // - "/src/Public/hero/welcome.mp4" (imported/static path)
              // - "https://cdn.example.com/videos/welcome.mp4"
              const envVideo = import.meta.env && import.meta.env.VITE_LOCAL_VIDEO_URL;
              const localVideo = envVideo || welcomeVideo;

              return (
                <video
                  className="internal-welcome-video"
                  src={localVideo}
                  controls
                  playsInline
                  preload="metadata"
                  poster={schoolLogo}
                />
              );

              // Fallback: show poster + link to open the director photo or where to watch
              return (
                <div className="video-fallback" style={{ marginTop: 12 }}>
                  <a href={schoolLogo} target="_blank" rel="noreferrer" style={{ display: 'flex', gap: 12, alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                    <img src={schoolLogo} alt="Watch video" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                    <div>
                      <strong>Watch the welcome video</strong>
                      <div style={{ color: 'var(--text-secondary)' }}>No internal video configured — click to view poster image.</div>
                    </div>
                  </a>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </section>
  );
}
