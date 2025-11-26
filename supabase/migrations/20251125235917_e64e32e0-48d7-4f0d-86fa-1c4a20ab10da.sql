-- Create page_content_blocks table for storing editable page sections
CREATE TABLE public.page_content_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL,
  section_key TEXT NOT NULL,
  block_type TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(page_slug, section_key)
);

-- Create index for faster lookups
CREATE INDEX idx_page_content_blocks_page_slug ON public.page_content_blocks(page_slug);
CREATE INDEX idx_page_content_blocks_active ON public.page_content_blocks(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.page_content_blocks ENABLE ROW LEVEL SECURITY;

-- Anyone can view active blocks
CREATE POLICY "Anyone can view active content blocks"
  ON public.page_content_blocks
  FOR SELECT
  USING (is_active = true);

-- Admins can manage all blocks
CREATE POLICY "Admins can manage all content blocks"
  ON public.page_content_blocks
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Add trigger for updated_at
CREATE TRIGGER update_page_content_blocks_updated_at
  BEFORE UPDATE ON public.page_content_blocks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default blocks for homepage
INSERT INTO public.page_content_blocks (page_slug, section_key, block_type, content, order_index) VALUES
  ('home', 'hero', 'hero', '{"title": "Professional Refrigerant Solutions", "subtitle": "Industry-leading supplier of EPA-certified refrigerants", "buttonText": "Browse Products", "buttonLink": "/products"}', 0),
  ('home', 'features', 'features', '{"title": "Why Choose Us", "items": [{"icon": "Shield", "title": "EPA Certified", "description": "All products meet EPA standards"}, {"icon": "Truck", "title": "Fast Shipping", "description": "Quick delivery nationwide"}, {"icon": "Award", "title": "Quality Assured", "description": "Premium refrigerant solutions"}]}', 1),
  ('home', 'cta', 'cta', '{"title": "Need a Custom Quote?", "description": "Contact us for bulk orders and special pricing", "buttonText": "Get Quote", "buttonLink": "/contact"}', 2);