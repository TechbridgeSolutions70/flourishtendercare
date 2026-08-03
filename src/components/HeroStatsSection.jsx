const stats = [
  { value: '7 campuses', label: 'Serving children across early years and primary' },
  { value: 'Safe & calm', label: 'A protected environment with attentive care' },
  { value: 'Small classes', label: 'Personal support for every child’s learning journey' },
  { value: 'Family-led', label: 'Strong partnerships between school and parents' },
];

export default function HeroStatsSection() {
  return (
    <section className="section hero-stats-section" data-aos="fade-up">
      <div className="hero-stats-shell">
        <div className="hero-stats-copy" data-aos="fade-up" data-aos-delay="80">
          <p className="eyebrow">Why families trust Flourish</p>
          <h2>Thoughtful care, joyful classrooms, and real growth.</h2>
          <p>
            We combine nurturing teachers with engaging learning spaces so children feel confident, happy, and ready for the next step.
          </p>
        </div>

        <div className="hero-stats-grid" data-aos="fade-up" data-aos-delay="120">
          {stats.map((stat) => (
            <article key={stat.value} className="hero-stat">
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
