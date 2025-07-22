import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Settings, Save, Phone, Mail, MessageCircle, CreditCard, Building2, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { adminSettingsSchema, sanitizeInput, RateLimiter, type AdminSettingsData } from '@/lib/validation';
import { ImageUpload } from '../ui/image-upload';

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
    mainPhone: '',
    // Payment settings
    bankWireInstructions: '',
    bankName: '',
    bankRoutingNumber: '',
    bankAccountNumber: '',
    bankSwiftCode: '',
    // Shipping settings
    freeShippingThreshold: ''
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
      
      // Payment settings
      const bankInstructionsSetting = siteData?.find((s: any) => s.setting_key === 'bank_wire_instructions');
      const bankNameSetting = siteData?.find((s: any) => s.setting_key === 'bank_name');
      const bankRoutingSetting = siteData?.find((s: any) => s.setting_key === 'bank_routing_number');
      const bankAccountSetting = siteData?.find((s: any) => s.setting_key === 'bank_account_number');
      const bankSwiftSetting = siteData?.find((s: any) => s.setting_key === 'bank_swift_code');
      const freeShippingSetting = siteData?.find((s: any) => s.setting_key === 'free_shipping_threshold');

      setFormData({
        notificationEmail: emailSetting?.setting_value || '',
        whatsappNumber: whatsappSetting?.setting_value || '',
        mainPhone: phoneSetting?.setting_value || '',
        bankWireInstructions: bankInstructionsSetting?.setting_value || '',
        bankName: bankNameSetting?.setting_value || '',
        bankRoutingNumber: bankRoutingSetting?.setting_value || '',
        bankAccountNumber: bankAccountSetting?.setting_value || '',
        bankSwiftCode: bankSwiftSetting?.setting_value || '',
        freeShippingThreshold: freeShippingSetting?.setting_value || '500'
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
      
      // Update payment settings
      await updateSetting('site_settings', 'bank_wire_instructions', validatedData.bankWireInstructions);
      await updateSetting('site_settings', 'bank_name', validatedData.bankName);
      await updateSetting('site_settings', 'bank_routing_number', validatedData.bankRoutingNumber);
      await updateSetting('site_settings', 'bank_account_number', validatedData.bankAccountNumber);
      await updateSetting('site_settings', 'bank_swift_code', validatedData.bankSwiftCode);
      await updateSetting('site_settings', 'free_shipping_threshold', validatedData.freeShippingThreshold);

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
    
    // Don't sanitize during typing - only sanitize on submit to preserve natural typing flow
    setFormData(prev => ({
      ...prev,
      [field]: value
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
                Email address for receiving contact form submissions and order notifications. This appears in the header.
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

            <div>
              <Label className="text-gray-300 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Alper Refrigerants Facility Image
              </Label>
              <ImageUpload
                label=""
                currentImage={siteSettings.find(s => s.setting_key === 'facility_image')?.setting_value}
                onImageUploaded={(url) => updateSetting('site_settings', 'facility_image', url)}
                onImageRemoved={() => updateSetting('site_settings', 'facility_image', '')}
                bucket="images"
                folder="facilities"
              />
              <p className="text-sm text-gray-400 mt-1">
                Image of the Alper Refrigerants facility displayed on the About Us page
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

        {/* Payment Settings */}
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-gray-300 flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Bank Wire Transfer Instructions
              </Label>
              <Textarea
                value={formData.bankWireInstructions}
                onChange={(e) => handleInputChange('bankWireInstructions', e.target.value)}
                className={`bg-slate-700 border-slate-600 text-white mt-2 min-h-20 ${
                  validationErrors.bankWireInstructions ? 'border-red-500' : ''
                }`}
                placeholder="Enter bank wire transfer instructions for customers"
              />
              {validationErrors.bankWireInstructions && (
                <p className="text-red-400 text-sm mt-1">{validationErrors.bankWireInstructions}</p>
              )}
              <p className="text-sm text-gray-400 mt-1">
                Instructions displayed to customers on the checkout page
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Bank Name
                </Label>
                <Input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                  className={`bg-slate-700 border-slate-600 text-white mt-2 ${
                    validationErrors.bankName ? 'border-red-500' : ''
                  }`}
                  placeholder="e.g., First National Bank"
                />
                {validationErrors.bankName && (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.bankName}</p>
                )}
              </div>

              <div>
                <Label className="text-gray-300">
                  Routing Number
                </Label>
                <Input
                  type="text"
                  value={formData.bankRoutingNumber}
                  onChange={(e) => handleInputChange('bankRoutingNumber', e.target.value)}
                  className={`bg-slate-700 border-slate-600 text-white mt-2 ${
                    validationErrors.bankRoutingNumber ? 'border-red-500' : ''
                  }`}
                  placeholder="9-digit routing number"
                  maxLength={9}
                />
                {validationErrors.bankRoutingNumber && (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.bankRoutingNumber}</p>
                )}
              </div>

              <div>
                <Label className="text-gray-300">
                  Account Number
                </Label>
                <Input
                  type="text"
                  value={formData.bankAccountNumber}
                  onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
                  className={`bg-slate-700 border-slate-600 text-white mt-2 ${
                    validationErrors.bankAccountNumber ? 'border-red-500' : ''
                  }`}
                  placeholder="Bank account number"
                />
                {validationErrors.bankAccountNumber && (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.bankAccountNumber}</p>
                )}
              </div>

              <div>
                <Label className="text-gray-300">
                  SWIFT Code
                </Label>
                <Input
                  type="text"
                  value={formData.bankSwiftCode}
                  onChange={(e) => handleInputChange('bankSwiftCode', e.target.value)}
                  className={`bg-slate-700 border-slate-600 text-white mt-2 ${
                    validationErrors.bankSwiftCode ? 'border-red-500' : ''
                  }`}
                  placeholder="e.g., FNBKUS33"
                  maxLength={11}
                />
                {validationErrors.bankSwiftCode && (
                  <p className="text-red-400 text-sm mt-1">{validationErrors.bankSwiftCode}</p>
                )}
                <p className="text-sm text-gray-400 mt-1">
                  For international wire transfers
                </p>
              </div>
            </div>
            
            <div>
              <Label className="text-gray-300 flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Free Shipping Threshold ($)
              </Label>
              <Input
                type="number"
                value={formData.freeShippingThreshold}
                onChange={(e) => handleInputChange('freeShippingThreshold', e.target.value)}
                className={`bg-slate-700 border-slate-600 text-white mt-2 ${
                  validationErrors.freeShippingThreshold ? 'border-red-500' : ''
                }`}
                placeholder="500"
                min="0"
                step="50"
              />
              {validationErrors.freeShippingThreshold && (
                <p className="text-red-400 text-sm mt-1">{validationErrors.freeShippingThreshold}</p>
              )}
              <p className="text-sm text-gray-400 mt-1">
                Minimum order amount for free shipping
              </p>
            </div>
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
