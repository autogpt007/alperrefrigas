-- Add payment information columns to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_details JSONB;

-- Update existing orders with default payment method
UPDATE public.orders SET payment_method = 'credit_card' WHERE payment_method IS NULL;