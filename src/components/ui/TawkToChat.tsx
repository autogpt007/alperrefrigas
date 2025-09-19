import React, { useEffect } from 'react';

declare global {
  interface Window {
    Tawk_API?: any;
  }
}

export const TawkToChat: React.FC = () => {
  useEffect(() => {
    // Only load if script hasn't been loaded already
    if (window.Tawk_API) {
      return;
    }

    // Initialize Tawk_API
    window.Tawk_API = window.Tawk_API || {};
    
    // Create and inject the Tawk.to script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://embed.tawk.to/68cdc5888fb9c3192a667d13/1j5hsn7sj';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    
    // Insert script into head
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    }

    // Cleanup function
    return () => {
      // Remove script if component unmounts
      const existingScript = document.querySelector('script[src*="embed.tawk.to"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  // This component doesn't render anything visible - Tawk.to handles its own UI
  // The chat widget will appear automatically once the script loads
  return null;
};