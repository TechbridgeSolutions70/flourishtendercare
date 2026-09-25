import crecheImage from '../Public/news/Creche.jpg.jpeg';
import playgroupImage from '../Public/news/heropic2.jpeg';
import nurseryImage from '../Public/news/heropic1.jpeg';
import primaryImage from '../Public/news/hero pic4.jpeg';

function ProgramsSection() {
  return (
    <section id="programs" className="section section-alt">
      <div className="section-heading">
        <p className="eyebrow">Learning levels</p>
        <h2>Programs designed for every stage of growth</h2>
      </div>
      <div className="programs-grid">
        <div className="program-card">
          <img className="program-card-image" src={crecheImage} alt="Creche classroom" />
          <p className="program-pill">Ages 0–2</p>
          <h3>Creche</h3>
          <p>Secure, nurturing care with gentle routines, restful spaces, and meaningful early bonding.</p>
        </div>
        <div className="program-card">
          <img className="program-card-image" src={playgroupImage} alt="Playgroup classroom" />
          <p className="program-pill">Ages 2–4</p>
          <h3>Playgroup</h3>
          <p>Joyful early learning filled with songs, movement, exploration, and social confidence.</p>
        </div>
        <div className="program-card">
          <img className="program-card-image" src={nurseryImage} alt="Nursery classroom" />
          <p className="program-pill">Ages 4–6</p>
          <h3>Nursery</h3>
          <p>Discovery-based learning with creative play, foundational literacy, and growing independence.</p>
        </div>
        <div className="program-card">
          <img className="program-card-image" src={primaryImage} alt="Primary school classroom" />
          <p className="program-pill">Primary</p>
          <h3>Primary School</h3>
          <p>Academic excellence, values-based learning, and a supportive environment for lasting growth.</p>
        </div>
      </div>
    </section>
  );
}

export default ProgramsSection;
