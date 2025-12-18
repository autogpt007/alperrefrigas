-- Create exchange_rates table for multi-currency support
CREATE TABLE public.exchange_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  base_currency TEXT NOT NULL DEFAULT 'USD',
  target_currency TEXT NOT NULL UNIQUE,
  rate NUMERIC NOT NULL,
  currency_symbol TEXT NOT NULL,
  currency_name TEXT NOT NULL,
  country_codes TEXT[] NOT NULL,
  flag_emoji TEXT,
  is_active BOOLEAN DEFAULT true,
  last_updated TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.exchange_rates ENABLE ROW LEVEL SECURITY;

-- Policies: Anyone can view active rates, admins can manage
CREATE POLICY "Anyone can view active exchange rates" 
ON public.exchange_rates 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage exchange rates" 
ON public.exchange_rates 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed initial currencies
INSERT INTO public.exchange_rates (target_currency, rate, currency_symbol, currency_name, country_codes, flag_emoji) VALUES
('USD', 1.00, '$', 'US Dollar', ARRAY['US'], '🇺🇸'),
('EUR', 0.92, '€', 'Euro', ARRAY['DE','FR','IT','ES','NL','BE','AT','PT','IE','FI','GR','SK','SI','LT','LV','EE','LU','MT','CY','HR','BG','RO','PL','CZ','HU','SE','DK'], '🇪🇺'),
('GBP', 0.79, '£', 'British Pound', ARRAY['GB'], '🇬🇧'),
('AUD', 1.57, 'A$', 'Australian Dollar', ARRAY['AU'], '🇦🇺'),
('CAD', 1.44, 'CA$', 'Canadian Dollar', ARRAY['CA'], '🇨🇦');

-- Create index for faster lookups
CREATE INDEX idx_exchange_rates_target_currency ON public.exchange_rates(target_currency);
CREATE INDEX idx_exchange_rates_country_codes ON public.exchange_rates USING GIN(country_codes);