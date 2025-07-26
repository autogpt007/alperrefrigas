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
      color: 'hover:text-blue-600'
    },
    {
      key: 'twitter_url',
      icon: Twitter,
      label: 'Twitter',
      color: 'hover:text-sky-500'
    },
    {
      key: 'instagram_url',
      icon: Instagram,
      label: 'Instagram',
      color: 'hover:text-pink-600'
    },
    {
      key: 'linkedin_url',
      icon: Linkedin,
      label: 'LinkedIn',
      color: 'hover:text-blue-700'
    },
    {
      key: 'youtube_url',
      icon: Youtube,
      label: 'YouTube',
      color: 'hover:text-red-600'
    }
  ];

  const contactLinks = [
    {
      key: 'social_media_email',
      icon: Mail,
      label: 'Email',
      color: 'hover:text-gray-600',
      prefix: 'mailto:'
    },
    {
      key: 'social_media_phone',
      icon: Phone,
      label: 'Phone',
      color: 'hover:text-green-600',
      prefix: 'tel:'
    }
  ];

  if (!socialSettings) return null;

  const allLinks = [...socialLinks, ...contactLinks].filter(
    link => socialSettings[link.key] && socialSettings[link.key].trim()
  );

  if (allLinks.length === 0) return null;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {allLinks.map((link) => {
        const { key, icon: Icon, label, color } = link;
        const prefix = 'prefix' in link ? link.prefix : '';
        const url = socialSettings[key];
        const href = prefix ? `${prefix}${url}` : url;
        
        return (
          <Button
            key={key}
            variant="ghost"
            size="sm"
            className={`p-2 text-muted-foreground transition-colors ${color}`}
            asChild
          >
            <a
              href={href}
              target={prefix ? '_self' : '_blank'}
              rel={prefix ? undefined : 'noopener noreferrer'}
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