-- Fix RLS policy for public.table
-- Since the table doesn't have a user_id column, we need to add one if it's meant to be user-specific
-- or create an appropriate policy

-- First, let's add a user_id column to the table
ALTER TABLE public.table ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE public.table ENABLE ROW LEVEL SECURITY;

-- Create RLS Policy for Authenticated Users
CREATE POLICY "Authenticated users can manage own records" ON public.table
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow admins to manage all records
CREATE POLICY "Admins can manage all records" ON public.table
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = auth.uid() AND role = 'admin'
))
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = auth.uid() AND role = 'admin'
));