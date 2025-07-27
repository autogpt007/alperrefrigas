import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface Advert {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'success' | 'warning' | 'discount' | 'emergency';
  is_active: boolean;
  dismissible: boolean;
  start_date: string | null;
  end_date: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export const useAdverts = () => {
  const queryKey = ['adverts'];
  
  const { data: adverts = [], isLoading: loading, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      console.log('Fetching adverts...');
      const { data, error } = await supabase
        .from('adverts')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching adverts:', error);
        throw error;
      }
      console.log('Fetched adverts:', data);
      return data || [];
    },
    staleTime: 0, // Always refetch to get latest data
    gcTime: 0, // Don't cache the data
    refetchOnWindowFocus: true, // Refetch when user comes back to the page
    refetchOnMount: true, // Always refetch when component mounts
  });

  const getActiveAdverts = () => {
    const now = new Date().toISOString();
    return adverts.filter(advert => {
      const isWithinTimeframe = (!advert.start_date || advert.start_date <= now) &&
                               (!advert.end_date || advert.end_date >= now);
      return advert.is_active && isWithinTimeframe;
    });
  };

  return {
    adverts,
    loading,
    getActiveAdverts,
    refetch
  };
};