-- Create shipping_zones table for managing shipping rates by region
CREATE TABLE public.shipping_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region_name text NOT NULL,
  countries text[] NOT NULL DEFAULT '{}',
  base_rate numeric NOT NULL DEFAULT 0,
  free_shipping_threshold numeric DEFAULT 500,
  transit_days_min integer NOT NULL DEFAULT 3,
  transit_days_max integer NOT NULL DEFAULT 7,
  is_active boolean DEFAULT true,
  hazmat_surcharge numeric DEFAULT 25,
  order_index integer DEFAULT 0,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage shipping zones"
ON public.shipping_zones
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view active shipping zones"
ON public.shipping_zones
FOR SELECT
USING (is_active = true);

-- Create updated_at trigger
CREATE TRIGGER update_shipping_zones_updated_at
  BEFORE UPDATE ON public.shipping_zones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default shipping zones
INSERT INTO public.shipping_zones (region_name, countries, base_rate, free_shipping_threshold, transit_days_min, transit_days_max, hazmat_surcharge, order_index) VALUES
('United States (Continental)', ARRAY['US'], 45.00, 500, 3, 5, 25, 1),
('United States (Alaska & Hawaii)', ARRAY['US-AK', 'US-HI'], 89.00, 1000, 5, 10, 45, 2),
('Canada', ARRAY['CA'], 75.00, 750, 5, 10, 35, 3),
('United Kingdom', ARRAY['GB'], 120.00, 1000, 7, 14, 50, 4),
('European Union', ARRAY['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'PT', 'PL', 'SE', 'DK', 'FI', 'IE', 'CZ', 'RO', 'HU', 'SK', 'BG', 'HR', 'SI', 'LT', 'LV', 'EE', 'CY', 'LU', 'MT', 'GR'], 150.00, 1500, 7, 14, 60, 5),
('Australia & New Zealand', ARRAY['AU', 'NZ'], 180.00, 2000, 10, 21, 75, 6),
('Rest of World', ARRAY['*'], 250.00, 3000, 14, 28, 100, 7);