-- Create helper function for order security
CREATE OR REPLACE FUNCTION public.can_access_order(order_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    CASE 
      WHEN auth.uid() IS NULL THEN order_user_id IS NULL  -- Guests can only access guest orders
      WHEN order_user_id IS NULL THEN false              -- Authenticated users cannot access guest orders
      ELSE auth.uid() = order_user_id                     -- Authenticated users can access their own orders
    END;
$$;

-- Create helper function for admin access
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Simplify order RLS policies
DROP POLICY IF EXISTS "admins_can_manage_all_orders" ON orders;
DROP POLICY IF EXISTS "authenticated_users_can_manage_own_orders" ON orders;
DROP POLICY IF EXISTS "guests_can_create_orders" ON orders;

CREATE POLICY "order_access_policy" ON orders
FOR ALL
USING (is_admin_user() OR can_access_order(user_id))
WITH CHECK (is_admin_user() OR can_access_order(user_id));

-- Simplify order_items RLS policies to remove complex JOINs
DROP POLICY IF EXISTS "admins_can_manage_all_order_items" ON order_items;
DROP POLICY IF EXISTS "authenticated_users_can_manage_own_order_items" ON order_items;
DROP POLICY IF EXISTS "guests_can_create_order_items" ON order_items;

CREATE POLICY "order_items_access_policy" ON order_items
FOR ALL
USING (
  is_admin_user() OR 
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND can_access_order(orders.user_id)
  )
)
WITH CHECK (
  is_admin_user() OR 
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND can_access_order(orders.user_id)
  )
);