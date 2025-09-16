-- Fix critical security vulnerabilities by implementing proper RLS policies

-- 1. Fix profiles table RLS - users should only see their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- 2. Remove public access to contact_submissions - only admins should see them
DROP POLICY IF EXISTS "contact_submissions_insert_only" ON public.contact_submissions;
CREATE POLICY "contact_submissions_insert_system_only" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (false); -- Block direct inserts, only allow via edge function

-- 3. Remove public access to quotes - users can only see their own
DROP POLICY IF EXISTS "quotes_insert_authenticated" ON public.quotes;
CREATE POLICY "quotes_insert_system_only" 
ON public.quotes 
FOR INSERT 
WITH CHECK (false); -- Block direct inserts, only allow via edge function

-- 4. Fix orders table to prevent guest order access by authenticated users
DROP POLICY IF EXISTS "authenticated_users_own_orders_only" ON public.orders;
DROP POLICY IF EXISTS "users_can_view_own_orders" ON public.orders;
CREATE POLICY "users_can_access_own_orders_only" 
ON public.orders 
FOR ALL 
USING (
  -- Admins can access all orders
  (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')) 
  OR 
  -- Authenticated users can only access their own orders (never guest orders)
  (auth.uid() IS NOT NULL AND user_id IS NOT NULL AND auth.uid() = user_id)
)
WITH CHECK (
  -- Admins can modify all orders
  (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')) 
  OR 
  -- Authenticated users can only create/modify their own orders
  (auth.uid() IS NOT NULL AND user_id IS NOT NULL AND auth.uid() = user_id)
);

-- 5. Remove public access to newsletter_subscribers - only admins should see them
DROP POLICY IF EXISTS "newsletter_insert_only" ON public.newsletter_subscribers;
CREATE POLICY "newsletter_insert_system_only" 
ON public.newsletter_subscribers 
FOR INSERT 
WITH CHECK (false); -- Block direct inserts, only allow via edge function

-- 6. Remove public access to user_wallets
DROP POLICY IF EXISTS "Users can manage their wallets" ON public.user_wallets;
CREATE POLICY "Users can manage only their own wallets" 
ON public.user_wallets 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 7. Fix order_items access - inherit from orders table permissions
DROP POLICY IF EXISTS "order_items_simple_access_policy" ON public.order_items;
CREATE POLICY "order_items_restricted_access" 
ON public.order_items 
FOR ALL 
USING (
  -- Admins can access all order items
  (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')) 
  OR 
  -- Users can only access order items for their own orders
  (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id IS NOT NULL 
    AND orders.user_id = auth.uid()
  ))
)
WITH CHECK (
  -- Admins can modify all order items
  (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')) 
  OR 
  -- Users can only create/modify order items for their own orders
  (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id IS NOT NULL 
    AND orders.user_id = auth.uid()
  ))
);