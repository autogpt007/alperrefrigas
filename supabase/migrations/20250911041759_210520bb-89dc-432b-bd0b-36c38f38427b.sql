-- The contact_submissions and newsletter_subscribers policies are already correct
-- They only allow admins to read/manage and public to insert
-- This is the secure setup we want

-- Fix the quotes table policies to be more restrictive
DROP POLICY IF EXISTS "Users can view own quotes or admins view all" ON public.quotes;

-- Create separate policies for better security
CREATE POLICY "Users can view own quotes" ON public.quotes
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own quotes" ON public.quotes  
FOR UPDATE USING (auth.uid() = user_id);

-- Update all database functions to have proper search path
CREATE OR REPLACE FUNCTION public.calculate_bulk_price(base_price numeric, package_type text)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  CASE package_type
    WHEN '1 Pallet' THEN
      RETURN base_price;
    WHEN '20ft Container' THEN
      RETURN base_price * 0.70; -- 30% discount
    WHEN '40ft Container' THEN
      RETURN base_price * 0.55; -- 45% discount
    ELSE
      RETURN base_price;
  END CASE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  new_number text;
  counter integer;
BEGIN
  -- Get current date in YYYYMMDD format
  SELECT 'ORD-' || to_char(now(), 'YYYYMMDD') || '-' || LPAD((
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 'ORD-\d{8}-(\d+)$') AS integer)), 0) + 1
    FROM orders 
    WHERE order_number ~ ('^ORD-' || to_char(now(), 'YYYYMMDD') || '-\d+$')
  )::text, 4, '0') INTO new_number;
  
  RETURN new_number;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_quote_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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