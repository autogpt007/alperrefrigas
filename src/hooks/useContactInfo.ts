import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactInfo();
  }, [category]);

  const fetchContactInfo = async () => {
    try {
      let query = supabase
        .from('contact_info')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;
      setContactInfo(data || []);
    } catch (error) {
      console.error('Error fetching contact info:', error);
    } finally {
      setLoading(false);
    }
  };

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
    refetch: fetchContactInfo
  };
};