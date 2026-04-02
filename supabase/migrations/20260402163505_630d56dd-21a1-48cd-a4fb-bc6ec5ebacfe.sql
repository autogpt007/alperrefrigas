
-- Step 1: Reduce all refrigerant product prices by $10
UPDATE public.products
SET price = price - 10,
    updated_at = now()
WHERE product_type = 'refrigerant';

-- Step 2: Update packaging_options to new 5-tier system
UPDATE public.products
SET packaging_options = '["1-5 Pallets", "5-10 Pallets", "20ft Container", "40ft Container", "Truck Load (53ft)"]'::jsonb,
    updated_at = now()
WHERE product_type = 'refrigerant';

-- Step 3: Clear discount columns (no longer used)
UPDATE public.products
SET discount_20ft = NULL,
    discount_40ft = NULL,
    updated_at = now()
WHERE product_type = 'refrigerant';

-- Step 4: Update the calculate_bulk_price function for new tier logic
CREATE OR REPLACE FUNCTION public.calculate_bulk_price(base_price numeric, package_type text)
 RETURNS numeric
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  CASE package_type
    WHEN '1-5 Pallets' THEN
      RETURN base_price + 20;
    WHEN '5-10 Pallets' THEN
      RETURN base_price + 15;
    WHEN '20ft Container' THEN
      RETURN base_price;
    WHEN '40ft Container' THEN
      RETURN base_price;
    WHEN 'Truck Load (53ft)' THEN
      RETURN base_price;
    ELSE
      RETURN base_price + 20;
  END CASE;
END;
$function$;
