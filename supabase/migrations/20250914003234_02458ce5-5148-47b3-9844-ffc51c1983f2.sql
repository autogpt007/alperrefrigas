-- Fix critical security issues in orders table RLS policies

-- Drop the existing problematic guest order access policy
DROP POLICY IF EXISTS "restricted_guest_order_access" ON public.orders;

-- Create more secure order access policies
-- Remove guest order access entirely - only authenticated users and admins can access orders
CREATE POLICY "authenticated_users_own_orders_only" 
ON public.orders 
FOR ALL 
USING (
  -- Admins can access all orders
  (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')) OR
  -- Authenticated users can only access their own orders (never guest orders)
  (auth.uid() IS NOT NULL AND user_id IS NOT NULL AND auth.uid() = user_id)
)
WITH CHECK (
  -- Same restrictions for INSERT/UPDATE
  (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')) OR
  (auth.uid() IS NOT NULL AND user_id IS NOT NULL AND auth.uid() = user_id)
);

-- Add audit logging trigger for order access
CREATE OR REPLACE FUNCTION public.log_order_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log all order operations for security monitoring
  INSERT INTO public.security_audit_log (
    event_type,
    user_id,
    user_email,
    details,
    risk_level
  ) VALUES (
    CASE 
      WHEN TG_OP = 'SELECT' THEN 'order_access'
      WHEN TG_OP = 'INSERT' THEN 'order_created'
      WHEN TG_OP = 'UPDATE' THEN 'order_modified'
      WHEN TG_OP = 'DELETE' THEN 'order_deleted'
    END,
    auth.uid(),
    (SELECT email FROM auth.users WHERE id = auth.uid()),
    jsonb_build_object(
      'order_id', COALESCE(NEW.id, OLD.id),
      'order_number', COALESCE(NEW.order_number, OLD.order_number),
      'operation', TG_OP,
      'order_user_id', COALESCE(NEW.user_id, OLD.user_id)
    ),
    CASE 
      WHEN TG_OP = 'DELETE' THEN 'high'
      WHEN TG_OP = 'UPDATE' THEN 'medium'
      ELSE 'low'
    END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for order audit logging
DROP TRIGGER IF EXISTS order_access_audit_trigger ON public.orders;
CREATE TRIGGER order_access_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.log_order_access();

-- Update the can_access_order function to be more restrictive
CREATE OR REPLACE FUNCTION public.can_access_order(order_user_id uuid, order_num text DEFAULT NULL::text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    CASE 
      -- Admins can access any order
      WHEN EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN true
      -- Authenticated users can only access their own orders (never guest orders)
      WHEN auth.uid() IS NOT NULL AND order_user_id IS NOT NULL THEN auth.uid() = order_user_id
      -- NO guest order access allowed
      ELSE false
    END;
$function$;