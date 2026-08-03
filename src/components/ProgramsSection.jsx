function ProgramsSection() {
  return (
    <section id="programs" className="section section-alt" data-aos="fade-up">
      <div className="section-heading" data-aos="fade-up" data-aos-delay="80">
        <p className="eyebrow">Learning levels</p>
        <h2>Programs designed for every stage of growth</h2>
      </div>
      <div className="programs-grid">
        <div className="program-card" data-aos="fade-up" data-aos-delay="120">
          <p className="program-pill">Ages 0–2</p>
          <h3>Creche</h3>
          <p>Secure, nurturing care with gentle routines, restful spaces, and meaningful early bonding.</p>
        </div>
        <div className="program-card" data-aos="fade-up" data-aos-delay="180">
          <p className="program-pill">Ages 2–4</p>
          <h3>Playgroup</h3>
          <p>Joyful early learning filled with songs, movement, exploration, and social confidence.</p>
        </div>
        <div className="program-card" data-aos="fade-up" data-aos-delay="240">
          <p className="program-pill">Ages 4–6</p>
          <h3>Nursery</h3>
          <p>Discovery-based learning with creative play, foundational literacy, and growing independence.</p>
        </div>
        <div className="program-card" data-aos="fade-up" data-aos-delay="300">
          <p className="program-pill">Primary</p>
          <h3>Primary School</h3>
          <p>Academic excellence, values-based learning, and a supportive environment for lasting growth.</p>
        </div>
      </div>
    </section>
  );
}

export default ProgramsSection;
