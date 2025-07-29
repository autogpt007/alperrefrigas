import React from 'react';
import { Helmet } from 'react-helmet-async';

const CriticalCSS: React.FC = () => {
  const criticalStyles = `
    /* Critical above-the-fold styles */
    body {
      margin: 0;
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.6;
    }
    
    .hero-section {
      min-height: 50vh;
      background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)));
    }
    
    .header {
      position: sticky;
      top: 0;
      z-index: 50;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
    }
    
    .navigation {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
    }
    
    .logo {
      font-weight: bold;
      font-size: 1.5rem;
    }
    
    .btn-primary {
      background: hsl(var(--primary));
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      text-decoration: none;
      transition: all 0.2s;
    }
    
    .btn-primary:hover {
      background: hsl(var(--primary-glow));
      transform: translateY(-1px);
    }
    
    /* Loading skeleton */
    .skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;

  return (
    <Helmet>
      <style type="text/css">{criticalStyles}</style>
      <link 
        rel="preload" 
        href="/src/index.css" 
        as="style" 
        onLoad={(e) => {
          const target = e.target as HTMLLinkElement;
          target.onload = null;
          target.rel = 'stylesheet';
        }}
      />
      <noscript>
        {`<link rel="stylesheet" href="/src/index.css" />`}
      </noscript>
    </Helmet>
  );
};

export default CriticalCSS;