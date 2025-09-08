-- Fix the audit trigger function to use 'data_access' instead of 'sensitive_data_access'
CREATE OR REPLACE FUNCTION public.log_sensitive_data_access()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
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