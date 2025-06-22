
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, User, Shield, Database, Mail } from 'lucide-react';

const AdminSettings = () => {
  const { user, profile } = useAuth();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Settings</h1>
        <p className="text-gray-300">Manage your admin account and system settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Settings
            </CardTitle>
            <CardDescription className="text-gray-300">
              Manage your admin profile information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Full Name</label>
              <Input
                value={profile?.full_name || ''}
                placeholder="Enter your full name"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Email</label>
              <Input
                value={profile?.email || ''}
                disabled
                className="bg-slate-700 border-slate-600 text-white opacity-60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Role</label>
              <Badge className="bg-cyan-500/20 text-cyan-400">
                <Shield className="h-3 w-3 mr-1" />
                Administrator
              </Badge>
            </div>
            <Button className="w-full bg-cyan-500 hover:bg-cyan-600">
              Update Profile
            </Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security Settings
            </CardTitle>
            <CardDescription className="text-gray-300">
              Manage your security preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Two-Factor Authentication</p>
                <p className="text-gray-400 text-sm">Add an extra layer of security</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Login Notifications</p>
                <p className="text-gray-400 text-sm">Get notified of new logins</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Button variant="outline" className="w-full border-slate-600 text-gray-300 hover:bg-slate-700">
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              System Settings
            </CardTitle>
            <CardDescription className="text-gray-300">
              Configure system-wide settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Maintenance Mode</p>
                <p className="text-gray-400 text-sm">Put the site in maintenance mode</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">User Registration</p>
                <p className="text-gray-400 text-sm">Allow new user registrations</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Email Notifications</p>
                <p className="text-gray-400 text-sm">Send system email notifications</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Database Stats */}
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Database Statistics
            </CardTitle>
            <CardDescription className="text-gray-300">
              Overview of your database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Products</span>
              <Badge variant="secondary">0</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Blog Posts</span>
              <Badge variant="secondary">0</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Orders</span>
              <Badge variant="secondary">0</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Users</span>
              <Badge variant="secondary">1</Badge>
            </div>
            <Button variant="outline" className="w-full border-slate-600 text-gray-300 hover:bg-slate-700">
              <Database className="h-4 w-4 mr-2" />
              Database Backup
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Additional Settings */}
      <Card className="bg-slate-800/50 border-cyan-500/20 mt-6">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Email Configuration
          </CardTitle>
          <CardDescription className="text-gray-300">
            Configure email settings for notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">SMTP Server</label>
              <Input
                placeholder="smtp.example.com"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">SMTP Port</label>
              <Input
                placeholder="587"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">SMTP Username</label>
              <Input
                placeholder="username@example.com"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">SMTP Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <Button className="bg-cyan-500 hover:bg-cyan-600">
              Save Email Settings
            </Button>
            <Button variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-700">
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
