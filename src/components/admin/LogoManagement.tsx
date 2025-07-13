import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ui/image-upload';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Save, RotateCcw } from 'lucide-react';

interface LogoSettings {
  logo_url: string;
  company_name: string;
  company_tagline: string;
}

const LogoManagement = () => {
  const [settings, setSettings] = useState<LogoSettings>({
    logo_url: '',
    company_name: 'FrigidFlow',
    company_tagline: 'Refrigerant Solutions'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLogoSettings();
  }, []);

  const fetchLogoSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['logo_url', 'company_name', 'company_tagline']);

      if (error) throw error;

      const settingsMap = data?.reduce((acc, item) => {
        acc[item.setting_key] = item.setting_value;
        return acc;
      }, {} as Record<string, string>) || {};

      setSettings({
        logo_url: settingsMap.logo_url || '',
        company_name: settingsMap.company_name || 'FrigidFlow',
        company_tagline: settingsMap.company_tagline || 'Refrigerant Solutions'
      });
    } catch (error) {
      console.error('Error fetching logo settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const settingsToSave = [
        {
          setting_key: 'logo_url',
          setting_value: settings.logo_url,
          description: 'Company logo URL'
        },
        {
          setting_key: 'company_name',
          setting_value: settings.company_name,
          description: 'Company name displayed in header'
        },
        {
          setting_key: 'company_tagline',
          setting_value: settings.company_tagline,
          description: 'Company tagline displayed under logo'
        }
      ];

      const { error } = await supabase
        .from('site_settings')
        .upsert(settingsToSave, {
          onConflict: 'setting_key'
        });

      if (error) throw error;

      toast.success('Logo settings saved successfully');
    } catch (error) {
      console.error('Error saving logo settings:', error);
      toast.error('Failed to save logo settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setSettings({
      logo_url: '',
      company_name: 'FrigidFlow',
      company_tagline: 'Refrigerant Solutions'
    });
    toast.info('Settings reset to defaults');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Logo Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-lg">Loading logo settings...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logo & Branding Management</CardTitle>
        <CardDescription>
          Manage your company logo and branding elements. Logo will appear in the header and be clickable to return to homepage.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Logo Preview */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <Label className="text-sm font-medium mb-2 block">Current Logo Preview</Label>
          <div className="flex items-center space-x-4 p-4 bg-white rounded border">
            {settings.logo_url ? (
              <img 
                src={settings.logo_url} 
                alt="Company Logo" 
                className="h-12 w-auto object-contain"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {settings.company_name.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-gray-900">{settings.company_name}</h3>
              <p className="text-sm text-gray-600">{settings.company_tagline}</p>
            </div>
          </div>
        </div>

        {/* Logo Upload */}
        <div>
          <Label className="text-sm font-medium mb-2 block">
            Company Logo
            <span className="text-gray-500 font-normal ml-2">(Recommended: 200x60px, PNG/JPG format)</span>
          </Label>
          <ImageUpload
            onImageUploaded={(url) => setSettings(prev => ({ ...prev, logo_url: url }))}
            currentImage={settings.logo_url}
            bucket="images"
          />
          <p className="text-xs text-gray-500 mt-1">
            Upload a high-quality logo. It will be automatically resized for optimal display.
          </p>
        </div>

        {/* Company Name */}
        <div>
          <Label htmlFor="company_name">Company Name</Label>
          <Input
            id="company_name"
            value={settings.company_name}
            onChange={(e) => setSettings(prev => ({ ...prev, company_name: e.target.value }))}
            placeholder="Enter company name"
          />
        </div>

        {/* Company Tagline */}
        <div>
          <Label htmlFor="company_tagline">Company Tagline</Label>
          <Input
            id="company_tagline"
            value={settings.company_tagline}
            onChange={(e) => setSettings(prev => ({ ...prev, company_tagline: e.target.value }))}
            placeholder="Enter company tagline"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Default
          </Button>
        </div>

        {/* Usage Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Logo Usage Guidelines</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Logo appears in the website header and is clickable to return to homepage</li>
            <li>• Recommended size: 200x60 pixels for optimal display</li>
            <li>• Supports PNG (with transparency) and JPG formats</li>
            <li>• Will automatically scale to fit header height while maintaining aspect ratio</li>
            <li>• Changes take effect immediately after saving</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogoManagement;