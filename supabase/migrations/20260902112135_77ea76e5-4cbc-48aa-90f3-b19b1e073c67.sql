INSERT INTO site_settings (setting_key, setting_value, description) VALUES
('tawk_enabled', 'true', 'Enable or disable the Tawk.to live chat widget'),
('tawk_property_id', '6a98061a25a20d3445a5b8c8', 'Tawk.to Property ID'),
('tawk_widget_id', '1k1gtfmct', 'Tawk.to Widget ID')
ON CONFLICT (setting_key) DO UPDATE
SET setting_value = EXCLUDED.setting_value,
    description = EXCLUDED.description,
    updated_at = timezone('utc'::text, now());