import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Survey from '../components/Survey';
import usePullToRefresh from '../hooks/usePullToRefresh';

export default function SurveyPage() {
  usePullToRefresh();

  useEffect(() => {
    const pageShell = document.querySelector('.page-shell');
    if (pageShell) {
      pageShell.scrollTop = 0;
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

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
