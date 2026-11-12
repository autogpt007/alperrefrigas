import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useFavicon = () => {
  useEffect(() => {
    const updateFavicon = async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('setting_value')
          .eq('setting_key', 'favicon_url')
          .single();

        if (data?.setting_value) {
          // Remove existing favicon links
          const existingFavicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
          existingFavicons.forEach(link => link.remove());

          // Create and add new favicon link
          const link = document.createElement('link');
          link.rel = 'icon';
          link.type = 'image/png';
          link.href = data.setting_value;
          document.head.appendChild(link);
        }
      } catch (error) {
        console.error('Error updating favicon:', error);
      }
    };

    updateFavicon();
  }, []);
};