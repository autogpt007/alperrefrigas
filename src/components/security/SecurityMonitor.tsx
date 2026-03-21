import { useEffect } from 'react';

/**
 * Security Monitor Component
 * Monitors for common security threats and unusual behavior
 * Runs only in production and with graceful error handling
 */
export const SecurityMonitor = () => {
  useEffect(() => {
    // Only run security monitoring in production, not in preview/development
    const hostname = window.location.hostname;
    const isPreviewOrDev =
      hostname.includes('lovableproject.com') ||
      hostname.includes('lovable.app') ||
      hostname === 'localhost' ||
      hostname.includes('webcontainer');
    
    if (isPreviewOrDev) {
      console.log('[Security] Skipping security monitoring in preview/dev environment');
      return;
    }

    try {
      // Monitor for XSS attempts in URL
      const checkURLForXSS = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const suspiciousPatterns = [
          /<script/i,
          /javascript:/i,
          /onerror=/i,
          /onclick=/i,
          /eval\(/i
        ];

        urlParams.forEach((value, key) => {
          suspiciousPatterns.forEach(pattern => {
            if (pattern.test(value)) {
              console.warn('[Security] Suspicious URL parameter detected:', key);
              urlParams.delete(key);
              const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
              window.history.replaceState({}, '', newUrl);
            }
          });
        });
      };

      checkURLForXSS();
    } catch (e) {
      console.log('[Security] Error in security monitoring:', e);
    }

    return () => {};
  }, []);

  return null;
};

export default SecurityMonitor;
