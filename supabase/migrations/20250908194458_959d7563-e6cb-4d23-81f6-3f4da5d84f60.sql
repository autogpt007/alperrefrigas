-- Update RLS policy to allow guest orders
DROP POLICY IF EXISTS "Authenticated users can create orders" ON orders;

-- Create new policy that allows both authenticated users and guest orders
CREATE POLICY "Users and guests can create orders" 
ON orders 
FOR INSERT 
WITH CHECK (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR  -- Authenticated users
  (user_id IS NULL)                                      -- Guest orders
);