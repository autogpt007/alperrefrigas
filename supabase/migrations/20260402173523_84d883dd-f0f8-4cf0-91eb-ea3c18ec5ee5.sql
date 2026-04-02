UPDATE products
SET packaging_options = '["1-10 Pallets", "10-20 Pallets", "20ft Container", "40ft Container", "Truck Load (53ft)"]'::jsonb
WHERE product_type = 'refrigerant';

-- Update the calculate_bulk_price function
CREATE OR REPLACE FUNCTION public.calculate_bulk_price(base_price numeric, package_type text)
RETURNS numeric
LANGUAGE plpgsql
AS $$
BEGIN
  CASE package_type
    WHEN '1-10 Pallets' THEN RETURN (base_price + 20) * 40;
    WHEN '10-20 Pallets' THEN RETURN (base_price + 15) * 40;
    WHEN '20ft Container' THEN RETURN base_price * 1120;
    WHEN '40ft Container' THEN RETURN base_price * 2240;
    WHEN 'Truck Load (53ft)' THEN RETURN base_price * 1760;
    ELSE RETURN base_price * 40;
  END CASE;
END;
$$;