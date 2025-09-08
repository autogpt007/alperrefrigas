-- Update RLS policy to allow public access to site settings
DROP POLICY IF EXISTS "Authenticated users can view site settings" ON site_settings;

CREATE POLICY "Anyone can view site settings" 
ON site_settings 
FOR SELECT 
USING (true);

-- Also update the favicon in index.html
-- Update the favicon URL in the head
UPDATE site_settings 
SET setting_value = 'https://ohfkcxwwvksrjymkgloo.supabase.co/storage/v1/object/public/images/uploads/1753393740451-gnjjoxxor3.png'
WHERE setting_key = 'favicon_url';