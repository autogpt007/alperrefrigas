-- Insert Tawk.to live chat settings into site_settings table
INSERT INTO site_settings (setting_key, setting_value, description) VALUES
('tawk_property_id', '68cdc5888fb9c3192a667d13', 'Tawk.to Property ID from your widget code'),
('tawk_widget_id', '1j5hsn7sj', 'Tawk.to Widget ID from your widget code'),
('tawk_enabled', 'false', 'Enable or disable the Tawk.to live chat widget')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  description = EXCLUDED.description,
  updated_at = now();