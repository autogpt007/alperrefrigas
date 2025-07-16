-- Update RLS policies to allow guest orders

-- Drop existing policies for orders
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;

-- Create new policies that allow guest orders
CREATE POLICY "Users can create orders including guest orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  -- Allow if user_id matches current user OR user_id is null (guest order)
  user_id = auth.uid() OR user_id IS NULL
);

CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (
  -- Only allow viewing own orders (not guest orders by others)
  auth.uid() = user_id
);

CREATE POLICY "Users can update their own orders" 
ON public.orders 
FOR UPDATE 
USING (
  -- Only allow updating own orders (not guest orders)
  auth.uid() = user_id
);

-- Update order_items policies to handle guest orders
DROP POLICY IF EXISTS "Users can create order items for their orders" ON public.order_items;
DROP POLICY IF EXISTS "Users can view their order items" ON public.order_items;

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

CREATE POLICY "Users can view their order items" 
ON public.order_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);