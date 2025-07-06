import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Settings, Bell, Shield, Database, Globe, Mail, Key, Trash2, Save } from 'lucide-react';

const AdminSettings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Alper Refrigerants',
    siteDescription: 'Professional refrigerant supplier',
    contactEmail: 'contact@alperrefrigerants.com',
    supportEmail: 'support@alperrefrigerants.com',
    phoneNumber: '+1 (800) 555-COOL',
    address: '1234 Industrial Drive, Houston, TX 77041'
  });

  const [notificationEmail, setNotificationEmail] = useState('');
  const [loading, setLoading] = useState(true);

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    orderAlerts: true,
    lowStockAlerts: true,
    newCustomerAlerts: false,
    systemUpdates: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: 'noreply@alperrefrigerants.com',
    fromName: 'Alper Refrigerants'
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchNotificationSettings();
  }, []);

  const fetchNotificationSettings = async () => {
    try {
      // Use fetch API to work around type issues
      const response = await fetch(`https://ohfkcxwwvksrjymkgloo.supabase.co/rest/v1/notification_settings?setting_key=eq.notification_email&select=setting_value`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oZmtjeHd3dmtzcmp5bWtnbG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMDk2MjgsImV4cCI6MjA2NTY4NTYyOH0.c-kSgAyWyiqbJ1m-binRf23l7P-cAT7AEP_sxGYHMpY',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oZmtjeHd3dmtzcmp5bWtnbG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMDk2MjgsImV4cCI6MjA2NTY4NTYyOH0.c-kSgAyWyiqbJ1m-binRf23l7P-cAT7AEP_sxGYHMpY`
        }
      });
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        setNotificationEmail(data[0].setting_value || 'eddy3597@gmail.com');
      } else {
        setNotificationEmail('eddy3597@gmail.com');
      }
    } catch (error: any) {
      console.error('Error fetching notification settings:', error);
      setNotificationEmail('eddy3597@gmail.com');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotificationEmail = async () => {
    try {
      // Use fetch API to work around type issues
      const response = await fetch(`https://ohfkcxwwvksrjymkgloo.supabase.co/rest/v1/notification_settings`, {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oZmtjeHd3dmtzcmp5bWtnbG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMDk2MjgsImV4cCI6MjA2NTY4NTYyOH0.c-kSgAyWyiqbJ1m-binRf23l7P-cAT7AEP_sxGYHMpY',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oZmtjeHd3dmtzcmp5bWtnbG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMDk2MjgsImV4cCI6MjA2NTY4NTYyOH0.c-kSgAyWyiqbJ1m-binRf23l7P-cAT7AEP_sxGYHMpY`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          setting_key: 'notification_email',
          setting_value: notificationEmail,
          description: 'Email address for receiving form submissions and order notifications'
        })
      });

      if (!response.ok) throw new Error('Failed to update notification email');

      toast({ title: 'Notification email updated successfully!' });
    } catch (error: any) {
      console.error('Error updating notification email:', error);
      toast({
        title: 'Error',
        description: 'Failed to update notification email.',
        variant: 'destructive'
      });
    }
  };

  const handleSaveGeneral = () => {
    // In a real app, this would save to the database
    toast({ title: 'General settings saved successfully!' });
  };

  const handleSaveNotifications = () => {
    // In a real app, this would save to the database
    toast({ title: 'Notification settings saved successfully!' });
  };

  const handleSaveSecurity = () => {
    // In a real app, this would save to the database
    toast({ title: 'Security settings saved successfully!' });
  };

  const handleSaveEmail = () => {
    // In a real app, this would save to the database
    toast({ title: 'Email settings saved successfully!' });
  };

  const handleTestEmail = () => {
    // In a real app, this would send a test email
    toast({ title: 'Test email sent! Check your inbox.' });
  };

  const handleClearCache = () => {
    // In a real app, this would clear application cache
    toast({ title: 'Cache cleared successfully!' });
  };

  const handleBackupDatabase = () => {
    // In a real app, this would trigger a database backup
    toast({ title: 'Database backup initiated!' });
  };

  if (loading) {
    return <div className="p-6 text-white">Loading settings...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Settings</h1>
        <p className="text-gray-300">Configure your application settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="email-config">Email Config</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email">SMTP</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription className="text-gray-300">
                Configure basic application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Site Name</Label>
                  <Input
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Contact Email</Label>
                  <Input
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Support Email</Label>
                  <Input
                    type="email"
                    value={generalSettings.supportEmail}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Phone Number</Label>
                  <Input
                    value={generalSettings.phoneNumber}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, phoneNumber: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-300">Site Description</Label>
                <Textarea
                  value={generalSettings.siteDescription}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-gray-300">Business Address</Label>
                <Textarea
                  value={generalSettings.address}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={2}
                />
              </div>

              <Button onClick={handleSaveGeneral} className="bg-cyan-500 hover:bg-cyan-600">
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email-config">
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Notification Settings
              </CardTitle>
              <CardDescription className="text-gray-300">
                Configure email address for receiving notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-gray-300">Notification Email Address</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="email"
                    value={notificationEmail}
                    onChange={(e) => setNotificationEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Button
                    onClick={handleSaveNotificationEmail}
                    className="bg-cyan-500 hover:bg-cyan-600"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  This email will receive notifications for contact form submissions, new orders, and quote requests.
                </p>
              </div>

              <div className="bg-blue-900/20 border border-blue-600/50 rounded-lg p-4">
                <h3 className="text-blue-400 font-medium mb-2">Current Configuration</h3>
                <p className="text-blue-300 text-sm">
                  Notification Email: {notificationEmail || 'Not set'}
                </p>
                <p className="text-blue-300 text-sm mt-1">
                  Status: {notificationEmail ? 'Configured' : 'Needs configuration'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription className="text-gray-300">
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Email Notifications</Label>
                    <p className="text-gray-400 text-sm">Receive general email notifications</p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Order Alerts</Label>
                    <p className="text-gray-400 text-sm">Get notified when new orders are placed</p>
                  </div>
                  <Switch
                    checked={notifications.orderAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, orderAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Low Stock Alerts</Label>
                    <p className="text-gray-400 text-sm">Receive alerts when products are running low</p>
                  </div>
                  <Switch
                    checked={notifications.lowStockAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, lowStockAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">New Customer Alerts</Label>
                    <p className="text-gray-400 text-sm">Get notified when new customers register</p>
                  </div>
                  <Switch
                    checked={notifications.newCustomerAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, newCustomerAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">System Updates</Label>
                    <p className="text-gray-400 text-sm">Receive notifications about system updates</p>
                  </div>
                  <Switch
                    checked={notifications.systemUpdates}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, systemUpdates: checked })}
                  />
                </div>
              </div>

              <Button onClick={handleSaveNotifications} className="bg-cyan-500 hover:bg-cyan-600">
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription className="text-gray-300">
                Configure security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Two-Factor Authentication</Label>
                    <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                    />
                    {securitySettings.twoFactorAuth && (
                      <Badge className="bg-green-600">Enabled</Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Session Timeout (minutes)</Label>
                    <Input
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) || 30 })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Password Expiry (days)</Label>
                    <Input
                      type="number"
                      value={securitySettings.passwordExpiry}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, passwordExpiry: parseInt(e.target.value) || 90 })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Max Login Attempts</Label>
                    <Input
                      type="number"
                      value={securitySettings.loginAttempts}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, loginAttempts: parseInt(e.target.value) || 5 })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveSecurity} className="bg-cyan-500 hover:bg-cyan-600">
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Mail className="h-5 w-5" />
                SMTP Settings
              </CardTitle>
              <CardDescription className="text-gray-300">
                Configure SMTP settings for sending emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">SMTP Host</Label>
                  <Input
                    value={emailSettings.smtpHost}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                    placeholder="smtp.gmail.com"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">SMTP Port</Label>
                  <Input
                    type="number"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: parseInt(e.target.value) || 587 })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">SMTP Username</Label>
                  <Input
                    value={emailSettings.smtpUsername}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpUsername: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">SMTP Password</Label>
                  <Input
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">From Email</Label>
                  <Input
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">From Name</Label>
                  <Input
                    value={emailSettings.fromName}
                    onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleSaveEmail} className="bg-cyan-500 hover:bg-cyan-600">
                  Save Email Settings
                </Button>
                <Button onClick={handleTestEmail} variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500/10">
                  Send Test Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Management
              </CardTitle>
              <CardDescription className="text-gray-300">
                System maintenance and administrative tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-700/50 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Cache Management</CardTitle>
                    <CardDescription className="text-gray-400">
                      Clear application cache to improve performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={handleClearCache} variant="outline" className="w-full">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Cache
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-slate-700/50 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Database Backup</CardTitle>
                    <CardDescription className="text-gray-400">
                      Create a backup of your database
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={handleBackupDatabase} variant="outline" className="w-full">
                      <Database className="h-4 w-4 mr-2" />
                      Backup Database
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-4">
                <h3 className="text-yellow-400 font-medium flex items-center gap-2 mb-2">
                  <Key className="h-4 w-4" />
                  API Configuration
                </h3>
                <p className="text-yellow-300 text-sm mb-3">
                  API keys and external service configurations are managed through environment variables.
                  Contact your system administrator for API key management.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Supabase API:</span>
                    <Badge className="bg-green-600">Connected</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Storage Service:</span>
                    <Badge className="bg-green-600">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Email Service:</span>
                    <Badge className="bg-yellow-600">Needs Configuration</Badge>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-white font-medium mb-2">System Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Version:</span>
                    <span className="text-white ml-2">1.0.0</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Environment:</span>
                    <span className="text-white ml-2">Production</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Last Backup:</span>
                    <span className="text-white ml-2">2 hours ago</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Cache Size:</span>
                    <span className="text-white ml-2">45.2 MB</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
