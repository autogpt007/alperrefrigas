
-- 1. Pin search_path on trigger function
ALTER FUNCTION public.log_sensitive_data_access() SET search_path = public;

-- 2. Revoke EXECUTE on definer functions that should not be callable via PostgREST
REVOKE EXECUTE ON FUNCTION public.assign_user_role(uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_db_health() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_order_number() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_quote_number() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_order_number() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_quote_number() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_sensitive_data_access() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_blog_post_stats() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.calculate_bulk_price(numeric, text) FROM PUBLIC, anon, authenticated;

-- 3. Restrict images bucket uploads to user's own folder
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
CREATE POLICY "Users can upload to their own folder in images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Prevent listing of public buckets (direct public URLs still work via CDN)
DROP POLICY IF EXISTS "Anyone can view images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view product documents" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view team photos" ON storage.objects;

-- 5. Explicit restrictive deny for non-admin reads on sensitive tables
CREATE POLICY "Restrict newsletter reads to admins"
ON public.newsletter_subscribers
AS RESTRICTIVE FOR SELECT TO anon, authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Restrict notification settings reads to admins"
ON public.notification_settings
AS RESTRICTIVE FOR SELECT TO anon, authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Restrict blog post views reads to admins"
ON public.blog_post_views
AS RESTRICTIVE FOR SELECT TO anon, authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
