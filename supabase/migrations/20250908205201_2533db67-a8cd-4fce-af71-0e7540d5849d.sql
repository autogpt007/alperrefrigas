-- Fix admin panel loading by inserting missing profile for authenticated user
-- This will create a profile for the current authenticated user with admin role

INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  '5a5d0989-8ccb-4bd9-807c-a19afda56d3b'::uuid as id,
  'eddy3597@gmail.com' as email,
  'Admin User' as full_name,
  'admin' as role
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = '5a5d0989-8ccb-4bd9-807c-a19afda56d3b'::uuid
);