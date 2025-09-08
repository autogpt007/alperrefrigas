import { useEffect } from 'react';

/**
 * Component to add security headers via meta tags
 * This should be included in the main App component
 */
const SecurityHeaders = () => {
  useEffect(() => {
    // Add Content Security Policy meta tag
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com https://*.lovable.app",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.stripe.com https://*.supabase.co wss://*.supabase.co https://*.lovable.app",
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://*.lovable.app",
      "object-src 'none'",
      "base-uri 'self'"
    ].join('; ');
    
    // Add X-Frame-Options - SAMEORIGIN for Lovable compatibility
    const frameMeta = document.createElement('meta');
    frameMeta.httpEquiv = 'X-Frame-Options';
    frameMeta.content = 'SAMEORIGIN';
    
    // Add X-Content-Type-Options
    const contentTypeMeta = document.createElement('meta');
    contentTypeMeta.httpEquiv = 'X-Content-Type-Options';
    contentTypeMeta.content = 'nosniff';
    
    // Add Referrer Policy
    const referrerMeta = document.createElement('meta');
    referrerMeta.name = 'referrer';
    referrerMeta.content = 'strict-origin-when-cross-origin';
    
    // Add to head
    document.head.appendChild(cspMeta);
    document.head.appendChild(frameMeta);
    document.head.appendChild(contentTypeMeta);
    document.head.appendChild(referrerMeta);
    
    return () => {
      // Cleanup on unmount
      document.head.removeChild(cspMeta);
      document.head.removeChild(frameMeta);
      document.head.removeChild(contentTypeMeta);
      document.head.removeChild(referrerMeta);
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default SecurityHeaders;