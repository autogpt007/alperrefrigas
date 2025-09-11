-- Fix Contact Submissions RLS - Remove public read access
DROP POLICY IF EXISTS "Public can subscribe to newsletter" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can manage contact submissions" ON public.contact_submissions;

-- Create secure policies for contact submissions
CREATE POLICY "Admins can manage contact submissions" ON public.contact_submissions
FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Public can submit contact forms" ON public.contact_submissions
FOR INSERT WITH CHECK (true);

-- Fix Newsletter Subscribers RLS - Remove public read access  
DROP POLICY IF EXISTS "Public can subscribe to newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can manage newsletter subscribers" ON public.newsletter_subscribers;

-- Create secure policies for newsletter subscribers
CREATE POLICY "Admins can manage newsletter subscribers" ON public.newsletter_subscribers
FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Public can subscribe to newsletter" ON public.newsletter_subscribers
FOR INSERT WITH CHECK (true);

-- Strengthen Quotes Table RLS - Ensure proper access control
DROP POLICY IF EXISTS "Users can view own quotes or admins view all" ON public.quotes;
DROP POLICY IF EXISTS "Users can create own quotes" ON public.quotes;
DROP POLICY IF EXISTS "Admins can manage all quotes" ON public.quotes;

-- Create comprehensive quote policies
CREATE POLICY "Admins can manage all quotes" ON public.quotes
FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users can view and update own quotes" ON public.quotes
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own quotes" ON public.quotes
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quotes" ON public.quotes
FOR UPDATE USING (auth.uid() = user_id);

-- Update database functions with proper search path
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
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