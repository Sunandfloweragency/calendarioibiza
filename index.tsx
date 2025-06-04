import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n'; // Import i18n configuration
import './styles.css'; // Import global styles

// Configurar el preloader
document.addEventListener('DOMContentLoaded', () => {
  // Ocultar el preloader después de que todo haya cargado
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.transition = 'opacity 0.8s ease';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 800);
    }, 800);
  }
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("No se pudo encontrar el elemento raíz para montar la aplicación");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
        <App />
  </React.StrictMode>
);