import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Settings, Save, Phone, Mail, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { adminSettingsSchema, sanitizeInput, RateLimiter, type AdminSettingsData } from '@/lib/validation';

interface NotificationSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  description: string;
}

interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  description: string;
}

const AdminSettings = () => {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    notificationEmail: '',
    whatsappNumber: '',
    mainPhone: ''
  });

  // Rate limiter for form submissions
  const rateLimiter = new RateLimiter(3, 60000); // 3 attempts per minute

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Use Supabase client instead of hardcoded credentials
      const { data: notifData, error: notifError } = await supabase
        .from('notification_settings')
        .select('*');

      const { data: siteData, error: siteError } = await supabase
        .from('site_settings')
        .select('*');

      if (notifError) throw notifError;
      if (siteError) throw siteError;

      setNotificationSettings(notifData || []);
      setSiteSettings(siteData || []);

      // Populate form data
      const emailSetting = notifData?.find((s: any) => s.setting_key === 'notification_email');
      const whatsappSetting = siteData?.find((s: any) => s.setting_key === 'whatsapp_number');
      const phoneSetting = siteData?.find((s: any) => s.setting_key === 'main_phone');

      setFormData({
        notificationEmail: emailSetting?.setting_value || '',
        whatsappNumber: whatsappSetting?.setting_value || '',
        mainPhone: phoneSetting?.setting_value || ''
      });
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load settings.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (table: 'notification_settings' | 'site_settings', key: string, value: string) => {
    try {
      const sanitizedValue = sanitizeInput(value);
      
      const { error } = await supabase
        .from(table)
        .update({ setting_value: sanitizedValue })
        .eq('setting_key', key);

      if (error) throw error;
    } catch (error) {
      console.error(`Error updating ${key}:`, error);
      throw error;
    }
  };

  const handleSaveSettings = async () => {
    // Check rate limiting
    if (!rateLimiter.canAttempt('admin-settings')) {
      const timeLeft = Math.ceil(rateLimiter.getTimeUntilReset('admin-settings') / 1000);
      toast({
        title: 'Too many attempts',
        description: `Please wait ${timeLeft} seconds before trying again.`,
        variant: 'destructive'
      });
      return;
    }

    // Validate form data
    try {
      const validatedData = adminSettingsSchema.parse(formData);
      setValidationErrors({});

      // Update settings
      await updateSetting('notification_settings', 'notification_email', validatedData.notificationEmail);
      await updateSetting('site_settings', 'whatsapp_number', validatedData.whatsappNumber);
      await updateSetting('site_settings', 'main_phone', validatedData.mainPhone);

      toast({
        title: 'Settings updated successfully!',
        description: 'All settings have been saved.'
      });

      fetchSettings(); // Refresh the data
    } catch (error: any) {
      if (error.errors) {
        // Zod validation errors
        const errors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          errors[err.path[0]] = err.message;
        });
        setValidationErrors(errors);
      } else {
        console.error('Error saving settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to save settings. Please try again.',
          variant: 'destructive'
        });
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: sanitizeInput(value)
    }));
  };

  if (loading) {
    return <div className="p-6 text-white">Loading settings...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Settings</h1>
        <p className="text-gray-300">Manage system-wide settings and configurations</p>
      </div>

      <div className="space-y-6">
        {/* Contact & Communication Settings */}
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact & Communication Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-gray-300 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Notification Email Address
              </Label>
              <Input
                type="email"
                value={formData.notificationEmail}
                onChange={(e) => handleInputChange('notificationEmail', e.target.value)}
                className={`bg-slate-700 border-slate-600 text-white mt-2 ${
                  validationErrors.notificationEmail ? 'border-red-500' : ''
                }`}
                placeholder="Enter email for notifications"
              />
              {validationErrors.notificationEmail && (
                <p className="text-red-400 text-sm mt-1">{validationErrors.notificationEmail}</p>
              )}
              <p className="text-sm text-gray-400 mt-1">
                Email address for receiving contact form submissions and order notifications
              </p>
            </div>

            <div>
              <Label className="text-gray-300 flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                WhatsApp Number
              </Label>
              <Input
                type="tel"
                value={formData.whatsappNumber}
                onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                className={`bg-slate-700 border-slate-600 text-white mt-2 ${
                  validationErrors.whatsappNumber ? 'border-red-500' : ''
                }`}
                placeholder="e.g., +18007347443"
              />
              {validationErrors.whatsappNumber && (
                <p className="text-red-400 text-sm mt-1">{validationErrors.whatsappNumber}</p>
              )}
              <p className="text-sm text-gray-400 mt-1">
                WhatsApp number for the floating chat button (include country code)
              </p>
            </div>

            <div>
              <Label className="text-gray-300 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Main Phone Number
              </Label>
              <Input
                type="tel"
                value={formData.mainPhone}
                onChange={(e) => handleInputChange('mainPhone', e.target.value)}
                className={`bg-slate-700 border-slate-600 text-white mt-2 ${
                  validationErrors.mainPhone ? 'border-red-500' : ''
                }`}
                placeholder="e.g., 1-800-REFRIGERANT"
              />
              {validationErrors.mainPhone && (
                <p className="text-red-400 text-sm mt-1">{validationErrors.mainPhone}</p>
              )}
              <p className="text-sm text-gray-400 mt-1">
                Primary business phone number displayed across the website
              </p>
            </div>

            <Button
              onClick={handleSaveSettings}
              className="w-full bg-cyan-500 hover:bg-cyan-600"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </CardContent>
        </Card>

        {/* Current Settings Display */}
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Current Settings Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-medium mb-3">Notification Settings</h4>
                <div className="space-y-2">
                  {notificationSettings.map((setting) => (
                    <div key={setting.id} className="bg-slate-700/50 p-3 rounded">
                      <div className="text-sm text-gray-300">{setting.description}</div>
                      <div className="text-white font-mono text-sm">{setting.setting_value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-3">Site Settings</h4>
                <div className="space-y-2">
                  {siteSettings.map((setting) => (
                    <div key={setting.id} className="bg-slate-700/50 p-3 rounded">
                      <div className="text-sm text-gray-300">{setting.description}</div>
                      <div className="text-white font-mono text-sm">{setting.setting_value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
