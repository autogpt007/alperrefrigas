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
  } | null>(null);

  useEffect(() => {
    // Fetch Tawk.to configuration from database
    const fetchTawkConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('setting_key, setting_value')
          .in('setting_key', ['tawk_property_id', 'tawk_widget_id', 'tawk_enabled']);

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
          });
        }
      } catch (error) {
        console.error('Failed to fetch Tawk.to configuration:', error);
      }
    };

    fetchTawkConfig();
  }, []);

  useEffect(() => {
    // Only load Tawk.to if enabled and configured
    if (!tawkConfig?.enabled || !tawkConfig.propertyId || !tawkConfig.widgetId) {
      return;
    }

    // Check if script is already loaded
    const existingScript = document.querySelector('script[src*="embed.tawk.to"]');
    if (existingScript || window.Tawk_API) {
      return;
    }

    // Initialize Tawk_API and Tawk_LoadStart (required by Tawk.to)
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    
    // Create and inject the Tawk.to script with dynamic IDs
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://embed.tawk.to/${tawkConfig.propertyId}/${tawkConfig.widgetId}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    
    script.onload = () => {
      console.log('✅ Tawk.to chat loaded successfully');
    };
    
    script.onerror = (error) => {
      console.error('❌ Failed to load Tawk.to script:', error);
    };
    
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const scriptToRemove = document.querySelector('script[src*="embed.tawk.to"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
      if (window.Tawk_API) {
        delete window.Tawk_API;
      }
      if (window.Tawk_LoadStart) {
        delete window.Tawk_LoadStart;
      }
    };
  }, [tawkConfig]);

  return null;
};