-- Fix accessory packaging options to match our component expectations
UPDATE products 
SET packaging_options = '["Individual", "5-Pack", "10-Pack"]'::jsonb
WHERE product_type = 'accessory';