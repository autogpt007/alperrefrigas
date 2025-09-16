-- Fix site_settings table to restrict public access to sensitive settings
DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated users can manage site settings" ON public.site_settings;

-- Only allow public access to specific non-sensitive settings
CREATE POLICY "Public can view safe site settings" 
ON public.site_settings 
FOR SELECT 
USING (
  setting_key IN (
    'company_name', 
    'company_description', 
    'business_hours', 
    'timezone', 
    'currency',
    'language',
    'free_shipping_threshold',
    'social_media_facebook',
    'social_media_linkedin',
    'social_media_twitter',
    'public_phone',
    'public_email',
    'public_address'
  )
);

-- Admin-only access for all operations and sensitive settings
CREATE POLICY "Admins can manage all site settings" 
ON public.site_settings 
FOR ALL 
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);