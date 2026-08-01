import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import ProgramsSection from './components/ProgramsSection';
import NewsSection from './components/NewsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="page-shell">
      <Hero />
      <main>
        <AboutSection />
        <ProgramsSection />
        <NewsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
