import directorPhoto from '../Public/peopel/schmummy1.jpeg';

export default function HeroStatsSection() {
  return (
    <section className="section welcome-address-section" data-aos="fade-up">
      <div className="welcome-address-shell">
        <div className="welcome-copy" data-aos="fade-up" data-aos-delay="80">
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

        <div className="welcome-video" data-aos="fade-up" data-aos-delay="120">
          <div className="video-frame">
            <div className="video-badge">WELCOME ADDRESS</div>
            <iframe
              title="Welcome address video"
              src="https://www.youtube.com/embed/ScMzIvxBSi4"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
