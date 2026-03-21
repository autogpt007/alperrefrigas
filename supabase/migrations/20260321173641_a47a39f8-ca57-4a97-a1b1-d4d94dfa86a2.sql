
-- =============================================
-- ERROR FIX 1: Restrict coupon codes from anonymous access
-- Replace public SELECT with authenticated-only SELECT
-- =============================================
DROP POLICY IF EXISTS "Anyone can view active coupons" ON public.coupons;
CREATE POLICY "Authenticated users can view active coupons"
ON public.coupons FOR SELECT TO authenticated
USING (is_active = true AND (start_date IS NULL OR start_date <= now()) AND (end_date IS NULL OR end_date >= now()));

-- =============================================
-- ERROR FIX 2: blog_post_views already has no public SELECT
-- (only admin ALL). Scan flagged it but it's already secure.
-- No change needed - RLS is on and no anon SELECT exists.
-- =============================================

-- =============================================
-- WARN FIX 1: Security audit log - restrict INSERT to service role only
-- Remove overly permissive authenticated INSERT
-- =============================================
DROP POLICY IF EXISTS "authenticated_can_insert_audit_logs" ON public.security_audit_log;

-- =============================================
-- WARN FIX 2: Testimonials - restrict INSERT with basic validation
-- Replace WITH CHECK (true) with actual field validation
-- =============================================
DROP POLICY IF EXISTS "Anyone can submit testimonials" ON public.testimonials;
CREATE POLICY "Anyone can submit testimonials"
ON public.testimonials FOR INSERT TO public
WITH CHECK (
  name IS NOT NULL AND name != '' AND
  content IS NOT NULL AND content != '' AND
  approved = false
);

-- =============================================
-- WARN FIX 3: Orders - add INSERT policy for authenticated users
-- =============================================
CREATE POLICY "authenticated_users_can_create_own_orders"
ON public.orders FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);
