import React, { useEffect } from 'react';

interface ResourceOptimizerProps {
  children: React.ReactNode;
}

const ResourceOptimizer: React.FC<ResourceOptimizerProps> = ({ children }) => {
  useEffect(() => {
    // Preload critical resources
    const preloadResources = [
      { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2' },
      { href: '/images/hero-bg.webp', as: 'image' },
      { href: '/api/products', as: 'fetch' }
    ];

    preloadResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) link.type = resource.type;
      if (resource.as === 'font') link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Lazy load non-critical images
    const lazyImages = document.querySelectorAll('img[data-lazy]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.getAttribute('data-lazy');
          if (src) {
            img.src = src;
            img.removeAttribute('data-lazy');
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px'
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // Prefetch next page resources
    const prefetchLinks = [
      '/products',
      '/about',
      '/contact'
    ];

    const prefetchObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          prefetchLinks.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = href;
            document.head.appendChild(link);
          });
          prefetchObserver.disconnect();
        }
      });
    });

    // Start prefetching when user scrolls 50% down the page
    const triggerElement = document.createElement('div');
    triggerElement.style.position = 'absolute';
    triggerElement.style.top = '50%';
    triggerElement.style.height = '1px';
    triggerElement.style.width = '1px';
    triggerElement.style.opacity = '0';
    document.body.appendChild(triggerElement);
    prefetchObserver.observe(triggerElement);

    // Optimize third-party scripts
    const optimizeThirdPartyScripts = () => {
      // Defer non-critical scripts
      const scripts = document.querySelectorAll('script[data-defer]');
      scripts.forEach(script => {
        const newScript = document.createElement('script');
        newScript.src = script.getAttribute('data-defer') || '';
        newScript.async = true;
        newScript.defer = true;
        document.head.appendChild(newScript);
      });
    };

    // Run optimization after page load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', optimizeThirdPartyScripts);
    } else {
      optimizeThirdPartyScripts();
    }

    // Cleanup
    return () => {
      imageObserver.disconnect();
      prefetchObserver.disconnect();
      document.body.removeChild(triggerElement);
    };
  }, []);

  return <>{children}</>;
};

export default ResourceOptimizer;