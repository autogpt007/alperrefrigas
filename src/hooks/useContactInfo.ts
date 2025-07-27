import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface ContactInfo {
  id: string;
  category: string;
  contact_type: string;
  label: string;
  value: string;
  description: string | null;
  is_active: boolean;
  order_index: number;
}

export const useContactInfo = (category?: string) => {
  const queryKey = ['contact_info', category];
  
  const { data: contactInfo = [], isLoading: loading, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      console.log('Fetching contact info for category:', category);
      let query = supabase
        .from('contact_info')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching contact info:', error);
        throw error;
      }
      console.log('Fetched contact info:', data);
      return data || [];
    },
    staleTime: 0, // Always refetch to get latest data
    gcTime: 0, // Don't cache the data (previously cacheTime)
    refetchOnWindowFocus: true, // Refetch when user comes back to the page
    refetchOnMount: true, // Always refetch when component mounts
  });

  const getContactByType = (type: string) => {
    return contactInfo.filter(item => item.contact_type === type);
  };

  const getContactByCategory = (cat: string) => {
    return contactInfo.filter(item => item.category === cat);
  };

  const getEmergencyContacts = () => {
    return contactInfo.filter(item => item.category === 'emergency');
  };

  const getPhoneContacts = () => {
    return contactInfo.filter(item => item.contact_type === 'phone');
  };

  const getEmailContacts = () => {
    return contactInfo.filter(item => item.contact_type === 'email');
  };

  return {
    contactInfo,
    loading,
    getContactByType,
    getContactByCategory,
    getEmergencyContacts,
    getPhoneContacts,
    getEmailContacts,
    refetch
  };
};