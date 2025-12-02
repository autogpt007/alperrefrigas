import { useEffect } from 'react';

/**
 * Security Monitor Component
 * Monitors for common security threats and unusual behavior
 */
export const SecurityMonitor = () => {
  useEffect(() => {
    // Monitor for malicious redirects
    const preventMaliciousRedirects = (event: BeforeUnloadEvent) => {
      const currentUrl = window.location.href;
      const allowedDomains = [
        window.location.hostname,
        'lovable.app',
        'supabase.co',
        'tawk.to',
        'facebook.com',
        'google.com',
        'cookiebot.com'
      ];
      
      // Log any suspicious redirect attempts
      if (document.referrer && !allowedDomains.some(domain => document.referrer.includes(domain))) {
        console.warn('[Security] Suspicious referrer detected:', document.referrer);
      }
    };

    // Detect suspicious DOM modifications
    const observeDOMChanges = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === 'SCRIPT') {
            const scriptElement = node as HTMLScriptElement;
            const allowedScripts = [
              'consent.cookiebot.com',
              'connect.facebook.net',
              'www.googletagmanager.com',
              'cdn.tiny.cloud',
              'embed.tawk.to',
              'supabase.co'
            ];
            
            // Check if script is from allowed source
            if (scriptElement.src && !allowedScripts.some(allowed => scriptElement.src.includes(allowed))) {
              console.error('[Security] Unauthorized script detected:', scriptElement.src);
              scriptElement.remove();
            }
          }
          
          // Detect suspicious iframes
          if (node.nodeName === 'IFRAME') {
            const iframeElement = node as HTMLIFrameElement;
            const iframeSrc = iframeElement.src || '';
            
            // Allow blank/empty iframes (used by many legitimate scripts)
            if (!iframeSrc || iframeSrc === 'about:blank' || iframeSrc.startsWith('javascript:')) {
              return;
            }
            
            const allowedIframes = [
              'embed.tawk.to',
              'tawk.to',
              'googletagmanager.com',
              'youtube.com',
              'google.com',
              'stripe.com',
              window.location.hostname
            ];
            
            if (!allowedIframes.some(allowed => iframeSrc.includes(allowed))) {
              console.error('[Security] Unauthorized iframe detected:', iframeSrc);
              iframeElement.remove();
            }
          }
        });
      });
    });

    // Start monitoring
    observeDOMChanges.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Prevent clickjacking (only in production, not in preview/iframe environments)
    if (window.top !== window.self) {
      try {
        // Only attempt to break out of frame if we have permission
        // This will fail in Lovable preview (intended behavior)
        if (window.top.location.hostname !== window.self.location.hostname) {
          window.top.location.href = window.self.location.href;
        }
      } catch (e) {
        // Silently fail in preview environments - this is expected
        console.log('[Security] Running in iframe environment (preview mode)');
      }
    }

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
            console.error('[Security] XSS attempt detected in URL parameter:', key, value);
            // Clear suspicious parameter
            urlParams.delete(key);
            const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
            window.history.replaceState({}, '', newUrl);
          }
        });
      });
    };

    checkURLForXSS();
    window.addEventListener('beforeunload', preventMaliciousRedirects);

    return () => {
      observeDOMChanges.disconnect();
      window.removeEventListener('beforeunload', preventMaliciousRedirects);
    };
  }, []);

  return null; // This is a monitoring component, no UI
};

export default SecurityMonitor;
