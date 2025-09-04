-- Add product_type column to existing products table
ALTER TABLE public.products ADD COLUMN product_type TEXT DEFAULT 'refrigerant' NOT NULL;

-- Create check constraint for product_type
ALTER TABLE public.products ADD CONSTRAINT products_product_type_check 
CHECK (product_type IN ('refrigerant', 'accessory'));

-- Update existing products to be refrigerants
UPDATE public.products SET product_type = 'refrigerant' WHERE product_type IS NULL;

-- Add index for better performance when filtering by product type
CREATE INDEX idx_products_product_type ON public.products(product_type);

-- Add index for product_type and category combination
CREATE INDEX idx_products_type_category ON public.products(product_type, category);

-- Create trigger to update the updated_at column for products
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();