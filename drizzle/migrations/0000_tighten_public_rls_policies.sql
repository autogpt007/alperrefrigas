DROP POLICY IF EXISTS team_members_public_read ON public.team_members;
CREATE POLICY team_members_public_read ON public.team_members FOR SELECT USING (length(btrim(name)) > 0 AND length(btrim(position)) > 0 OR public.is_admin());

DROP POLICY IF EXISTS adverts_public_read ON public.adverts;
CREATE POLICY adverts_public_read ON public.adverts FOR SELECT USING ((is_active AND (start_date IS NULL OR start_date <= now()) AND (end_date IS NULL OR end_date >= now())) OR public.is_admin());

DROP POLICY IF EXISTS contact_info_public_read ON public.contact_info;
CREATE POLICY contact_info_public_read ON public.contact_info FOR SELECT USING (coalesce(is_active, false) OR public.is_admin());

DROP POLICY IF EXISTS exchange_rates_public_read ON public.exchange_rates;
CREATE POLICY exchange_rates_public_read ON public.exchange_rates FOR SELECT USING (coalesce(is_active, true) OR public.is_admin());

DROP POLICY IF EXISTS blog_posts_public_read ON public.blog_posts;
CREATE POLICY blog_posts_public_read ON public.blog_posts FOR SELECT USING (coalesce(published, false) OR public.is_admin());

DROP POLICY IF EXISTS blog_post_stats_public_read ON public.blog_post_stats;
CREATE POLICY blog_post_stats_public_read ON public.blog_post_stats FOR SELECT USING (EXISTS (SELECT 1 FROM public.blog_posts p WHERE p.id = blog_post_id AND coalesce(p.published, false)) OR public.is_admin());

DROP POLICY IF EXISTS mining_stats_public_read ON public.mining_stats;
CREATE POLICY mining_stats_public_read ON public.mining_stats FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS asic_miners_public_read ON public.asic_miners;
CREATE POLICY asic_miners_public_read ON public.asic_miners FOR SELECT USING (status <> 'inactive' OR public.is_admin());

DROP POLICY IF EXISTS blog_post_views_public_insert ON public.blog_post_views;
CREATE POLICY blog_post_views_public_insert ON public.blog_post_views FOR INSERT WITH CHECK (
  (user_id IS NULL OR user_id = auth.uid())
  AND length(viewer_ip_hash) BETWEEN 8 AND 128
  AND EXISTS (SELECT 1 FROM public.blog_posts p WHERE p.id = blog_post_id AND coalesce(p.published, false)));

DROP POLICY IF EXISTS hero_images_public_read ON public.hero_images;
CREATE POLICY hero_images_public_read ON public.hero_images FOR SELECT USING (coalesce(is_active, true) OR public.is_admin());

DROP POLICY IF EXISTS newsletter_subscribers_public_insert ON public.newsletter_subscribers;
CREATE POLICY newsletter_subscribers_public_insert ON public.newsletter_subscribers FOR INSERT WITH CHECK (
  length(email) <= 255 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND (name IS NULL OR length(name) <= 100));

DROP POLICY IF EXISTS featured_products_public_read ON public.featured_products;
CREATE POLICY featured_products_public_read ON public.featured_products FOR SELECT USING (is_active OR public.is_admin());

DROP POLICY IF EXISTS international_tax_rates_public_read ON public.international_tax_rates;
CREATE POLICY international_tax_rates_public_read ON public.international_tax_rates FOR SELECT USING (coalesce(is_active, true) OR public.is_admin());

DROP POLICY IF EXISTS testimonials_public_read ON public.testimonials;
CREATE POLICY testimonials_public_read ON public.testimonials FOR SELECT USING (coalesce(approved, false) OR public.is_admin());

DROP POLICY IF EXISTS certificates_public_read ON public.certificates;
CREATE POLICY certificates_public_read ON public.certificates FOR SELECT USING (is_active OR public.is_admin());

DROP POLICY IF EXISTS notification_settings_public_read ON public.notification_settings;
CREATE POLICY notification_settings_public_read ON public.notification_settings FOR SELECT TO authenticated USING (public.is_admin());