# Tawk.to Live Chat Setup

## Initial Database Setup

Run the following SQL in your Supabase SQL Editor to initialize the Tawk.to settings:

```sql
-- Insert Tawk.to settings into site_settings table
INSERT INTO site_settings (setting_key, setting_value, description) VALUES
('tawk_property_id', '', 'Tawk.to Property ID from your widget code'),
('tawk_widget_id', '', 'Tawk.to Widget ID from your widget code'),
('tawk_enabled', 'false', 'Enable or disable the Tawk.to live chat widget')
ON CONFLICT (setting_key) DO NOTHING;
```

## How to Configure Tawk.to

1. **Get Your Tawk.to Account**
   - Sign up at [tawk.to](https://www.tawk.to/) if you don't have an account
   - Create a new property or use an existing one

2. **Find Your Widget Code**
   - Go to: Administration → Channels → Chat Widget
   - Look for your embed code that looks like:
     ```
     https://embed.tawk.to/PROPERTY_ID/WIDGET_ID
     ```
   - Extract the two IDs from the URL

3. **Configure in Admin Panel**
   - Navigate to: Admin Dashboard → Settings
   - Scroll to "Live Chat Settings (Tawk.to)"
   - Paste your Property ID (e.g., `68cdc5888fb9c3192a667d13`)
   - Paste your Widget ID (e.g., `1j5hsn7sj`)
   - Toggle "Enable Live Chat Widget" to ON
   - Click "Save Settings"

4. **Verify Installation**
   - Visit your website
   - The Tawk.to chat widget should appear in the bottom-right corner
   - Test by sending a message

## Features

✅ **Database-Driven Configuration**: No code changes needed to update settings
✅ **Easy Toggle**: Enable/disable chat widget instantly from admin panel
✅ **Dynamic Loading**: Widget only loads when enabled
✅ **Secure**: Settings stored in database, not exposed in frontend code
✅ **Multiple Environments**: Use different Tawk.to properties for staging/production

## Troubleshooting

- **Widget not appearing**: Check that `tawk_enabled` is set to `true` in the admin panel
- **Wrong widget loading**: Verify Property ID and Widget ID match your Tawk.to dashboard
- **Console errors**: Check browser console for error messages from Tawk.to script
