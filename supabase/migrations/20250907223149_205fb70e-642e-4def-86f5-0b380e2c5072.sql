-- Create blog post views tracking table
CREATE TABLE public.blog_post_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  viewer_ip_hash TEXT NOT NULL,
  country_code TEXT,
  country_name TEXT,
  user_agent TEXT,
  referrer TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog post stats aggregation table
CREATE TABLE public.blog_post_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE UNIQUE,
  total_views INTEGER NOT NULL DEFAULT 0,
  unique_views INTEGER NOT NULL DEFAULT 0,
  country_stats JSONB NOT NULL DEFAULT '{}',
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_post_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_stats ENABLE ROW LEVEL SECURITY;

-- RLS policies for blog_post_views
CREATE POLICY "Admins can manage all blog post views"
  ON public.blog_post_views
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "System can insert blog post views"
  ON public.blog_post_views
  FOR INSERT
  WITH CHECK (true);

-- RLS policies for blog_post_stats  
CREATE POLICY "Anyone can view blog post stats"
  ON public.blog_post_stats
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage blog post stats"
  ON public.blog_post_stats
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

CREATE POLICY "System can update blog post stats"
  ON public.blog_post_stats
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update existing blog post stats"
  ON public.blog_post_stats
  FOR UPDATE
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_blog_post_views_post_id ON public.blog_post_views(blog_post_id);
CREATE INDEX idx_blog_post_views_created_at ON public.blog_post_views(created_at);
CREATE INDEX idx_blog_post_views_country ON public.blog_post_views(country_code);
CREATE INDEX idx_blog_post_stats_post_id ON public.blog_post_stats(blog_post_id);

-- Function to update blog post stats
CREATE OR REPLACE FUNCTION public.update_blog_post_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.blog_post_stats (blog_post_id, total_views, unique_views, country_stats)
  VALUES (
    NEW.blog_post_id,
    1,
    1,
    CASE 
      WHEN NEW.country_code IS NOT NULL THEN 
        jsonb_build_object(NEW.country_code, jsonb_build_object('count', 1, 'name', NEW.country_name))
      ELSE '{}'::jsonb
    END
  )
  ON CONFLICT (blog_post_id) DO UPDATE SET
    total_views = blog_post_stats.total_views + 1,
    unique_views = blog_post_stats.unique_views + 
      CASE WHEN EXISTS (
        SELECT 1 FROM public.blog_post_views 
        WHERE blog_post_id = NEW.blog_post_id 
        AND viewer_ip_hash = NEW.viewer_ip_hash
        AND created_at < NEW.created_at
      ) THEN 0 ELSE 1 END,
    country_stats = CASE 
      WHEN NEW.country_code IS NOT NULL THEN
        blog_post_stats.country_stats || 
        jsonb_build_object(
          NEW.country_code, 
          jsonb_build_object(
            'count', 
            COALESCE((blog_post_stats.country_stats->NEW.country_code->>'count')::integer, 0) + 1,
            'name',
            NEW.country_name
          )
        )
      ELSE blog_post_stats.country_stats
    END,
    last_updated = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to update stats
CREATE TRIGGER update_blog_post_stats_trigger
  AFTER INSERT ON public.blog_post_views
  FOR EACH ROW
  EXECUTE FUNCTION public.update_blog_post_stats();