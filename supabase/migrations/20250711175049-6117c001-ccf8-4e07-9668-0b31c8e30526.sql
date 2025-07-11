-- Create quotes table for RFQ functionality
CREATE TABLE public.quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_number TEXT UNIQUE,
  user_id UUID,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  company_name TEXT,
  phone TEXT,
  shipping_address TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quote_items table
CREATE TABLE public.quote_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id UUID NOT NULL,
  product_id UUID,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  packaging TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;

-- Create policies for quotes
CREATE POLICY "Users can view their own quotes" 
ON public.quotes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quotes" 
ON public.quotes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all quotes" 
ON public.quotes 
FOR ALL 
USING (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::text))));

-- Create policies for quote_items
CREATE POLICY "Users can view their quote items" 
ON public.quote_items 
FOR SELECT 
USING (EXISTS ( SELECT 1
   FROM quotes
  WHERE ((quotes.id = quote_items.quote_id) AND (quotes.user_id = auth.uid()))));

CREATE POLICY "Users can create quote items for their quotes" 
ON public.quote_items 
FOR INSERT 
WITH CHECK (EXISTS ( SELECT 1
   FROM quotes
  WHERE ((quotes.id = quote_items.quote_id) AND (quotes.user_id = auth.uid()))));

-- Create quote number generation function
CREATE OR REPLACE FUNCTION public.generate_quote_number()
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
  new_number text;
BEGIN
  SELECT 'QTE-' || to_char(now(), 'YYYYMMDD') || '-' || LPAD((
    SELECT COALESCE(MAX(CAST(SUBSTRING(quote_number FROM 'QTE-\d{8}-(\d+)$') AS integer)), 0) + 1
    FROM quotes 
    WHERE quote_number ~ ('^QTE-' || to_char(now(), 'YYYYMMDD') || '-\d+$')
  )::text, 4, '0') INTO new_number;
  
  RETURN new_number;
END;
$function$;

-- Create function to set quote number
CREATE OR REPLACE FUNCTION public.set_quote_number()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.quote_number IS NULL THEN
    NEW.quote_number := generate_quote_number();
  END IF;
  RETURN NEW;
END;
$function$;

-- Create trigger to auto-generate quote numbers
CREATE TRIGGER set_quote_number_trigger
  BEFORE INSERT ON public.quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.set_quote_number();

-- Add foreign key constraints
ALTER TABLE public.quote_items 
ADD CONSTRAINT fk_quote_items_quote_id 
FOREIGN KEY (quote_id) REFERENCES public.quotes(id) ON DELETE CASCADE;

ALTER TABLE public.quote_items 
ADD CONSTRAINT quote_items_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES public.products(id);

-- Create site_settings for bank wire details
INSERT INTO public.site_settings (setting_key, setting_value, description) 
VALUES 
  ('bank_wire_instructions', 'Bank wire transfer instructions will be provided after order confirmation. Please contact support for details.', 'Instructions displayed for bank wire payment method'),
  ('bank_name', 'First National Bank', 'Bank name for wire transfers'),
  ('bank_routing_number', '123456789', 'Bank routing number'),
  ('bank_account_number', '9876543210', 'Bank account number'),
  ('bank_swift_code', 'FNBKUS33', 'SWIFT code for international transfers')
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description;