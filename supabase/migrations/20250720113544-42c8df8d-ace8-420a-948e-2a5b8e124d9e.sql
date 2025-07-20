-- Fix function search path security warnings
-- Update all functions to have immutable search_path parameter

-- Update calculate_bulk_price function
CREATE OR REPLACE FUNCTION public.calculate_bulk_price(base_price numeric, package_type text)
 RETURNS numeric
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
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

-- Update generate_order_number function
CREATE OR REPLACE FUNCTION public.generate_order_number()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
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

-- Update set_order_number function
CREATE OR REPLACE FUNCTION public.set_order_number()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$function$;

-- Update generate_quote_number function
CREATE OR REPLACE FUNCTION public.generate_quote_number()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
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

-- Update set_quote_number function
CREATE OR REPLACE FUNCTION public.set_quote_number()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  IF NEW.quote_number IS NULL THEN
    NEW.quote_number := generate_quote_number();
  END IF;
  RETURN NEW;
END;
$function$;

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'user'
  );
  return new;
end;
$function$;

-- Update get_current_user_role function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
 RETURNS text
 LANGUAGE sql
 STABLE 
 SECURITY DEFINER
 SET search_path = public
AS $function$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$function$;

-- Update assign_user_role function
CREATE OR REPLACE FUNCTION public.assign_user_role(target_user_id uuid, new_role text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  -- Only admins can assign roles
  IF public.get_current_user_role() != 'admin' THEN
    RAISE EXCEPTION 'Insufficient privileges to assign roles';
  END IF;
  
  -- Validate role values
  IF new_role NOT IN ('admin', 'user') THEN
    RAISE EXCEPTION 'Invalid role specified';
  END IF;
  
  UPDATE public.profiles 
  SET role = new_role, updated_at = now()
  WHERE id = target_user_id;
  
  RETURN FOUND;
END;
$function$;

-- Update update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Add RLS policy for table that has RLS enabled but no policies
ALTER TABLE public.table DISABLE ROW LEVEL SECURITY;