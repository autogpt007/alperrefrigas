-- Add missing triggers for orders table
-- Create trigger for order number generation
CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Create trigger for updated_at timestamp
CREATE TRIGGER trigger_update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

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