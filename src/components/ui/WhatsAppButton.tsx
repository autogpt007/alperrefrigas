import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const WhatsAppButton: React.FC = () => {
  // Use React Query for proper caching
  const { data: whatsappNumber, isLoading } = useQuery({
    queryKey: ['whatsapp-number'],
    queryFn: async () => {
      console.log('🔄 Fetching WhatsApp number from database...');
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'whatsapp_number')
        .single();

      if (error) {
        console.error('❌ Error fetching WhatsApp number:', error);
        return '905545645337'; // Use Turkish number as fallback
      }
      
      const number = data?.setting_value;
      console.log('✅ Fetched WhatsApp number from DB:', number);
      return number;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - reasonable cache time
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache longer
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on every mount after initial load
  });

  const handleWhatsAppClick = () => {
    console.log('WhatsApp button clicked, number from DB:', whatsappNumber);
    if (!whatsappNumber) return;
    
    // Validate and format phone number for WhatsApp Business API
    let cleanNumber = whatsappNumber.replace(/\D/g, '');
    console.log('Cleaned number:', cleanNumber);
    
    // Handle different country code formats
    if (cleanNumber.startsWith('90') && cleanNumber.length === 12) {
      // Turkish number starting with 90
      console.log('Detected Turkish number');
      cleanNumber = cleanNumber;
    } else if (cleanNumber.startsWith('1') && cleanNumber.length === 11) {
      // US/Canada number starting with 1
      console.log('Detected US/Canada number');
      cleanNumber = cleanNumber;
    } else if (cleanNumber.length === 10) {
      // US number without country code, add 1
      console.log('Detected US number without country code, adding 1');
      cleanNumber = '1' + cleanNumber;
    }
    
    console.log('Final cleaned number for WhatsApp:', cleanNumber);
    
    // Default message for WhatsApp
    const message = "Hello! I'm interested in your refrigerant products. Can you help me?";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    
    console.log('Generated WhatsApp URL:', whatsappUrl);
    
    // Validate the URL before opening
    try {
      new URL(whatsappUrl);
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Invalid WhatsApp URL:', whatsappUrl);
      // Fallback to standard WhatsApp web without domain validation
      const fallbackUrl = `https://web.whatsapp.com/send?phone=${cleanNumber}&text=${encodedMessage}`;
      console.log('Using fallback URL:', fallbackUrl);
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Don't render button if no phone number is available
  if (!whatsappNumber) return null;

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-24 right-6 bg-[#25D366] hover:bg-[#128C7E] text-white p-3 rounded-full shadow-lg z-40 transition-all duration-300 hover:scale-110"
      aria-label="Chat on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className="h-7 w-7"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </button>
  );
};