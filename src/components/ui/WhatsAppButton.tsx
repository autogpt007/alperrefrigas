
import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ 
  phoneNumber, 
  message = "Hello! I'm interested in your refrigerants." 
}) => {
  const handleWhatsAppClick = () => {
    // Validate and format phone number for WhatsApp Business API
    let cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // Ensure proper country code format for international numbers
    if (cleanNumber.startsWith('1') && cleanNumber.length === 11) {
      // US/Canada number starting with 1
      cleanNumber = cleanNumber;
    } else if (cleanNumber.length === 10) {
      // US number without country code, add 1
      cleanNumber = '1' + cleanNumber;
    }
    
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
