-- Drop the existing check constraint and add a new one that includes air_conditioner
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_product_type_check;

ALTER TABLE public.products ADD CONSTRAINT products_product_type_check 
CHECK (product_type IN ('refrigerant', 'accessory', 'air_conditioner'));