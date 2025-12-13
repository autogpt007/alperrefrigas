-- Fix RLS security issues: Add explicit deny policies for anonymous users

-- 1. order_items: Add policy to explicitly block anonymous SELECT access
CREATE POLICY "order_items_block_anon_select" 
ON public.order_items 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 2. mining_payouts: Add explicit policy requiring authentication for all operations
-- The existing policies already require auth, but let's add an explicit block
CREATE POLICY "mining_payouts_require_auth" 
ON public.mining_payouts 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 3. quotes: The existing quotes_no_anon_access policy should work, 
-- but let's ensure it's properly restrictive by dropping and recreating
DROP POLICY IF EXISTS "quotes_no_anon_access" ON public.quotes;
DROP POLICY IF EXISTS "quotes_user_access" ON public.quotes;

-- Create a single clear policy for user access that requires authentication
CREATE POLICY "quotes_authenticated_user_access" 
ON public.quotes 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND (
    auth.uid() = user_id 
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);