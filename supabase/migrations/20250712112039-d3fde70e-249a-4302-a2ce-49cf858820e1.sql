-- Create featured_products table to control which products appear in homepage sections
CREATE TABLE public.featured_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  section_name TEXT NOT NULL, -- 'homepage_inventory', 'featured', etc.
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, section_name)
);

-- Enable Row Level Security
ALTER TABLE public.featured_products ENABLE ROW LEVEL SECURITY;

-- Create policies for featured products
CREATE POLICY "Anyone can view active featured products" 
ON public.featured_products 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage featured products" 
ON public.featured_products 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_featured_products_updated_at
BEFORE UPDATE ON public.featured_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for better performance
CREATE INDEX idx_featured_products_section_active ON public.featured_products(section_name, is_active, order_index);

-- Insert some initial data for the homepage inventory section
INSERT INTO public.site_settings (setting_key, setting_value, description) VALUES
('homepage_inventory_title', 'Comprehensive Refrigerant Inventory', 'Title for the homepage inventory section'),
('homepage_inventory_description', 'Our comprehensive inventory includes next-generation low-GWP refrigerants that meet the most stringent EPA regulations and environmental standards.', 'Description for the homepage inventory section');