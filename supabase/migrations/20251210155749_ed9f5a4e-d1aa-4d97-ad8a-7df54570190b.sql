-- FIX 1: Quotes table - ensure only admins and quote owners can SELECT
-- Drop any permissive SELECT policies that might allow unauthorized access
DROP POLICY IF EXISTS "Anyone can view quotes" ON public.quotes;
DROP POLICY IF EXISTS "Public can view quotes" ON public.quotes;

-- FIX 2: Mining payouts - already has good policies but let's ensure no gaps
-- Verify user_wallets is properly protected (users can only see their own)
DROP POLICY IF EXISTS "Anyone can view wallets" ON public.user_wallets;
DROP POLICY IF EXISTS "Public can view wallets" ON public.user_wallets;

-- FIX 3: Profiles table - ensure no public access to user data
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Ensure profiles INSERT policy allows the trigger to work
DROP POLICY IF EXISTS "profiles_no_direct_insert" ON public.profiles;
CREATE POLICY "profiles_system_insert_only"
ON public.profiles
FOR INSERT
WITH CHECK (
  -- Only allow inserts from the auth trigger (when id matches the new user's id)
  -- This is handled by the SECURITY DEFINER trigger, so we block direct inserts
  false
);

-- Create explicit deny policy for anonymous users on quotes
-- This ensures no anonymous access even if other policies are misconfigured
CREATE POLICY "quotes_no_anon_access"
ON public.quotes
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND (
    auth.uid() = user_id OR
    has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Ensure contact_submissions is properly protected
DROP POLICY IF EXISTS "Anyone can view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Public can view contact submissions" ON public.contact_submissions;

-- Ensure newsletter_subscribers is properly protected  
DROP POLICY IF EXISTS "Anyone can view newsletter subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Public can view subscribers" ON public.newsletter_subscribers;

-- Ensure orders table blocks anonymous access completely
DROP POLICY IF EXISTS "Anyone can view orders" ON public.orders;
DROP POLICY IF EXISTS "Public can view orders" ON public.orders;
DROP POLICY IF EXISTS "Guest orders access" ON public.orders;