-- Add some initial featured products to the homepage inventory section
-- First get some product IDs to work with
INSERT INTO public.featured_products (product_id, section_name, order_index, is_active)
SELECT 
  p.id,
  'homepage_inventory',
  ROW_NUMBER() OVER (ORDER BY p.name) - 1 as order_index,
  true
FROM public.products p
WHERE p.name IN (
  'R-410A Refrigerant 25LB',
  'R-134A Refrigerant 30LB', 
  'R-22 Refrigerant 30LB',
  'R-404A Refrigerant 24LB',
  'R-507A Refrigerant 25LB',
  'R-513A Refrigerant 30LB'
)
LIMIT 6;