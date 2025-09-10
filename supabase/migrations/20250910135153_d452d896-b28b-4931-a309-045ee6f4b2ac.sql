-- Remove secure card storage table and related functionality
DROP TABLE IF EXISTS public.secure_card_storage CASCADE;

-- Simplify orders RLS policies - remove conflicting policies and create clear ones
DROP POLICY IF EXISTS "orders_insert_authenticated" ON public.orders;
DROP POLICY IF EXISTS "orders_insert_guest" ON public.orders;
DROP POLICY IF EXISTS "orders_select_authenticated" ON public.orders;
DROP POLICY IF EXISTS "orders_select_admin" ON public.orders;
DROP POLICY IF EXISTS "orders_update_authenticated" ON public.orders;
DROP POLICY IF EXISTS "orders_update_admin" ON public.orders;
DROP POLICY IF EXISTS "orders_delete_admin" ON public.orders;

-- Create simplified, non-conflicting RLS policies for orders
CREATE POLICY "authenticated_users_can_manage_own_orders" ON public.orders
  FOR ALL
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid())
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "guests_can_create_orders" ON public.orders
  FOR INSERT
  WITH CHECK (user_id IS NULL);

CREATE POLICY "admins_can_manage_all_orders" ON public.orders
  FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Simplify order_items RLS policies
DROP POLICY IF EXISTS "Users can create order items including guest orders" ON public.order_items;
DROP POLICY IF EXISTS "Users can view their order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can manage order items" ON public.order_items;

-- Create simplified order_items policies
CREATE POLICY "authenticated_users_can_manage_own_order_items" ON public.order_items
  FOR ALL
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

CREATE POLICY "guests_can_create_order_items" ON public.order_items
  FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id IS NULL));

CREATE POLICY "admins_can_manage_all_order_items" ON public.order_items
  FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Remove secure card related functions
DROP FUNCTION IF EXISTS public.cleanup_expired_cards();
DROP FUNCTION IF EXISTS public.schedule_card_cleanup();
DROP FUNCTION IF EXISTS public.log_card_access(uuid, text, uuid);