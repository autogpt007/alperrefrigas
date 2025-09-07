-- Update the orders RLS policies to better handle guest orders
-- First drop existing policies
DROP POLICY IF EXISTS "Allow order creation" ON public.orders;
DROP POLICY IF EXISTS "Guest can create orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;

-- Create a single comprehensive policy for order creation that handles both cases
CREATE POLICY "Enable order creation for all users" ON public.orders
FOR INSERT 
WITH CHECK (
  -- Always allow guest orders when user_id is null
  user_id IS NULL OR 
  -- Allow authenticated users to create orders for themselves
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
);