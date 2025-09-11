-- Enable RLS on sensitive tables (already enabled, but ensuring)
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- DROP existing permissive policies first
DROP POLICY IF EXISTS "Public can submit contact forms" ON public.contact_submissions;
DROP POLICY IF EXISTS "Public can subscribe to newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Users can create own quotes" ON public.quotes;
DROP POLICY IF EXISTS "Users can view own quotes" ON public.quotes;
DROP POLICY IF EXISTS "Users can update own quotes" ON public.quotes;

-- Insert-only for anonymous users - they can submit but never read back
CREATE POLICY contact_submissions_insert_only ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY newsletter_insert_only ON public.newsletter_subscribers
FOR INSERT  
TO anon, authenticated
WITH CHECK (true);

-- Quotes require authentication and user_id matching
CREATE POLICY quotes_insert_authenticated ON public.quotes
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Admin-only read access using existing admin check pattern
CREATE POLICY contact_submissions_admin_access ON public.contact_submissions
FOR ALL
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY newsletter_admin_access ON public.newsletter_subscribers
FOR ALL
TO authenticated  
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY quotes_admin_access ON public.quotes
FOR ALL
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Users can only view/update their own quotes
CREATE POLICY quotes_user_access ON public.quotes
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY quotes_user_update ON public.quotes  
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);