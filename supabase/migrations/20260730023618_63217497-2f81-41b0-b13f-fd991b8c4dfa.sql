UPDATE public.site_settings
SET setting_value = replace(setting_value, 'alperrefrigas.com', 'alperrefrigerants.com'),
    updated_at = now()
WHERE setting_value ILIKE '%alperrefrigas.com%';

UPDATE public.site_settings
SET setting_value = 'https://alperrefrigerants.com',
    updated_at = now()
WHERE setting_key = 'website';