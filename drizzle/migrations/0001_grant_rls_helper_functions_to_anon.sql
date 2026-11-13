-- RLS helper functions are evaluated inside *_public_read policies, so the
-- anonymous (logged-out) role must be able to execute them. Without this, every
-- public read on tables like international_tax_rates, hero_images, certificates,
-- contact_info, blog_posts and adverts fails with "permission denied for function is_admin".
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon;