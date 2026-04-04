import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface QuoteItem {
  id?: string;
  product_id?: string;
  product_name: string;
  quantity: number;
  packaging?: string;
}

export interface Quote {
  id: string;
  quote_number: string;
  user_id: string;
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
  createQuote: (quoteData: Omit<Quote, 'id' | 'quote_number' | 'created_at' | 'updated_at'>) => Promise<Quote | null>;
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

  const createQuote = async (quoteData: Omit<Quote, 'id' | 'quote_number' | 'created_at' | 'updated_at'>): Promise<Quote | null> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a quote request",
        variant: "destructive"
      });
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Create the quote
      const { data: newQuote, error: quoteError } = await supabase
        .from('quotes')
        .insert({
          user_id: user.id,
          customer_name: quoteData.customer_name,
          customer_email: quoteData.customer_email,
          company_name: quoteData.company_name,
          phone: quoteData.phone,
          shipping_address: quoteData.shipping_address,
          status: quoteData.status,
          notes: quoteData.notes
        })
        .select()
        .single();

      if (quoteError) throw quoteError;

      // Create quote items
      if (quoteData.items && quoteData.items.length > 0) {
        const quoteItems = quoteData.items.map(item => ({
          quote_id: newQuote.id,
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          packaging: item.packaging
        }));

        const { error: itemsError } = await supabase
          .from('quote_items')
          .insert(quoteItems);

        if (itemsError) throw itemsError;
      }

      // Fetch the complete quote with items
      const { data: completeQuote, error: fetchError } = await supabase
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
        .eq('id', newQuote.id)
        .single();

      if (fetchError) throw fetchError;

      const formattedQuote: Quote = {
        ...completeQuote,
        status: completeQuote.status as Quote['status'],
        items: completeQuote.quote_items || []
      };

      setQuotes(prev => [formattedQuote, ...prev]);

      // Send quote confirmation email to customer
      try {
        await supabase.functions.invoke('send-customer-email', {
          body: {
            type: 'quote-confirmation',
            to: formattedQuote.customer_email,
            data: {
              customerName: formattedQuote.customer_name,
              quoteNumber: formattedQuote.quote_number,
            },
          },
        });
      } catch (emailErr) {
        console.error('Quote confirmation email failed:', emailErr);
      }

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