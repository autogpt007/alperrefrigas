-- Fix critical RLS policies for sensitive data

-- 1. Fix contact_submissions table - should only allow admins to view
DROP POLICY IF EXISTS "Only admins can view contact submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Only admins can manage contact submissions" ON contact_submissions;

CREATE POLICY "Admins can view contact submissions" ON contact_submissions
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

CREATE POLICY "Admins can manage contact submissions" ON contact_submissions
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
))
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- 2. Fix newsletter_subscribers table - should only allow admins to view
DROP POLICY IF EXISTS "Only admins can view subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Only admins can manage subscribers" ON newsletter_subscribers;

CREATE POLICY "Admins can view newsletter subscribers" ON newsletter_subscribers
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

CREATE POLICY "Admins can manage newsletter subscribers" ON newsletter_subscribers
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
))
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- 3. Secure the secure_card_storage table - only admins can access
DROP POLICY IF EXISTS "Admins can manage card storage" ON secure_card_storage;

CREATE POLICY "Admins can manage secure card storage" ON secure_card_storage
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
))
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- 4. Add missing security function for checking admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;