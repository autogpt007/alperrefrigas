-- Fix security issues: Set proper search_path for all functions

-- Update cleanup function with proper search_path
CREATE OR REPLACE FUNCTION public.cleanup_expired_cards()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.secure_card_storage 
  WHERE expires_at < now() OR processed = true;
END;
$$;

-- Update schedule cleanup function with proper search_path
CREATE OR REPLACE FUNCTION public.schedule_card_cleanup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.cleanup_expired_cards();
  RETURN NULL;
END;
$$;

-- Update log access function with proper search_path
CREATE OR REPLACE FUNCTION public.log_card_access(
  card_id UUID,
  action TEXT,
  user_id UUID DEFAULT auth.uid()
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_log JSONB;
BEGIN
  new_log := jsonb_build_object(
    'timestamp', now(),
    'user_id', user_id,
    'action', action,
    'ip_address', current_setting('request.headers', true)::jsonb->>'x-real-ip'
  );
  
  UPDATE public.secure_card_storage 
  SET access_log = access_log || new_log
  WHERE id = card_id;
END;
$$;