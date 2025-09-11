-- Security hardening: Pin search_path for all SECURITY DEFINER functions
-- This prevents search_path injection attacks

-- Update existing functions to pin search_path
CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$function$;

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

CREATE OR REPLACE FUNCTION public.get_current_user_role()
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$function$;

CREATE OR REPLACE FUNCTION public.can_access_order(order_user_id uuid, order_num text DEFAULT NULL::text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT 
    CASE 
      -- Admins can access any order
      WHEN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') THEN true
      -- Authenticated users can only access their own orders (never guest orders)
      WHEN auth.uid() IS NOT NULL AND order_user_id IS NOT NULL THEN auth.uid() = order_user_id
      -- Guest orders require order number for minimal access (during checkout flow only)
      WHEN auth.uid() IS NULL AND order_user_id IS NULL AND order_num IS NOT NULL THEN true
      -- All other cases denied
      ELSE false
    END;
$function$;

CREATE OR REPLACE FUNCTION public.is_admin_user()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$function$;

CREATE OR REPLACE FUNCTION public.set_order_number()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := public.generate_order_number();
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_quote_number()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.quote_number IS NULL THEN
    NEW.quote_number := public.generate_quote_number();
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
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

CREATE OR REPLACE FUNCTION public.assign_user_role(target_user_id uuid, new_role text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
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

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
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
    FROM public.orders 
    WHERE order_number ~ ('^ORD-' || to_char(now(), 'YYYYMMDD') || '-\d+$')
  )::text, 4, '0') INTO new_number;
  
  RETURN new_number;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_blog_post_stats()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.blog_post_stats (blog_post_id, total_views, unique_views, country_stats)
  VALUES (
    NEW.blog_post_id,
    1,
    1,
    CASE 
      WHEN NEW.country_code IS NOT NULL THEN 
        jsonb_build_object(NEW.country_code, jsonb_build_object('count', 1, 'name', NEW.country_name))
      ELSE '{}'::jsonb
    END
  )
  ON CONFLICT (blog_post_id) DO UPDATE SET
    total_views = public.blog_post_stats.total_views + 1,
    unique_views = public.blog_post_stats.unique_views + 
      CASE WHEN EXISTS (
        SELECT 1 FROM public.blog_post_views 
        WHERE blog_post_id = NEW.blog_post_id 
        AND viewer_ip_hash = NEW.viewer_ip_hash
        AND created_at < NEW.created_at
      ) THEN 0 ELSE 1 END,
    country_stats = CASE 
      WHEN NEW.country_code IS NOT NULL THEN
        public.blog_post_stats.country_stats || 
        jsonb_build_object(
          NEW.country_code, 
          jsonb_build_object(
            'count', 
            COALESCE((public.blog_post_stats.country_stats->NEW.country_code->>'count')::integer, 0) + 1,
            'name',
            NEW.country_name
          )
        )
      ELSE public.blog_post_stats.country_stats
    END,
    last_updated = now();
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_sensitive_data_access()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Log access to sensitive tables
  INSERT INTO public.security_audit_log (
    event_type,
    user_id,
    user_email,
    details,
    risk_level
  ) VALUES (
    'data_access',
    auth.uid(),
    (SELECT email FROM auth.users WHERE id = auth.uid()),
    jsonb_build_object(
      'table_name', TG_TABLE_NAME,
      'operation', TG_OP,
      'record_id', COALESCE(NEW.id, OLD.id)
    ),
    'medium'
  );
  
  RETURN COALESCE(NEW, OLD);
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
    FROM public.quotes 
    WHERE quote_number ~ ('^QTE-' || to_char(now(), 'YYYYMMDD') || '-\d+$')
  )::text, 4, '0') INTO new_number;
  
  RETURN new_number;
END;
$function$;

-- Create a health function to show database status
CREATE OR REPLACE FUNCTION public.get_db_health()
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT jsonb_build_object(
    'postgres_version', version(),
    'current_timestamp', now(),
    'latest_migration', (
      SELECT migration_name 
      FROM supabase_migrations.schema_migrations 
      ORDER BY version DESC 
      LIMIT 1
    )
  );
$function$;