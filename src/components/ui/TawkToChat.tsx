import React, { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

const extractIdsFromSnippet = (snippet: string) => {
  const m = snippet.match(/embed\.tawk\.to\/([^/'"]+)\/([^'"]+)/i);
  return { propertyId: m?.[1] ?? '', widgetId: m?.[2] ?? '' };
};

const fetchSettings = async () => {
  const keys = ['tawk_enabled', 'tawk_snippet', 'tawk_property_id', 'tawk_widget_id'];
  const { data, error } = await supabase
    .from('site_settings')
    .select('setting_key, setting_value')
    .in('setting_key', keys);
  
  if (error) throw new Error(error.message);
  
  const map: Record<string, string> = {};
  data?.forEach((r: any) => (map[r.setting_key] = r.setting_value));
  
  return {
    enabled: (map['tawk_enabled'] ?? 'false') === 'true',
    snippet: map['tawk_snippet'] ?? '',
    pid: map['tawk_property_id'] ?? '',
    wid: map['tawk_widget_id'] ?? ''
  };
};

export const TawkToChat: React.FC = () => {
  const [ready, setReady] = useState(false);
  const currentSrc = useRef<string | null>(null);
  const scriptId = 'tawk-script';

  const cleanup = useCallback(() => {
    // Remove script
    const el = document.getElementById(scriptId);
    if (el?.parentNode) el.parentNode.removeChild(el);

    // Remove iframe container if Tawk created any
    const frames = document.querySelectorAll('iframe[src*="tawk.to"], iframe[data-name="tawkChatIframe"]');
    frames.forEach((f) => f.parentNode?.removeChild(f));

    // Reset API
    if (window.Tawk_API) delete window.Tawk_API;
    if (window.Tawk_LoadStart) delete window.Tawk_LoadStart;

    setReady(false);
    currentSrc.current = null;
  }, []);

  const load = useCallback(async () => {
    try {
      const { enabled, snippet, pid, wid } = await fetchSettings();
      
      if (!enabled) {
        console.log('Tawk.to disabled, cleaning up');
        cleanup();
        return;
      }

      let propertyId = pid;
      let widgetId = wid;
      
      // Extract from snippet if available
      if (snippet) {
        const { propertyId: p, widgetId: w } = extractIdsFromSnippet(snippet);
        if (p) propertyId = p;
        if (w) widgetId = w;
      }

      if (!propertyId || !widgetId) {
        console.warn('Tawk.to: missing property/widget IDs');
        cleanup();
        return;
      }

      const src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
      
      // If already loaded with same src, skip
      if (currentSrc.current === src && document.getElementById(scriptId)) {
        console.log('Tawk.to already loaded with same config');
        return;
      }

      // Clean up old instance
      cleanup();

      console.log('Loading Tawk.to with IDs:', { propertyId, widgetId });

      // Initialize globals - Let Tawk.to widget show by default
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();
      window.Tawk_API.onLoad = () => {
        console.log('✅ Tawk.to API loaded successfully');
        setReady(true);
        window.dispatchEvent(new CustomEvent('tawk-ready'));
      };

      // Inject script
      const s1 = document.createElement('script');
      s1.id = scriptId;
      s1.async = true;
      s1.src = src;
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s1.onload = () => console.log('✅ Tawk.to script loaded');
      s1.onerror = (error) => console.error('❌ Failed to load Tawk.to script:', error);

      const s0 = document.getElementsByTagName('script')[0];
      s0.parentNode?.insertBefore(s1, s0);
      currentSrc.current = src;
      
      console.log('Tawk.to script injected:', src);
    } catch (error) {
      console.error('Error loading Tawk.to:', error);
    }
  }, [cleanup]);

  useEffect(() => {
    load();
    
    const handler = () => {
      console.log('Site settings updated, reloading Tawk.to');
      load();
    };
    
    window.addEventListener('site-settings-updated', handler);
    
    return () => {
      window.removeEventListener('site-settings-updated', handler);
      cleanup();
    };
  }, [load, cleanup]);

  return null;
};