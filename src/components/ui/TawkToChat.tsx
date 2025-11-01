import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

export const TawkToChat: React.FC = () => {
  const [tawkConfig, setTawkConfig] = useState<{
    propertyId: string;
    widgetId: string;
    enabled: boolean;
    snippet?: string;
  } | null>(null);

  useEffect(() => {
    // Fetch Tawk.to configuration from database
    const fetchTawkConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('setting_key, setting_value')
          .in('setting_key', ['tawk_property_id', 'tawk_widget_id', 'tawk_enabled', 'tawk_snippet']);

        if (error) throw error;

        const config = data?.reduce((acc, { setting_key, setting_value }) => {
          acc[setting_key] = setting_value;
          return acc;
        }, {} as Record<string, string>);

        if (config) {
          setTawkConfig({
            propertyId: config.tawk_property_id || '',
            widgetId: config.tawk_widget_id || '',
            enabled: config.tawk_enabled === 'true',
            snippet: config.tawk_snippet || ''
          });
        }
      } catch (error) {
        console.error('Failed to fetch Tawk.to configuration:', error);
      }
    };

    fetchTawkConfig();

    // Listen for admin settings updates and refetch
    const onSettingsUpdated = () => fetchTawkConfig();
    window.addEventListener('site-settings-updated', onSettingsUpdated);

    return () => {
      window.removeEventListener('site-settings-updated', onSettingsUpdated);
    };
  }, []);

  useEffect(() => {
    if (!tawkConfig) {
      return;
    }

    // Initialize required globals
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const extractIdsFromSnippet = (snippet: string): { propertyId?: string; widgetId?: string } => {
      const match = snippet.match(/embed\.tawk\.to\/([^/'"]+)\/([^/'"]+)/i);
      if (match) {
        return { propertyId: match[1], widgetId: match[2] };
      }
      return {};
    };

    try {
      let propertyId = tawkConfig.propertyId;
      let widgetId = tawkConfig.widgetId;

      // If snippet is present, extract IDs from it
      if (tawkConfig.snippet) {
        const extracted = extractIdsFromSnippet(tawkConfig.snippet);
        propertyId = extracted.propertyId || propertyId;
        widgetId = extracted.widgetId || widgetId;
      }

      // If disabled, ensure widget is removed/hidden
      if (!tawkConfig.enabled) {
        const scriptToRemove = document.querySelector('script[src*="embed.tawk.to"]') as HTMLScriptElement | null;
        scriptToRemove?.remove();
        try { window.Tawk_API?.hideWidget?.(); } catch {}
        return;
      }

      // Load external script if we have both IDs
      if (propertyId && widgetId) {
        const existingScript = document.querySelector('script[src*="embed.tawk.to"]') as HTMLScriptElement | null;
        if (existingScript) {
          const src = existingScript.getAttribute('src') || '';
          const match = src.match(/embed\.tawk\.to\/([^/'"]+)\/([^/'"]+)/i);
          const existingPid = match?.[1];
          const existingWid = match?.[2];
          if (existingPid !== propertyId || existingWid !== widgetId) {
            existingScript.remove();
            if (window.Tawk_API) delete window.Tawk_API;
          } else {
            // Already loaded with correct IDs
            return;
          }
        }

        const s1 = document.createElement('script');
        const s0 = document.getElementsByTagName('script')[0];
        s1.async = true;
        s1.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        s1.onload = () => console.log('✅ Tawk.to chat loaded successfully');
        s1.onerror = (error) => console.error('❌ Failed to load Tawk.to script:', error);
        s0.parentNode?.insertBefore(s1, s0);
      }
    } catch (e) {
      console.error('❌ Error loading Tawk.to:', e);
    }

    return () => {
      const scriptToRemove = document.querySelector('script[src*="embed.tawk.to"]');
      if (scriptToRemove) (scriptToRemove as HTMLElement).remove();
      if (window.Tawk_API) delete window.Tawk_API;
      if (window.Tawk_LoadStart) delete window.Tawk_LoadStart;
    };
  }, [tawkConfig]);

  // React to enable/disable: show/hide widget once API is ready
  useEffect(() => {
    if (tawkConfig == null) return;

    let tries = 0;
    const maxTries = 20; // ~10s
    const interval = setInterval(() => {
      if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') {
        try {
          if (tawkConfig.enabled) {
            window.Tawk_API.showWidget?.();
          } else {
            window.Tawk_API.hideWidget?.();
          }
        } catch {}
        clearInterval(interval);
      } else if (++tries >= maxTries) {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [tawkConfig]);

  return null;
};