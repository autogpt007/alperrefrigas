-- Migration: Update storage policies to use user_roles table, then remove profiles.role

-- First, drop the storage policies that depend on profiles.role
DROP POLICY IF EXISTS "Admins can delete team photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update team photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload team photos" ON storage.objects;

-- Recreate storage policies using has_role function
CREATE POLICY "Admins can upload team photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'team-photos' AND 
  public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update team photos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'team-photos' AND 
  public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete team photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'team-photos' AND 
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- Now remove the role column from profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;