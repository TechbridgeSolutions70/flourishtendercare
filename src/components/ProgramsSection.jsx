function ProgramsSection() {
  return (
    <section id="programs" className="section section-alt" data-aos="fade-up">
      <div className="section-heading" data-aos="fade-up" data-aos-delay="80">
        <p className="eyebrow">Learning levels</p>
        <h2>Programs designed for every stage of growth</h2>
      </div>
      <div className="programs-grid">
        <div className="program-card" data-aos="fade-up" data-aos-delay="120">
          <h3>Creche / Playgroup</h3>
          <p>Gentle, engaging early learning that builds confidence, communication and social skills.</p>
        </div>
        <div className="program-card" data-aos="fade-up" data-aos-delay="180">
          <h3>Nursery</h3>
          <p>Discovery-based learning with creativity, sensory play and foundational literacy.</p>
        </div>
        <div className="program-card" data-aos="fade-up" data-aos-delay="240">
          <h3>Primary</h3>
          <p>Academic excellence and character development in a supportive and stimulating setting.</p>
        </div>
      </div>
    </section>
  );
}

export default ProgramsSection;
