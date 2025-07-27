import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BannerMessage {
  id: string;
  text: string;
  type: 'info' | 'success' | 'warning' | 'discount';
  isActive: boolean;
  dismissible?: boolean;
}

interface RollingTextBannerProps {
  messages: BannerMessage[];
  autoRotate?: boolean;
  rotationInterval?: number;
  className?: string;
}

export const RollingTextBanner: React.FC<RollingTextBannerProps> = ({
  messages,
  autoRotate = true,
  rotationInterval = 5000,
  className = ""
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissedMessages, setDismissedMessages] = useState<Set<string>>(new Set());
  
  // Filter out dismissed messages and inactive ones
  const activeMessages = messages.filter(msg => 
    msg.isActive && !dismissedMessages.has(msg.id)
  );

  useEffect(() => {
    if (!autoRotate || activeMessages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeMessages.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [autoRotate, activeMessages.length, rotationInterval]);

  const handleDismiss = (messageId: string) => {
    setDismissedMessages(prev => new Set([...prev, messageId]));
    // Adjust current index if needed
    if (currentIndex >= activeMessages.length - 1) {
      setCurrentIndex(0);
    }
  };

  if (activeMessages.length === 0) return null;

  const currentMessage = activeMessages[currentIndex];
  
  const getBackgroundClass = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-600 to-emerald-600';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-600 to-orange-600';
      case 'discount':
        return 'bg-gradient-to-r from-purple-600 to-pink-600';
      default:
        return 'bg-gradient-to-r from-blue-600 to-cyan-600';
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div 
        className={`${getBackgroundClass(currentMessage.type)} text-white py-3 px-4 transition-all duration-500 ease-in-out`}
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex-1 text-center">
            <div className="animate-fade-in">
              <span 
                className="text-sm md:text-base font-medium"
                dangerouslySetInnerHTML={{ __html: currentMessage.text }}
              />
            </div>
          </div>
          
          {currentMessage.dismissible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDismiss(currentMessage.id)}
              className="ml-2 h-6 w-6 p-0 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Dots indicator for multiple messages */}
      {activeMessages.length > 1 && (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {activeMessages.map((_, index) => (
            <div
              key={index}
              className={`h-1 w-1 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Default messages for quick setup
export const createDiscountMessage = (text: string, dismissible = true): BannerMessage => ({
  id: `discount-${Date.now()}`,
  text,
  type: 'discount',
  isActive: true,
  dismissible
});

export const createInfoMessage = (text: string, dismissible = true): BannerMessage => ({
  id: `info-${Date.now()}`,
  text,
  type: 'info',
  isActive: true,
  dismissible
});

export const createWarningMessage = (text: string, dismissible = true): BannerMessage => ({
  id: `warning-${Date.now()}`,
  text,
  type: 'warning',
  isActive: true,
  dismissible
});