import React, { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

// Default Tawk.to snippet supplied by the business owner.
// Stored here as a fallback so the widget works even before the admin DB row is set.
const DEFAULT_SNIPPET = `<!--Start of Tawk.to Script-->
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/6a98061a25a20d3445a5b8c8/1k1gtfmct';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
</script>
<!--End of Tawk.to Script-->`;

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
    enabled: (map['tawk_enabled'] ?? 'true') === 'true',
    snippet: map['tawk_snippet'] ?? DEFAULT_SNIPPET,
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

    // Remove injected positioning stylesheet
    const styleEl = document.getElementById('tawk-position-override');
    if (styleEl?.parentNode) styleEl.parentNode.removeChild(styleEl);

    // Reset API
    if (window.Tawk_API) delete window.Tawk_API;
    if (window.Tawk_LoadStart) delete window.Tawk_LoadStart;

    setReady(false);
    currentSrc.current = null;
  }, []);

  const injectPositionStyles = useCallback(() => {
    if (document.getElementById('tawk-position-override')) return;

    const style = document.createElement('style');
    style.id = 'tawk-position-override';
    style.textContent = `
      /* Move Tawk.to bubble to bottom-left so it never covers the WhatsApp
         button or right-aligned action buttons. */
      .tawk-min-container,
      .tawk-chat-widget,
      iframe[data-name="tawkChatIframe"],
      #tawk-bubble-container,
      #tawk-chat-widget-container,
      div[class*="tawk"][style*="position: fixed"] {
        right: auto !important;
        left: 16px !important;
      }

      @media (max-width: 640px) {
        .tawk-min-container,
        .tawk-chat-widget,
        iframe[data-name="tawkChatIframe"],
        #tawk-bubble-container,
        #tawk-chat-widget-container,
        div[class*="tawk"][style*="position: fixed"] {
          left: 8px !important;
          bottom: 8px !important;
        }
      }
    `;
    document.head.appendChild(style);
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

      // Inject positioning styles early so the Tawk.to iframe is placed
      // on the bottom-left as soon as it renders, avoiding the WhatsApp button.
      injectPositionStyles();

      // Initialize globals - Let Tawk.to widget show by default
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();
      window.Tawk_API.onLoad = () => {
        console.log('✅ Tawk.to API loaded successfully');
        injectPositionStyles();
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
  }, [cleanup, injectPositionStyles]);

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