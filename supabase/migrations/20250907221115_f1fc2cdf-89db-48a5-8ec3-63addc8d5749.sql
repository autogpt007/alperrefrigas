-- Fix the RLS policy for guest orders by using correct role syntax
-- Drop the existing problematic policy
DROP POLICY IF EXISTS "Enable order creation for authenticated and guest users" ON public.orders;

-- Create a new policy that works for both authenticated and anonymous users
-- Note: 'public' is not a valid role in RLS TO clause, only 'anon' and 'authenticated'
CREATE POLICY "Enable order creation for authenticated and guest users" ON public.orders
FOR INSERT 
TO anon, authenticated
WITH CHECK (
  -- Allow guest orders when user_id is null (anon role)
  user_id IS NULL OR 
  -- Allow authenticated users to create orders for themselves
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
);