import { useEffect } from 'react';

/**
 * Component to add security headers via meta tags
 * This should be included in the main App component
 */
const SecurityHeaders = () => {
  useEffect(() => {
    // Enhanced Content Security Policy
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com https://*.lovable.app https://embed.tawk.to",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.stripe.com https://*.supabase.co wss://*.supabase.co https://*.lovable.app https://embed.tawk.to wss://embed.tawk.to https://tawk.to wss://tawk.to",
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://*.lovable.app https://tawk.to https://embed.tawk.to",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self' https://*.lovable.app",
      "upgrade-insecure-requests"
    ].join('; ');
    
    // X-Frame-Options - SAMEORIGIN for Lovable compatibility
    const frameMeta = document.createElement('meta');
    frameMeta.httpEquiv = 'X-Frame-Options';
    frameMeta.content = 'SAMEORIGIN';
    
    // X-Content-Type-Options
    const contentTypeMeta = document.createElement('meta');
    contentTypeMeta.httpEquiv = 'X-Content-Type-Options';
    contentTypeMeta.content = 'nosniff';
    
    // Referrer Policy
    const referrerMeta = document.createElement('meta');
    referrerMeta.name = 'referrer';
    referrerMeta.content = 'strict-origin-when-cross-origin';
    
    // Permissions Policy
    const permissionsMeta = document.createElement('meta');
    permissionsMeta.httpEquiv = 'Permissions-Policy';
    permissionsMeta.content = 'camera=(), microphone=(), geolocation=(), payment=()';
    
    // Cross-Origin-Embedder-Policy
    const coepMeta = document.createElement('meta');
    coepMeta.httpEquiv = 'Cross-Origin-Embedder-Policy';
    coepMeta.content = 'unsafe-none';
    
    // Cross-Origin-Resource-Policy
    const corpMeta = document.createElement('meta');
    corpMeta.httpEquiv = 'Cross-Origin-Resource-Policy';
    corpMeta.content = 'cross-origin';
    
    // Add to head
    document.head.appendChild(cspMeta);
    document.head.appendChild(frameMeta);
    document.head.appendChild(contentTypeMeta);
    document.head.appendChild(referrerMeta);
    document.head.appendChild(permissionsMeta);
    document.head.appendChild(coepMeta);
    document.head.appendChild(corpMeta);
    
    return () => {
      // Cleanup on unmount
      try {
        document.head.removeChild(cspMeta);
        document.head.removeChild(frameMeta);
        document.head.removeChild(contentTypeMeta);
        document.head.removeChild(referrerMeta);
        document.head.removeChild(permissionsMeta);
        document.head.removeChild(coepMeta);
        document.head.removeChild(corpMeta);
      } catch (error) {
        // Headers may have been removed by other components
        console.debug('Security headers cleanup error:', error);
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default SecurityHeaders;