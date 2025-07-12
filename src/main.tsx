
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';

// Initialize i18n after React is set up
import('./i18n/i18n').then(() => {
  const container = document.getElementById("root");
  if (!container) {
    throw new Error("Root element not found");
  }

  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </React.StrictMode>
  );
}).catch(console.error);
