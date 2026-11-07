import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './sheet';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { useQuotes, QuoteItem } from '@/contexts/QuotesContext';
import { supabase } from '@/integrations/supabase/client';
import { useShippingCountry } from '@/contexts/ShippingCountryContext';

export default function ProductQuoteSheet({ open, onOpenChange, item }: { open: boolean; onOpenChange: (open: boolean) => void; item: QuoteItem }) {
  const { createQuote, loading, error } = useQuotes();
  const { countryCode } = useShippingCountry();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [fields, setFields] = useState({ name: '', company: '', email: '', phone: '', postal: '', country: countryCode, notes: '', website: '' });
  useEffect(() => {
    if (!open) return;
    setToken('');
    supabase.functions.invoke('submit-quote', { body: { action: 'challenge' } }).then(({ data }) => setToken(data?.formToken || ''));
  }, [open]);
  const change = (key: keyof typeof fields, value: string) => setFields(prev => ({ ...prev, [key]: value }));
  return <Sheet open={open} onOpenChange={onOpenChange}><SheetContent className="w-full sm:max-w-lg overflow-y-auto">
    <SheetHeader><SheetTitle>Request a quote</SheetTitle><SheetDescription>{item.product_name} · {item.packaging} · Quantity: {item.quantity}</SheetDescription></SheetHeader>
    <form className="mt-6 space-y-4" onSubmit={async e => {
      e.preventDefault();
      const quote = await createQuote({ user_id: null, customer_name: fields.name, company_name: fields.company, customer_email: fields.email, phone: fields.phone, shipping_address: `${fields.postal}, ${fields.country}`, notes: fields.notes, status: 'pending', items: [item] }, { formToken: token, website: fields.website });
      if (quote) { onOpenChange(false); navigate(`/quote-confirmation?quoteNumber=${encodeURIComponent(quote.quote_number)}&type=quote`); }
    }}>
      <div className="hidden" aria-hidden="true"><Input tabIndex={-1} autoComplete="off" value={fields.website} onChange={e => change('website', e.target.value)} /></div>
      {(['name', 'company', 'email', 'phone', 'postal', 'country'] as const).map(key => <div key={key}>
        <Label htmlFor={`quote-${key}`}>{({ name: 'Contact name *', company: 'Company *', email: 'Email *', phone: 'Phone', postal: 'Delivery ZIP / postal code *', country: 'Delivery country *' })[key]}</Label>
        <Input id={`quote-${key}`} type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'} required={key !== 'phone'} maxLength={key === 'email' ? 255 : key === 'company' ? 200 : 100} value={fields[key]} onChange={e => change(key, e.target.value)} />
      </div>)}
      <div><Label htmlFor="quote-notes">Application or requirements</Label><Textarea id="quote-notes" maxLength={2000} value={fields.notes} onChange={e => change('notes', e.target.value)} /></div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading || !token}>{loading ? 'Sending…' : 'Send quote request'}</Button>
      <p className="text-xs text-muted-foreground">No account required. Orders ship after payment confirmation.</p>
    </form>
  </SheetContent></Sheet>;
}