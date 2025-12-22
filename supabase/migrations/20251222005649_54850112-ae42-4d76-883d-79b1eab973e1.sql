-- Step 1: Add AC variant configuration fields to products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS btu integer,
ADD COLUMN IF NOT EXISTS ac_type text,
ADD COLUMN IF NOT EXISTS voltage text,
ADD COLUMN IF NOT EXISTS frequency text,
ADD COLUMN IF NOT EXISTS plug_type text,
ADD COLUMN IF NOT EXISTS phase text DEFAULT '1-Phase',
ADD COLUMN IF NOT EXISTS refrigerant_type text,
ADD COLUMN IF NOT EXISTS max_room_size text,
ADD COLUMN IF NOT EXISTS efficiency_label text,
ADD COLUMN IF NOT EXISTS comes_with_base jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS comes_with_accessories jsonb DEFAULT '[]'::jsonb;

-- Add configuration_json to order_items to persist buyer selections
ALTER TABLE public.order_items
ADD COLUMN IF NOT EXISTS configuration_json jsonb;

-- Add comments for clarity
COMMENT ON COLUMN public.products.btu IS 'BTU rating for AC units (e.g., 9000, 12000, 18000, 24000)';
COMMENT ON COLUMN public.products.ac_type IS 'AC type: Mini-Split, Window, or Portable';
COMMENT ON COLUMN public.products.voltage IS 'Voltage: 110-120V or 220-240V';
COMMENT ON COLUMN public.products.frequency IS 'Frequency: 50Hz, 60Hz, or 50/60Hz';
COMMENT ON COLUMN public.products.plug_type IS 'Plug type: US (Type A/B), EU (Type C/F), UK (Type G), Universal';
COMMENT ON COLUMN public.products.phase IS 'Phase: 1-Phase or 3-Phase';
COMMENT ON COLUMN public.products.comes_with_base IS 'JSON array of items included with base unit';
COMMENT ON COLUMN public.products.comes_with_accessories IS 'JSON array of optional accessory items';
COMMENT ON COLUMN public.order_items.configuration_json IS 'Stores buyer AC configuration: btu, voltage, plug_type, accessories_mode, selected options';