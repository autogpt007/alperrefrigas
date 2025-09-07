-- Fix security vulnerability: Restrict contact submissions access to admins only
-- Remove any implicit public access and ensure only admins can read contact submissions

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Admins can manage contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Anyone can submit contact forms" ON public.contact_submissions;

-- Create secure policies
-- Allow anyone to submit contact forms (INSERT only)
CREATE POLICY "Public can submit contact forms" 
ON public.contact_submissions 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Only admins can read contact submissions
CREATE POLICY "Only admins can view contact submissions" 
ON public.contact_submissions 
FOR SELECT 
TO authenticated 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Only admins can update/delete contact submissions
CREATE POLICY "Only admins can manage contact submissions" 
ON public.contact_submissions 
FOR ALL 
TO authenticated 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));