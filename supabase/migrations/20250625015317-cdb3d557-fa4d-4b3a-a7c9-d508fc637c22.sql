
-- Add missing columns to products table to support all frontend features
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS sku text,
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS brand text DEFAULT 'FrigidFlow',
ADD COLUMN IF NOT EXISTS condition text DEFAULT 'new',
ADD COLUMN IF NOT EXISTS availability text DEFAULT 'in_stock',
ADD COLUMN IF NOT EXISTS epa_approved boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS packaging jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS applications jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS technical_specs jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS sds_url text,
ADD COLUMN IF NOT EXISTS certificate_urls jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS gtin text,
ADD COLUMN IF NOT EXISTS shipping_weight text,
ADD COLUMN IF NOT EXISTS dimensions jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS chemical_formula text,
ADD COLUMN IF NOT EXISTS cas_number text,
ADD COLUMN IF NOT EXISTS un_number text,
ADD COLUMN IF NOT EXISTS hazard_class text;

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for certificates and SDS documents
INSERT INTO storage.buckets (id, name, public)  
VALUES ('product-documents', 'product-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for product images bucket
CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Create RLS policies for product documents bucket
CREATE POLICY "Anyone can view product documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-documents');

CREATE POLICY "Authenticated users can upload product documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update product documents"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete product documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-documents' AND auth.role() = 'authenticated');
