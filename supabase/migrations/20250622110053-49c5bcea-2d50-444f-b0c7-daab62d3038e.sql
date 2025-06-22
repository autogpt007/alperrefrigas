
-- Create order_items table to store individual items in each order
CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL,
  product_id uuid REFERENCES public.products(id),
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  price numeric NOT NULL,
  sku text,
  packaging text,
  epa_approved boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Add user_id to orders table for proper user association
ALTER TABLE public.orders 
ADD COLUMN user_id uuid REFERENCES auth.users(id);

-- Add order_number column for better tracking
ALTER TABLE public.orders 
ADD COLUMN order_number text UNIQUE;

-- Add shipping information columns
ALTER TABLE public.orders 
ADD COLUMN shipping_address jsonb,
ADD COLUMN shipping_cost numeric DEFAULT 0,
ADD COLUMN tax_amount numeric DEFAULT 0,
ADD COLUMN tracking_number text,
ADD COLUMN notes text;

-- Enable RLS on orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Enable RLS on order_items table  
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for orders
CREATE POLICY "Users can view their own orders" 
  ON public.orders 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" 
  ON public.orders 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" 
  ON public.orders 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for order_items
CREATE POLICY "Users can view their order items" 
  ON public.order_items 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for their orders" 
  ON public.order_items 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Create function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  new_number text;
  counter integer;
BEGIN
  -- Get current date in YYYYMMDD format
  SELECT 'ORD-' || to_char(now(), 'YYYYMMDD') || '-' || LPAD((
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 'ORD-\d{8}-(\d+)$') AS integer)), 0) + 1
    FROM orders 
    WHERE order_number ~ ('^ORD-' || to_char(now(), 'YYYYMMDD') || '-\d+$')
  )::text, 4, '0') INTO new_number;
  
  RETURN new_number;
END;
$$;

-- Create trigger to auto-generate order numbers
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Add foreign key constraint for order_items
ALTER TABLE public.order_items 
ADD CONSTRAINT fk_order_items_order_id 
FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;
