import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import { quoteRequestSchema } from '@/lib/quoteRequest';

export interface QuoteItem {
  id?: string;
  product_id?: string | null;
  product_name: string;
  quantity: number;
  packaging?: string;
}

export interface Quote {
  id: string;
  quote_number: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  company_name?: string;
  phone?: string;
  shipping_address?: string;
  status: 'pending' | 'reviewed' | 'quoted' | 'accepted' | 'declined';
  notes?: string;
  created_at: string;
  updated_at: string;
  items: QuoteItem[];
}

interface QuotesContextType {
  quotes: Quote[];
  loading: boolean;
  error: string | null;
  fetchQuotes: () => Promise<void>;
  createQuote: (quoteData: Omit<Quote, 'id' | 'quote_number' | 'created_at' | 'updated_at'>, protection?: { formToken: string; website: string }) => Promise<Quote | null>;
}

const QuotesContext = createContext<QuotesContextType | undefined>(undefined);

export const QuotesProvider = ({ children }: { children: ReactNode }) => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchQuotes = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data: quotesData, error: quotesError } = await supabase
        .from('quotes')
        .select(`
          *,
          quote_items (
            id,
            product_id,
            product_name,
            quantity,
            packaging
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (quotesError) throw quotesError;

      const formattedQuotes: Quote[] = quotesData?.map(quote => ({
        ...quote,
        status: quote.status as Quote['status'],
        items: quote.quote_items || []
      })) || [];

      setQuotes(formattedQuotes);
    } catch (err: any) {
      console.error('Error fetching quotes:', err);
      setError(err.message);
      toast({
        title: "Error fetching quotes",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createQuote = async (quoteData: Omit<Quote, 'id' | 'quote_number' | 'created_at' | 'updated_at'>, protection?: { formToken: string; website: string }): Promise<Quote | null> => {
    setLoading(true);
    setError(null);

    try {
      const payload = quoteRequestSchema.parse(quoteData);
      if (!protection?.formToken) throw new Error('Please reopen the quote form and try again.');
      const { data: result, error: submitError } = await supabase.functions.invoke('submit-quote', { body: { ...payload, ...protection } });
      if (submitError || !result?.success) throw new Error(result?.error || 'Unable to submit your request. Please try again.');
      const formattedQuote: Quote = {
        ...quoteData, user_id: user?.id ?? null, id: result.id, quote_number: result.quote_number,
        created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      };

      setQuotes(prev => [formattedQuote, ...prev]);

      if (!result.notificationsQueued) toast({ title: 'Quote saved', description: 'Email delivery is delayed. Your request is available to our sales team.' });

      toast({
        title: "Quote request submitted!",
        description: `Quote ${formattedQuote.quote_number} has been created.`
      });

      return formattedQuote;
    } catch (err: any) {
      console.error('Error creating quote:', err);
      setError(err.message);
      toast({
        title: "Error creating quote",
        description: err.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchQuotes();
    } else {
      setQuotes([]);
    }
  }, [user]);

  return (
    <QuotesContext.Provider value={{
      quotes,
      loading,
      error,
      fetchQuotes,
      createQuote
    }}>
      {children}
    </QuotesContext.Provider>
  );
};

export const useQuotes = () => {
  const context = useContext(QuotesContext);
  if (context === undefined) {
    throw new Error('useQuotes must be used within a QuotesProvider');
  }
  return context;
};