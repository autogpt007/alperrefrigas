
-- Remove overly permissive INSERT/UPDATE policies on blog_post_stats and blog_post_views
-- The track-blog-view edge function uses service role key, so these public policies are unnecessary

DROP POLICY "System can update blog post stats" ON public.blog_post_stats;
DROP POLICY "System can update existing blog post stats" ON public.blog_post_stats;
DROP POLICY "System can insert blog post views" ON public.blog_post_views;
