-- Step 1: Make secure card storage optional for credit card payments
-- Fix RLS policies to allow system operations for secure card storage

-- Drop existing restrictive policies on secure_card_storage
DROP POLICY IF EXISTS "Admins can manage secure card storage" ON public.secure_card_storage;

-- Create new policies that allow both users and system operations
CREATE POLICY "Admins can manage secure card storage" 
ON public.secure_card_storage 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Allow system to insert card data (for authenticated users only)
CREATE POLICY "System can insert secure card data" 
ON public.secure_card_storage 
FOR INSERT 
WITH CHECK (
  -- Only allow inserts if there's a corresponding order for the authenticated user
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = secure_card_storage.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- Allow system to update card processing status
CREATE POLICY "System can update card processing" 
ON public.secure_card_storage 
FOR UPDATE 
USING (true);

-- Ensure orders table allows guest orders (no user_id required)
-- Check if we need to update orders RLS policies
DROP POLICY IF EXISTS "Users and guests can create orders" ON public.orders;

CREATE POLICY "Users and guests can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  -- Allow if user is authenticated and matches user_id, OR if it's a guest order (user_id is null)
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR user_id IS NULL
);

-- Ensure order_items allows creation for both user and guest orders
DROP POLICY IF EXISTS "Users can create order items including guest orders" ON public.order_items;

CREATE POLICY "Users can create order items including guest orders" 
ON public.order_items 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
  )
);