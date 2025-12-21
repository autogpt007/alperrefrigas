-- Update user role to admin
UPDATE public.user_roles 
SET role = 'admin', updated_at = now()
WHERE user_id = '409fcced-bc1e-42eb-99f7-3717059319cf';