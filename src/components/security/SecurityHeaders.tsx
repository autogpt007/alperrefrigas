import { useEffect } from 'react';

/**
 * Component to add security meta tags
 * NOTE: CSP and X-Frame-Options are handled via HTTP headers (see .htaccess and netlify.toml)
 * Meta tags are only used for referrer policy which IS allowed via meta
 */
const SecurityHeaders = () => {
  useEffect(() => {
    // Referrer Policy - allowed via meta tag
    const referrerMeta = document.createElement('meta');
    referrerMeta.name = 'referrer';
    referrerMeta.content = 'strict-origin-when-cross-origin';
    
    // Add to head
    document.head.appendChild(referrerMeta);
    
    return () => {
      // Cleanup on unmount
      try {
        document.head.removeChild(referrerMeta);
      } catch (error) {
        console.debug('Security meta tag cleanup error:', error);
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default SecurityHeaders;