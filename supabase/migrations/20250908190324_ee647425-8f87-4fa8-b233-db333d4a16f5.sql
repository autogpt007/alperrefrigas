-- Update site_settings RLS policy to require authentication for admin functions but allow public read
DROP POLICY IF EXISTS "Anyone can view site settings" ON site_settings;

CREATE POLICY "Public can view site settings" 
ON site_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage site settings" 
ON site_settings 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);