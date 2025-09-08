-- CRITICAL SECURITY FIXES - Phase 1: Data Protection
-- Fix overly permissive RLS policies that expose customer data

-- 1. Restrict contact_submissions to admin-only read access
DROP POLICY IF EXISTS "Public can submit contact forms" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can manage contact submissions" ON public.contact_submissions;

CREATE POLICY "Public can submit contact forms" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can manage contact submissions" 
ON public.contact_submissions 
FOR ALL 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 2. Restrict newsletter_subscribers to admin-only read access
DROP POLICY IF EXISTS "Public can subscribe to newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can view newsletter subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can manage newsletter subscribers" ON public.newsletter_subscribers;

CREATE POLICY "Public can subscribe to newsletter" 
ON public.newsletter_subscribers 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can manage newsletter subscribers" 
ON public.newsletter_subscribers 
FOR ALL 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 3. Fix orders table to prevent guest order data exposure
DROP POLICY IF EXISTS "Users can view own orders or admins view all" ON public.orders;
DROP POLICY IF EXISTS "Enable order creation for authenticated and guest users" ON public.orders;
DROP POLICY IF EXISTS "Users can update own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can manage orders" ON public.orders;

-- Only authenticated users can view their own orders, admins can view all
CREATE POLICY "Users can view own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR SELECT 
USING (public.is_admin());

-- Allow order creation for authenticated users only (no more guest orders for security)
CREATE POLICY "Authenticated users can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Users can update only their own orders
CREATE POLICY "Users can update own orders" 
ON public.orders 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Admins can manage all orders
CREATE POLICY "Admins can manage all orders" 
ON public.orders 
FOR ALL 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 4. Restrict business-sensitive site_settings to authenticated users
DROP POLICY IF EXISTS "Anyone can view site settings" ON public.site_settings;

CREATE POLICY "Authenticated users can view site settings" 
ON public.site_settings 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage site settings" 
ON public.site_settings 
FOR ALL 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 5. Add audit logging for sensitive data access
CREATE OR REPLACE FUNCTION public.log_sensitive_data_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log access to sensitive tables
  INSERT INTO public.security_audit_log (
    event_type,
    user_id,
    user_email,
    details,
    risk_level
  ) VALUES (
    'sensitive_data_access',
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add triggers for audit logging
CREATE TRIGGER audit_contact_submissions
  AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_data_access();

CREATE TRIGGER audit_orders_access
  AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_data_access();

CREATE TRIGGER audit_secure_card_access
  AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.secure_card_storage
  FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_data_access();