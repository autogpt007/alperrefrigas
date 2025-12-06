-- Add admin policy to profiles table for complete access control
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Add explicit block for INSERT on profiles (should only come from trigger)
CREATE POLICY "profiles_no_direct_insert"
ON public.profiles
FOR INSERT
WITH CHECK (false);

-- Block DELETE on profiles (users shouldn't delete their own profile)
CREATE POLICY "profiles_no_delete"
ON public.profiles
FOR DELETE
USING (false);