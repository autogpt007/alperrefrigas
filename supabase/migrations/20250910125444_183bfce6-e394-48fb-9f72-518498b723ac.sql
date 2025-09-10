-- Fix RLS policies for orders table to handle guest checkout properly

-- First, drop existing conflicting policies
DROP POLICY IF EXISTS "Users and guests can create orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;

-- Create precise, mutually exclusive policies for guest and authenticated users

-- SELECT: Users can view their own orders, guests cannot view orders (for security)
CREATE POLICY "orders_select_authenticated" 
ON public.orders 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- SELECT: Admins can view all orders  
CREATE POLICY "orders_select_admin" 
ON public.orders 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- INSERT: Allow authenticated users to create orders with their user_id
CREATE POLICY "orders_insert_authenticated" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- INSERT: Allow guest users to create orders with user_id = NULL
CREATE POLICY "orders_insert_guest" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() IS NULL AND user_id IS NULL);

-- UPDATE: Only authenticated users can update their own orders
CREATE POLICY "orders_update_authenticated" 
ON public.orders 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND user_id = auth.uid())
WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- UPDATE: Admins can update all orders
CREATE POLICY "orders_update_admin" 
ON public.orders 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- DELETE: Only admins can delete orders
CREATE POLICY "orders_delete_admin" 
ON public.orders 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);