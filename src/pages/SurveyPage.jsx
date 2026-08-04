import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Survey from '../components/Survey';

export default function SurveyPage() {
  return (
    <div className="page-shell survey-page-shell">
      <NavBar />
      <main className="survey-page-main">
        <Survey />
      </main>
      <Footer />
    </div>
  );
}
