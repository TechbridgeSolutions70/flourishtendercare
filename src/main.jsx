import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ToastProvider } from './components/ToastProvider';
import IndependenceDayEffect from './components/IndependenceDayEffect';
import './styles.css';

function Root() {
  return (
    <>
      <IndependenceDayEffect />
      <App />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <Root />
    </ToastProvider>
  </React.StrictMode>
);
