-- Add AC bulk pricing and Google Merchant fields to products table
-- These are minimal additions that reuse existing schema structure

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS q20_units integer DEFAULT NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS q40_units integer DEFAULT NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS mid_bulk_uplift_percent numeric DEFAULT 12;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS custom_uplift_5_19 numeric DEFAULT 35;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS custom_uplift_20_39 numeric DEFAULT 25;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS custom_uplift_40_half numeric DEFAULT 15;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS base_unit_price numeric DEFAULT NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS mpn text DEFAULT NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS google_product_category text DEFAULT NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS weight_kg numeric DEFAULT NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS length_cm numeric DEFAULT NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS width_cm numeric DEFAULT NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS height_cm numeric DEFAULT NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS identifier_exists boolean DEFAULT true;

-- Add comments for clarity
COMMENT ON COLUMN public.products.q20_units IS 'Number of units that fit in a 20ft container (required for AC products)';
COMMENT ON COLUMN public.products.q40_units IS 'Number of units that fit in a 40ft container (optional)';
COMMENT ON COLUMN public.products.mid_bulk_uplift_percent IS 'Percentage uplift for mid-bulk orders (default 12%)';
COMMENT ON COLUMN public.products.custom_uplift_5_19 IS 'Percentage uplift for 5-19 unit orders (default 35%)';
COMMENT ON COLUMN public.products.custom_uplift_20_39 IS 'Percentage uplift for 20-39 unit orders (default 25%)';
COMMENT ON COLUMN public.products.custom_uplift_40_half IS 'Percentage uplift for 40 to half-1 unit orders (default 15%)';
COMMENT ON COLUMN public.products.base_unit_price IS 'Base full-container unit price for AC products';
COMMENT ON COLUMN public.products.mpn IS 'Manufacturer Part Number for Google Merchant';
COMMENT ON COLUMN public.products.google_product_category IS 'Google product category taxonomy ID';
COMMENT ON COLUMN public.products.identifier_exists IS 'False if no GTIN/MPN available (Google Merchant)';