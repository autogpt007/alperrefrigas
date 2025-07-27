import React, { useEffect } from 'react';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
  preloadFonts?: string[];
  preconnectDomains?: string[];
  criticalCSS?: string;
}

const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({
  children,
  preloadFonts = [],
  preconnectDomains = [],
  criticalCSS
}) => {
  useEffect(() => {
    // Preload critical fonts
    preloadFonts.forEach(fontUrl => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.href = fontUrl;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Preconnect to external domains
    preconnectDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
    });

    // Add critical CSS inline
    if (criticalCSS) {
      const style = document.createElement('style');
      style.textContent = criticalCSS;
      document.head.appendChild(style);
    }

    // Optimize images with intersection observer
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));

    // Cleanup
    return () => {
      imageObserver.disconnect();
    };
  }, [preloadFonts, preconnectDomains, criticalCSS]);

  return <>{children}</>;
};

export default PerformanceOptimizer;