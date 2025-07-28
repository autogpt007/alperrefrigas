
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Settings, Phone, Mail, MapPin, Globe, Clock, Star, Save, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SiteSettings {
  id: string;
  company_name: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  business_hours: any;
  social_links: any;
  seo_settings: any;
}

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [editingSettings, setEditingSettings] = useState<Partial<SiteSettings>>({});

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch site settings from database
  const { data: siteSettings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      
      // Convert array of settings to object
      const settingsObj: any = {};
      data?.forEach(setting => {
        settingsObj[setting.setting_key] = setting.setting_value;
      });
      
      return settingsObj;
    }
  });

  // Mutation for saving settings
  const saveMutation = useMutation({
    mutationFn: async (settings: Record<string, any>) => {
      // Convert settings object to array of upsert operations
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        setting_key: key,
        setting_value: typeof value === 'object' ? JSON.stringify(value) : String(value),
        description: `Setting for ${key.replace(/_/g, ' ')}`
      }));

      const { error } = await supabase
        .from('site_settings')
        .upsert(settingsArray, { onConflict: 'setting_key' });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Settings saved successfully!",
        description: "Your changes have been applied and saved to the database."
      });
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      setEditingSettings({});
    },
    onError: (error: any) => {
      toast({
        title: "Failed to save settings",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Default settings fallback
  const defaultSettings = {
    company_name: 'Alper Refrigerants',
    tagline: 'Premium Refrigerants for Professional HVAC',
    description: 'Leading supplier of high-quality refrigerants and HVAC chemicals for professionals worldwide.',
    phone: '+1 (555) 123-4567',
    email: 'info@alperrefrigas.com',
    address: '123 Industrial Blvd, Houston, TX 77001',
    website: 'https://alperrefrigas.com',
    business_hours: JSON.stringify({
      monday: '8:00 AM - 6:00 PM',
      tuesday: '8:00 AM - 6:00 PM',
      wednesday: '8:00 AM - 6:00 PM',
      thursday: '8:00 AM - 6:00 PM',
      friday: '8:00 AM - 6:00 PM',
      saturday: '9:00 AM - 4:00 PM',
      sunday: 'Closed'
    }),
    social_links: JSON.stringify({
      facebook: 'https://facebook.com/frigidflow',
      twitter: 'https://twitter.com/frigidflow',
      linkedin: 'https://linkedin.com/company/frigidflow',
      youtube: 'https://youtube.com/frigidflow'
    }),
    seo_settings: JSON.stringify({
      meta_title: 'FrigidFlow - Premium Refrigerants & HVAC Chemicals',
      meta_description: 'Professional-grade refrigerants, EPA-approved chemicals, and HVAC supplies. Fast shipping, competitive prices, expert support.',
      keywords: 'refrigerants, HVAC, EPA approved, R-410A, R-134A, cooling chemicals'
    })
  };

  // Merge database settings with defaults
  const settings = { ...defaultSettings, ...siteSettings };

  // Parse JSON strings for nested objects
  const parsedSettings = {
    ...settings,
    business_hours: typeof settings.business_hours === 'string' 
      ? JSON.parse(settings.business_hours) 
      : settings.business_hours || JSON.parse(defaultSettings.business_hours),
    social_links: typeof settings.social_links === 'string' 
      ? JSON.parse(settings.social_links) 
      : settings.social_links || JSON.parse(defaultSettings.social_links),
    seo_settings: typeof settings.seo_settings === 'string' 
      ? JSON.parse(settings.seo_settings) 
      : settings.seo_settings || JSON.parse(defaultSettings.seo_settings)
  };

  const handleInputChange = (field: string, value: string | any) => {
    setEditingSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: string) => {
    setEditingSettings(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof SiteSettings] as any || parsedSettings[parent as keyof typeof parsedSettings] || {}),
        [field]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    const settingsToSave = { ...settings, ...editingSettings };
    saveMutation.mutate(settingsToSave);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Content Management</h1>
        <p className="text-gray-300">Manage website content, company information, and settings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="company">Company Info</TabsTrigger>
          <TabsTrigger value="contact">Contact Details</TabsTrigger>
          <TabsTrigger value="hours">Business Hours</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="seo">SEO Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="h-5 w-5 text-cyan-400" />
                Company Information
              </CardTitle>
              <CardDescription className="text-gray-300">
                Basic company details and branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Company Name</Label>
                <Input
                  value={editingSettings.company_name || parsedSettings.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label className="text-gray-300">Tagline</Label>
                <Input
                  value={editingSettings.tagline || parsedSettings.tagline}
                  onChange={(e) => handleInputChange('tagline', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label className="text-gray-300">Description</Label>
                <Textarea
                  value={editingSettings.description || parsedSettings.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={4}
                  disabled={isLoading}
                />
              </div>
              <Button 
                onClick={handleSaveSettings} 
                className="bg-cyan-500 hover:bg-cyan-600"
                disabled={isLoading || saveMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {saveMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Phone className="h-5 w-5 text-cyan-400" />
                Contact Information
              </CardTitle>
              <CardDescription className="text-gray-300">
                Contact details and address information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  value={editingSettings.phone || parsedSettings.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label className="text-gray-300 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  type="email"
                  value={editingSettings.email || parsedSettings.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label className="text-gray-300 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Business Address
                </Label>
                <Textarea
                  value={editingSettings.address || parsedSettings.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={3}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label className="text-gray-300 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Website URL
                </Label>
                <Input
                  value={editingSettings.website || parsedSettings.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  disabled={isLoading}
                />
              </div>
              <Button 
                onClick={handleSaveSettings} 
                className="bg-cyan-500 hover:bg-cyan-600"
                disabled={isLoading || saveMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {saveMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours">
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-cyan-400" />
                Business Hours
              </CardTitle>
              <CardDescription className="text-gray-300">
                Set your operating hours for each day of the week
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(parsedSettings.business_hours).map(([day, hours]) => (
                <div key={day} className="grid grid-cols-2 gap-4">
                  <Label className="text-gray-300 capitalize flex items-center">
                    {day}:
                  </Label>
                  <Input
                    value={editingSettings.business_hours?.[day] || hours}
                    onChange={(e) => handleNestedInputChange('business_hours', day, e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="e.g., 9:00 AM - 5:00 PM or Closed"
                    disabled={isLoading}
                  />
                </div>
              ))}
              <Button 
                onClick={handleSaveSettings} 
                className="bg-cyan-500 hover:bg-cyan-600"
                disabled={isLoading || saveMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {saveMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="h-5 w-5 text-cyan-400" />
                Social Media Links
              </CardTitle>
              <CardDescription className="text-gray-300">
                Manage your social media presence
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(parsedSettings.social_links).map(([platform, url]) => (
                <div key={platform}>
                  <Label className="text-gray-300 capitalize">{platform}</Label>
                  <Input
                    value={editingSettings.social_links?.[platform] || url}
                    onChange={(e) => handleNestedInputChange('social_links', platform, e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder={`Enter ${platform} URL`}
                    disabled={isLoading}
                  />
                </div>
              ))}
              <Button 
                onClick={handleSaveSettings} 
                className="bg-cyan-500 hover:bg-cyan-600"
                disabled={isLoading || saveMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {saveMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="h-5 w-5 text-cyan-400" />
                SEO Settings
              </CardTitle>
              <CardDescription className="text-gray-300">
                Search engine optimization settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Meta Title</Label>
                <Input
                  value={editingSettings.seo_settings?.meta_title || parsedSettings.seo_settings.meta_title}
                  onChange={(e) => handleNestedInputChange('seo_settings', 'meta_title', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label className="text-gray-300">Meta Description</Label>
                <Textarea
                  value={editingSettings.seo_settings?.meta_description || parsedSettings.seo_settings.meta_description}
                  onChange={(e) => handleNestedInputChange('seo_settings', 'meta_description', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={3}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label className="text-gray-300">Keywords</Label>
                <Input
                  value={editingSettings.seo_settings?.keywords || parsedSettings.seo_settings.keywords}
                  onChange={(e) => handleNestedInputChange('seo_settings', 'keywords', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Comma-separated keywords"
                  disabled={isLoading}
                />
              </div>
              <Button 
                onClick={handleSaveSettings} 
                className="bg-cyan-500 hover:bg-cyan-600"
                disabled={isLoading || saveMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {saveMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManagement;
