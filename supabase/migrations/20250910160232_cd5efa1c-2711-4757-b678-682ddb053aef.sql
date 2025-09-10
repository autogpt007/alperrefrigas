-- Fix the order_items RLS policy to be simpler and more reliable
-- Remove the existing policy that has timing issues
DROP POLICY IF EXISTS "order_items_access_policy" ON public.order_items;

-- Create a simpler, more reliable policy for order_items
-- This policy allows:
-- 1. Admins to manage all order items
-- 2. Users to access order items for orders they own (authenticated users)
-- 3. Anyone to access order items for orders without user_id (guest orders)
CREATE POLICY "order_items_simple_access_policy" 
ON public.order_items 
FOR ALL 
USING (
  -- Allow admins full access
  (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  OR
  -- Allow access to order items for guest orders (orders with no user_id)
  (EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND user_id IS NULL))
  OR
  -- Allow authenticated users to access their own order items
  (auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND user_id = auth.uid()))
)
WITH CHECK (
  -- Same logic for inserts/updates
  (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  OR
  (EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND user_id IS NULL))
  OR
  (auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND user_id = auth.uid()))
);