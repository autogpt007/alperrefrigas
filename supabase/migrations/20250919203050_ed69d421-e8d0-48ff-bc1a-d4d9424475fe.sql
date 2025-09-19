-- Ensure all accessories have proper packaging options
UPDATE products 
SET packaging_options = '["Individual", "5-Pack", "10-Pack"]'::jsonb
WHERE product_type = 'accessory' 
  AND (packaging_options IS NULL OR packaging_options = '[]'::jsonb OR packaging_options = '{}'::jsonb);

-- Ensure all refrigerants have proper packaging options
UPDATE products 
SET packaging_options = '["1 Pallet", "20ft Container", "40ft Container"]'::jsonb
WHERE product_type = 'refrigerant' 
  AND (packaging_options IS NULL OR packaging_options = '[]'::jsonb OR packaging_options = '{}'::jsonb);