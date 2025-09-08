-- Fix FrigidFlow branding to proper Alper branding
UPDATE site_settings 
SET setting_value = 'info@alperrefrigas.com' 
WHERE setting_key = 'notification_email';

UPDATE site_settings 
SET setting_value = 'https://twitter.com/alperrefrigas' 
WHERE setting_key = 'twitter_url';

UPDATE site_settings 
SET setting_value = 'https://linkedin.com/company/alper-refrigerants' 
WHERE setting_key = 'linkedin_url';

UPDATE site_settings 
SET setting_value = 'https://youtube.com/@alperrefrigerants' 
WHERE setting_key = 'youtube_url';