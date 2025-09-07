-- Fix the RLS policy for guest orders
-- Drop the existing problematic policy
DROP POLICY IF EXISTS "Enable order creation for all users" ON public.orders;

-- Create a new policy that works for both authenticated and anonymous users
CREATE POLICY "Enable order creation for authenticated and guest users" ON public.orders
FOR INSERT 
TO public, anon, authenticated
WITH CHECK (
  -- Allow guest orders when user_id is null
  user_id IS NULL OR 
  -- Allow authenticated users to create orders for themselves
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
);