import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SocialMediaLinks: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { data: socialSettings } = useQuery({
    queryKey: ['social-media-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')
        .in('setting_key', [
          'facebook_url',
          'twitter_url', 
          'instagram_url',
          'linkedin_url',
          'youtube_url',
          'social_media_email',
          'social_media_phone'
        ]);

      if (error) throw error;

      const settingsMap = data?.reduce((acc, item) => {
        acc[item.setting_key] = item.setting_value;
        return acc;
      }, {} as Record<string, string>) || {};

      return settingsMap;
    },
  });

  const socialLinks = [
    {
      key: 'facebook_url',
      icon: Facebook,
      label: 'Facebook',
      color: 'text-blue-600 hover:text-blue-700'
    },
    {
      key: 'twitter_url',
      icon: Twitter,
      label: 'Twitter',
      color: 'text-sky-500 hover:text-sky-600'
    },
    {
      key: 'instagram_url',
      icon: Instagram,
      label: 'Instagram',
      color: 'text-pink-500 hover:text-pink-600'
    },
    {
      key: 'linkedin_url',
      icon: Linkedin,
      label: 'LinkedIn',
      color: 'text-blue-700 hover:text-blue-800'
    },
    {
      key: 'youtube_url',
      icon: Youtube,
      label: 'YouTube',
      color: 'text-red-600 hover:text-red-700'
    }
  ];

  const contactLinks = [
    {
      key: 'social_media_email',
      icon: Mail,
      label: 'Email',
      color: 'text-gray-400 hover:text-gray-300',
      prefix: 'mailto:'
    },
    {
      key: 'social_media_phone',
      icon: Phone,
      label: 'Phone',
      color: 'text-green-500 hover:text-green-400',
      prefix: 'tel:'
    }
  ];

  // Fallback social media links if no database settings
  const fallbackLinks = [
    {
      url: 'https://facebook.com/alperrefrigerants',
      icon: Facebook,
      label: 'Facebook',
      color: 'text-blue-600 hover:text-blue-700'
    },
    {
      url: 'https://twitter.com/alperrefrigas',
      icon: Twitter,
      label: 'Twitter',
      color: 'text-sky-500 hover:text-sky-600'
    },
    {
      url: 'https://instagram.com/alperrefrigerants',
      icon: Instagram,
      label: 'Instagram',
      color: 'text-pink-500 hover:text-pink-600'
    },
    {
      url: 'https://linkedin.com/company/alper-refrigerants',
      icon: Linkedin,
      label: 'LinkedIn',
      color: 'text-blue-700 hover:text-blue-800'
    },
    {
      url: 'https://youtube.com/@alperrefrigerants',
      icon: Youtube,
      label: 'YouTube',
      color: 'text-red-600 hover:text-red-700'
    }
  ];

  // Use database settings if available, otherwise use fallback
  let linksToShow;
  if (socialSettings) {
    const dbLinks = [...socialLinks, ...contactLinks].filter(
      link => socialSettings[link.key] && socialSettings[link.key].trim()
    );
    linksToShow = dbLinks.length > 0 ? dbLinks.map(link => ({
      ...link,
      url: ('prefix' in link ? link.prefix : '') + socialSettings[link.key]
    })) : fallbackLinks;
  } else {
    linksToShow = fallbackLinks;
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {linksToShow.map((link, index) => {
        const { icon: Icon, label, color, url } = link;
        const key = 'key' in link ? link.key : `fallback-${index}`;
        
        return (
          <Button
            key={key}
            variant="ghost"
            size="sm"
            className={`p-2 transition-colors ${color} hover:bg-white/10`}
            asChild
          >
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
            >
              <Icon className="h-4 w-4" />
            </a>
          </Button>
        );
      })}
    </div>
  );
};

export default SocialMediaLinks;