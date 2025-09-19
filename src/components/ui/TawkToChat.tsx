import React, { useEffect } from 'react';

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

export const TawkToChat: React.FC = () => {
  useEffect(() => {
    console.log('🔄 TawkToChat component mounted, checking if script already loaded...');
    
    // Check if script is already loaded
    const existingScript = document.querySelector('script[src*="embed.tawk.to"]');
    if (existingScript || window.Tawk_API) {
      console.log('✅ Tawk.to script already loaded');
      return;
    }

    console.log('🚀 Loading Tawk.to script...');

    // Initialize Tawk_API and Tawk_LoadStart (required by Tawk.to)
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    
    // Create and inject the Tawk.to script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://embed.tawk.to/68cdc5888fb9c3192a667d13/1j5hsn7sj';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    
    // Add load event listener
    script.onload = () => {
      console.log('✅ Tawk.to script loaded successfully');
    };
    
    script.onerror = (error) => {
      console.error('❌ Failed to load Tawk.to script:', error);
    };
    
    // Insert script into head (more reliable than using first script)
    document.head.appendChild(script);
    
    console.log('📝 Tawk.to script added to document head');

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up Tawk.to script...');
      const scriptToRemove = document.querySelector('script[src*="embed.tawk.to"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
      // Reset globals
      if (window.Tawk_API) {
        delete window.Tawk_API;
      }
      if (window.Tawk_LoadStart) {
        delete window.Tawk_LoadStart;
      }
    };
  }, []);

  return null;
};