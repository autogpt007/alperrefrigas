-- Add phone number column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS phone text;