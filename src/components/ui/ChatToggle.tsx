import React, { useEffect, useState } from 'react';
import { MessageCircle, MessageSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// A compact floating chat control with WhatsApp + Live Chat (Tawk.to)
export const ChatToggle: React.FC = () => {
  const [tawkReady, setTawkReady] = useState(false);

  // Fetch WhatsApp number (same logic as WhatsAppButton)
  const { data: whatsappNumber } = useQuery({
    queryKey: ['whatsapp-number'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('setting_value')
          .eq('setting_key', 'whatsapp_number')
          .single();
        if (error) throw error;
        return data?.setting_value as string | undefined;
      } catch (e) {
        console.error('❌ Error fetching WhatsApp number:', e);
        return '905545645337';
      }
    },
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  });

  const { data: tawkEnabled } = useQuery({
    queryKey: ['tawk-enabled'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('setting_value')
          .eq('setting_key', 'tawk_enabled')
          .single();
        if (error) throw error;
        return data?.setting_value === 'true';
      } catch (error) {
        return false;
      }
    },
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });

  // Detect when Tawk widget API is ready
  useEffect(() => {
    // If Tawk_API is already available
    if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') {
      try { window.Tawk_API.hideWidget?.(); } catch {}
      setTawkReady(true);
      return;
    }

    // Some versions support onLoad callback
    if (window.Tawk_API) {
      try {
        window.Tawk_API.onLoad = () => {
          try { window.Tawk_API.hideWidget?.(); } catch {}
          setTawkReady(true);
        };
      } catch (_) {
        // ignore
      }
    }

    // Fallback: poll briefly for API readiness
    const interval = setInterval(() => {
      if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') {
        setTawkReady(true);
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleWhatsAppClick = () => {
    if (!whatsappNumber) return;
    let clean = whatsappNumber.replace(/\D/g, '');
    if (clean.startsWith('90') && clean.length === 12) {
      // Turkish
    } else if (clean.startsWith('1') && clean.length === 11) {
      // US/Canada
    } else if (clean.length === 10) {
      clean = '1' + clean;
    }
    const msg = encodeURIComponent("Hello! I'm interested in your refrigerant products. Can you help me?");
    const url = `https://wa.me/${clean}?text=${msg}`;
    try {
      new URL(url);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      const fallback = `https://web.whatsapp.com/send?phone=${clean}&text=${msg}`;
      window.open(fallback, '_blank', 'noopener,noreferrer');
    }
  };

  const handleLiveChatClick = () => {
    if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') {
      try {
        window.Tawk_API.showWidget?.();
        window.Tawk_API.maximize();
      } catch (e) {
        console.error('❌ Failed to open Tawk chat:', e);
      }
    } else {
      console.warn('Tawk chat is not ready yet.');
    }
  };

  // If neither option is available, render nothing
  if (!whatsappNumber && !tawkReady) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-3">
      {/* WhatsApp */}
      {whatsappNumber && (
        <button
          onClick={handleWhatsAppClick}
          className="rounded-full shadow-lg transition-all duration-300 p-4 hover:scale-110 border border-border bg-green-500 hover:bg-green-600 text-white"
          aria-label="Chat on WhatsApp"
          title="WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Live Chat (Tawk) - only if enabled */}
      {tawkEnabled && tawkReady && (
        <button
          onClick={handleLiveChatClick}
          className="rounded-full shadow-lg transition-all duration-300 p-4 hover:scale-110 border border-border bg-primary text-primary-foreground"
          aria-label="Live Chat"
          title="Live Chat"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};
