import React, { useEffect, useState } from 'react';
import { MessageCircle, MessageSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// A compact floating chat control with only WhatsApp
export const ChatToggle: React.FC = () => {
  // Fetch WhatsApp number
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
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });

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

  if (!whatsappNumber) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50">
      {/* WhatsApp */}
      <button
        onClick={handleWhatsAppClick}
        className="rounded-full shadow-lg transition-all duration-300 p-4 hover:scale-110 border border-border bg-green-500 hover:bg-green-600 text-white"
        aria-label="Chat on WhatsApp"
        title="WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
};
