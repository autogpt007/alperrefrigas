-- CRITICAL SECURITY FIXES - Remove stored credit card data and fix data access
-- PRIORITY 1: URGENT - Purge all credit card numbers from payment_details

-- Remove sensitive payment data from existing orders
UPDATE public.orders 
SET payment_details = CASE 
  WHEN payment_details IS NOT NULL THEN 
    payment_details - 'cardNumber' - 'card_number' - 'ccNumber' - 'creditCardNumber' - 'cvv' - 'cvc' - 'securityCode'
  ELSE NULL 
END
WHERE payment_details IS NOT NULL;

-- PRIORITY 2: Fix newsletter subscribers RLS - restrict SELECT to admins only
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can manage subscribers" ON public.newsletter_subscribers;

-- Allow public subscription (INSERT only)
CREATE POLICY "Public can subscribe to newsletter" 
ON public.newsletter_subscribers 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Only admins can view subscriber data
CREATE POLICY "Only admins can view subscribers" 
ON public.newsletter_subscribers 
FOR SELECT 
TO authenticated 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Only admins can manage subscriber data
CREATE POLICY "Only admins can manage subscribers" 
ON public.newsletter_subscribers 
FOR ALL 
TO authenticated 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));

-- PRIORITY 3: Verify orders RLS policies are secure
-- Ensure orders can only be accessed by the order owner or admins
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create orders including guest orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;

-- Users can only view their own orders, admins can view all
CREATE POLICY "Users can view own orders or admins view all" 
ON public.orders 
FOR SELECT 
TO authenticated 
USING (
  (auth.uid() = user_id) OR 
  (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  ))
);

-- Allow order creation for authenticated users or guest orders
CREATE POLICY "Users can create orders" 
ON public.orders 
FOR INSERT 
TO authenticated 
WITH CHECK ((user_id = auth.uid()) OR (user_id IS NULL));

-- Allow guest order creation (no auth required for INSERT)
CREATE POLICY "Guest can create orders" 
ON public.orders 
FOR INSERT 
TO anon 
WITH CHECK (user_id IS NULL);

-- Users can only update their own orders
CREATE POLICY "Users can update own orders" 
ON public.orders 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- PRIORITY 4: Verify quotes RLS policies are secure
DROP POLICY IF EXISTS "Users can view their own quotes" ON public.quotes;
DROP POLICY IF EXISTS "Users can create their own quotes" ON public.quotes;

-- Users can only view their own quotes, admins can view all
CREATE POLICY "Users can view own quotes or admins view all" 
ON public.quotes 
FOR SELECT 
TO authenticated 
USING (
  (auth.uid() = user_id) OR 
  (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  ))
);

-- Users can only create quotes for themselves
CREATE POLICY "Users can create own quotes" 
ON public.quotes 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);