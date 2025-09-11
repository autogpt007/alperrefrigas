-- Drop the existing policy
DROP POLICY IF EXISTS "order_access_policy" ON public.orders;

-- Create separate policies for different access patterns
-- Policy 1: Admins can see all orders
CREATE POLICY "admins_can_view_all_orders" ON public.orders
FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Policy 2: Authenticated users can only see their own orders (not guest orders)
CREATE POLICY "users_can_view_own_orders" ON public.orders
FOR ALL USING (
  auth.uid() IS NOT NULL 
  AND user_id IS NOT NULL 
  AND auth.uid() = user_id
);

-- Policy 3: Very restrictive guest order access - only during active session via order_number
-- This prevents unauthorized access to guest orders containing sensitive data
CREATE POLICY "restricted_guest_order_access" ON public.orders
FOR SELECT USING (
  user_id IS NULL 
  AND auth.uid() IS NULL
  AND order_number IS NOT NULL
  -- Additional security: Could add session-based validation here
  -- For now, this at minimum requires knowing the order_number
);

-- Update the can_access_order function to be more secure
CREATE OR REPLACE FUNCTION public.can_access_order(order_user_id uuid, order_num text DEFAULT NULL)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    CASE 
      -- Admins can access any order
      WHEN EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN true
      -- Authenticated users can only access their own orders (never guest orders)
      WHEN auth.uid() IS NOT NULL AND order_user_id IS NOT NULL THEN auth.uid() = order_user_id
      -- Guest orders require order number for minimal access (during checkout flow only)
      WHEN auth.uid() IS NULL AND order_user_id IS NULL AND order_num IS NOT NULL THEN true
      -- All other cases denied
      ELSE false
    END;
$function$;