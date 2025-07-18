-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Users can create orders including guest orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create order items including guest orders" ON public.order_items;

-- Create updated policies for orders that properly handle guest orders
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

-- Create updated policies for order_items that properly handle guest orders
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