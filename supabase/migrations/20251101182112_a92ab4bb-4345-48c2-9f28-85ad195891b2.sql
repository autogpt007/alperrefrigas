-- 1) Ensure tawk_snippet key exists
INSERT INTO public.site_settings (setting_key, setting_value, description)
VALUES ('tawk_snippet', '', 'Full raw Tawk.to embed snippet as provided by Tawk')
ON CONFLICT (setting_key) DO NOTHING;

-- 2) Ensure tawk_enabled, tawk_property_id, tawk_widget_id exist
INSERT INTO public.site_settings (setting_key, setting_value, description) VALUES
('tawk_enabled', 'false', 'Enable/disable Tawk widget'),
('tawk_property_id', '', 'Parsed from snippet'),
('tawk_widget_id', '', 'Parsed from snippet')
ON CONFLICT (setting_key) DO NOTHING;

-- 3) Update main_phone to new number
INSERT INTO public.site_settings (setting_key, setting_value, description)
VALUES ('main_phone', '1-409-995-3623', 'Primary phone number displayed across the site')
ON CONFLICT (setting_key) DO UPDATE
SET setting_value = EXCLUDED.setting_value, updated_at = now();

-- 4) Drop and recreate RLS policy to allow public reads of Tawk settings
DROP POLICY IF EXISTS "Public can view safe site settings" ON public.site_settings;

CREATE POLICY "Public can view safe site settings"
ON public.site_settings
FOR SELECT
USING (
  setting_key = ANY (ARRAY[
    'logo_url',
    'company_name',
    'company_tagline',
    'header_email',
    'main_phone',
    'whatsapp_number',
    'free_shipping_threshold',
    'public_phone',
    'public_email',
    'public_address',
    'social_media_facebook',
    'social_media_linkedin',
    'social_media_twitter',
    'tawk_enabled',
    'tawk_property_id',
    'tawk_widget_id',
    'tawk_snippet'
  ])
);