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

CREATE OR REPLACE FUNCTION public.get_current_user_role()
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT role FROM public.profiles WHERE id = auth.uid();
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
      SELECT version::text 
      FROM supabase_migrations.schema_migrations 
      ORDER BY version DESC 
      LIMIT 1
    )
  );
$function$;