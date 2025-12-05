-- Migration: Update RLS policies to use has_role() function instead of profiles.role
-- This prevents privilege escalation by using the secure user_roles table

-- Drop existing policies that check profiles.role and recreate with has_role()

-- 1. ADVERTS TABLE
DROP POLICY IF EXISTS "Admins can manage adverts" ON public.adverts;
CREATE POLICY "Admins can manage adverts" ON public.adverts
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2. BLOG_POSTS TABLE  
DROP POLICY IF EXISTS "Admins can manage all posts" ON public.blog_posts;
CREATE POLICY "Admins can manage all posts" ON public.blog_posts
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Authors can manage their posts" ON public.blog_posts;
CREATE POLICY "Authors can manage their posts" ON public.blog_posts
  FOR ALL USING (auth.uid() = author_id);

-- 3. CERTIFICATES TABLE
DROP POLICY IF EXISTS "Admins can manage certificates" ON public.certificates;
CREATE POLICY "Admins can manage certificates" ON public.certificates
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 4. CONTACT_INFO TABLE
DROP POLICY IF EXISTS "Admins can manage contact info" ON public.contact_info;
CREATE POLICY "Admins can manage contact info" ON public.contact_info
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 5. CONTACT_SUBMISSIONS TABLE
DROP POLICY IF EXISTS "Admins can manage contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins can manage contact submissions" ON public.contact_submissions
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "contact_submissions_admin_access" ON public.contact_submissions;

-- 6. COUPONS TABLE
DROP POLICY IF EXISTS "Admins can manage coupons" ON public.coupons;
CREATE POLICY "Admins can manage coupons" ON public.coupons
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 7. FEATURED_PRODUCTS TABLE
DROP POLICY IF EXISTS "Admins can manage featured products" ON public.featured_products;
CREATE POLICY "Admins can manage featured products" ON public.featured_products
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 8. HERO_IMAGES TABLE
DROP POLICY IF EXISTS "Admins can manage hero images" ON public.hero_images;
CREATE POLICY "Admins can manage hero images" ON public.hero_images
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 9. MINER_OWNERSHIPS TABLE
DROP POLICY IF EXISTS "Admins can manage all ownerships" ON public.miner_ownerships;
CREATE POLICY "Admins can manage all ownerships" ON public.miner_ownerships
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 10. MINING_PAYOUTS TABLE
DROP POLICY IF EXISTS "Admins can manage all payouts" ON public.mining_payouts;
CREATE POLICY "Admins can manage all payouts" ON public.mining_payouts
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 11. MINING_STATS TABLE
DROP POLICY IF EXISTS "Admins can manage stats" ON public.mining_stats;
CREATE POLICY "Admins can manage stats" ON public.mining_stats
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 12. NEWSLETTER_SUBSCRIBERS TABLE
DROP POLICY IF EXISTS "Admins can manage newsletter subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can manage newsletter subscribers" ON public.newsletter_subscribers
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "newsletter_admin_access" ON public.newsletter_subscribers;

-- 13. ORDERS TABLE
DROP POLICY IF EXISTS "admins_can_view_all_orders" ON public.orders;
CREATE POLICY "admins_can_view_all_orders" ON public.orders
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "users_can_access_own_orders_only" ON public.orders;
CREATE POLICY "users_can_access_own_orders_only" ON public.orders
  FOR ALL 
  USING ((auth.uid() IS NOT NULL) AND (user_id IS NOT NULL) AND (auth.uid() = user_id))
  WITH CHECK ((auth.uid() IS NOT NULL) AND (user_id IS NOT NULL) AND (auth.uid() = user_id));

-- 14. ORDER_ITEMS TABLE
DROP POLICY IF EXISTS "order_items_restricted_access" ON public.order_items;
CREATE POLICY "order_items_admin_access" ON public.order_items
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "order_items_user_access" ON public.order_items
  FOR ALL 
  USING ((auth.uid() IS NOT NULL) AND (EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id IS NOT NULL 
    AND orders.user_id = auth.uid()
  )))
  WITH CHECK ((auth.uid() IS NOT NULL) AND (EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id IS NOT NULL 
    AND orders.user_id = auth.uid()
  )));

-- 15. PAGE_CONTENT_BLOCKS TABLE
DROP POLICY IF EXISTS "Admins can manage all content blocks" ON public.page_content_blocks;
CREATE POLICY "Admins can manage all content blocks" ON public.page_content_blocks
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 16. PRODUCTS TABLE
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 17. SECURITY_AUDIT_LOG TABLE
DROP POLICY IF EXISTS "admins_can_view_audit_logs" ON public.security_audit_log;
CREATE POLICY "admins_can_view_audit_logs" ON public.security_audit_log
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 18. SITE_SETTINGS TABLE
DROP POLICY IF EXISTS "Admins can manage all site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;
CREATE POLICY "Admins can manage site settings" ON public.site_settings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 19. TEAM_MEMBERS TABLE
DROP POLICY IF EXISTS "Admins can manage team members" ON public.team_members;
CREATE POLICY "Admins can manage team members" ON public.team_members
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 20. TESTIMONIALS TABLE
DROP POLICY IF EXISTS "Admins can manage all testimonials" ON public.testimonials;
CREATE POLICY "Admins can manage all testimonials" ON public.testimonials
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 21. ASIC_MINERS TABLE
DROP POLICY IF EXISTS "Admins can manage miners" ON public.asic_miners;
CREATE POLICY "Admins can manage miners" ON public.asic_miners
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 22. BLOG_POST_STATS TABLE
DROP POLICY IF EXISTS "Admins can manage blog post stats" ON public.blog_post_stats;
CREATE POLICY "Admins can manage blog post stats" ON public.blog_post_stats
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 23. BLOG_POST_VIEWS TABLE
DROP POLICY IF EXISTS "Admins can manage all blog post views" ON public.blog_post_views;
CREATE POLICY "Admins can manage all blog post views" ON public.blog_post_views
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 24. NOTIFICATION_SETTINGS TABLE
DROP POLICY IF EXISTS "Admins can manage notification settings" ON public.notification_settings;
CREATE POLICY "Admins can manage notification settings" ON public.notification_settings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 25. PAYMENT_WALLET_ADDRESSES TABLE
DROP POLICY IF EXISTS "Admins can manage wallet addresses" ON public.payment_wallet_addresses;
CREATE POLICY "Admins can manage wallet addresses" ON public.payment_wallet_addresses
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 26. TABLE (generic table)
DROP POLICY IF EXISTS "Admins can manage all records" ON public.table;
CREATE POLICY "Admins can manage all records" ON public.table
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 27. QUOTES TABLE
DROP POLICY IF EXISTS "Admins can manage all quotes" ON public.quotes;
DROP POLICY IF EXISTS "quotes_admin_access" ON public.quotes;
CREATE POLICY "Admins can manage all quotes" ON public.quotes
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 28. SECURITY_AUDIT TABLE
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.security_audit;
CREATE POLICY "Admins can view audit logs" ON public.security_audit
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'::app_role));