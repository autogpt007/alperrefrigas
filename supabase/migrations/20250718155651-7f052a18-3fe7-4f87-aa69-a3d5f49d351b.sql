-- Drop ALL existing policies on orders and order_items to avoid conflicts
DROP POLICY IF EXISTS "Users can create orders including guest orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can manage orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;

DROP POLICY IF EXISTS "Users can create order items including guest orders" ON public.order_items;
DROP POLICY IF EXISTS "Users can view their order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can manage order items" ON public.order_items;

-- Create fresh policies for orders
CREATE POLICY "Users can create orders including guest orders" ON public.orders
FOR INSERT 
WITH CHECK ((user_id = auth.uid()) OR (user_id IS NULL));

CREATE POLICY "Users can view their own orders" ON public.orders
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON public.orders
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage orders" ON public.orders
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Create fresh policies for order_items
CREATE POLICY "Users can create order items including guest orders" ON public.order_items
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM orders 
  WHERE orders.id = order_items.order_id 
  AND ((orders.user_id = auth.uid()) OR (orders.user_id IS NULL))
));

CREATE POLICY "Users can view their order items" ON public.order_items
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM orders 
  WHERE orders.id = order_items.order_id 
  AND orders.user_id = auth.uid()
));

CREATE POLICY "Admins can manage order items" ON public.order_items
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));