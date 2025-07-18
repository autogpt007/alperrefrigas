-- Add pricing structure columns to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS pallet_price numeric;
ALTER TABLE products ADD COLUMN IF NOT EXISTS container_20ft_price numeric;
ALTER TABLE products ADD COLUMN IF NOT EXISTS container_40ft_price numeric;
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_20ft numeric DEFAULT 0.30;
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_40ft numeric DEFAULT 0.45;

-- Add packaging_options column to store available packaging options
ALTER TABLE products ADD COLUMN IF NOT EXISTS packaging_options jsonb DEFAULT '["1 Pallet", "20ft Container", "40ft Container"]'::jsonb;

-- Create a function to calculate bulk pricing
CREATE OR REPLACE FUNCTION calculate_bulk_price(base_price numeric, package_type text)
RETURNS numeric AS $$
BEGIN
  CASE package_type
    WHEN '1 Pallet' THEN
      RETURN base_price;
    WHEN '20ft Container' THEN
      RETURN base_price * 0.70; -- 30% discount
    WHEN '40ft Container' THEN
      RETURN base_price * 0.55; -- 45% discount
    ELSE
      RETURN base_price;
  END CASE;
END;
$$ LANGUAGE plpgsql;