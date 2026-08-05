import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import AOS from 'aos';
import 'aos/dist/aos.css';
import App from './App';
import { ToastProvider } from './components/ToastProvider';
import './styles.css';

function Root() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: false,
      offset: 40,
      easing: 'ease-out-cubic',
    });
  }, []);

  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <Root />
    </ToastProvider>
  </React.StrictMode>
);
