import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const WhatsAppButton: React.FC = () => {
  // Fetch WhatsApp number from database with no cache
  const { data: whatsappNumber } = useQuery({
    queryKey: ['whatsapp-number'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'whatsapp_number')
        .single();

      if (error) throw error;
      return data?.setting_value || '18007347443'; // fallback number
    },
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache (formerly cacheTime)
  });

  const handleWhatsAppClick = () => {
    if (!whatsappNumber) return;
    
    // Validate and format phone number for WhatsApp Business API
    let cleanNumber = whatsappNumber.replace(/\D/g, '');
    
    // Handle different country code formats
    if (cleanNumber.startsWith('90') && cleanNumber.length === 12) {
      // Turkish number starting with 90
      cleanNumber = cleanNumber;
    } else if (cleanNumber.startsWith('1') && cleanNumber.length === 11) {
      // US/Canada number starting with 1
      cleanNumber = cleanNumber;
    } else if (cleanNumber.length === 10) {
      // US number without country code, add 1
      cleanNumber = '1' + cleanNumber;
    }
    
    // Default message for WhatsApp
    const message = "Hello! I'm interested in your refrigerant products. Can you help me?";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    
    // Validate the URL before opening
    try {
      new URL(whatsappUrl);
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Invalid WhatsApp URL:', whatsappUrl);
      // Fallback to standard WhatsApp web without domain validation
      window.open(`https://web.whatsapp.com/send?phone=${cleanNumber}&text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
    }
  };

  // Don't render button if no phone number is available
  if (!whatsappNumber) return null;

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-50 transition-all duration-300 hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </button>
  );
};