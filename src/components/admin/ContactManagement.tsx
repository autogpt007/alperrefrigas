
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Phone, Clock, Settings, Save } from 'lucide-react';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

const ContactManagement = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificationEmail, setNotificationEmail] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
    fetchNotificationEmail();
  }, []);

  const fetchSubmissions = async () => {
    try {
      // Use secure admin edge function instead of direct database access
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('Authentication required');
      }

      const { data, error } = await supabase.functions.invoke('admin-data-access', {
        body: { table: 'contact_submissions' }
      });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error: any) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Failed to load contact submissions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchNotificationEmail = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_settings')
        .select('setting_value')
        .eq('setting_key', 'notification_email')
        .single();
      
      if (error) {
        console.error('Error fetching notification email:', error);
        setNotificationEmail('eddy3597@gmail.com');
        return;
      }
      
      if (data && data.setting_value) {
        setNotificationEmail(data.setting_value);
      } else {
        setNotificationEmail('eddy3597@gmail.com');
      }
    } catch (error: any) {
      console.error('Error fetching notification email:', error);
      setNotificationEmail('eddy3597@gmail.com');
    }
  };

  const updateSubmissionStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setSubmissions(prev => 
        prev.map(sub => sub.id === id ? { ...sub, status } : sub)
      );

      toast({
        title: "Status Updated",
        description: "Contact submission status updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const updateNotificationEmail = async () => {
    try {
      const { error } = await supabase
        .from('notification_settings')
        .upsert({
          setting_key: 'notification_email',
          setting_value: notificationEmail,
          description: 'Email address for order notifications'
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Settings Updated",
        description: "Notification email updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { label: 'New', className: 'bg-blue-600' },
      in_progress: { label: 'In Progress', className: 'bg-yellow-600' },
      resolved: { label: 'Resolved', className: 'bg-green-600' },
      closed: { label: 'Closed', className: 'bg-gray-600' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  if (loading) {
    return <div className="p-6 text-white">Loading contact submissions...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Contact Management</h1>
        <p className="text-gray-300">Manage contact form submissions and notification settings</p>
      </div>

      <Tabs defaultValue="submissions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="submissions">Contact Submissions</TabsTrigger>
          <TabsTrigger value="settings">Notification Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="submissions">
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Submissions ({submissions.length})
              </CardTitle>
              <CardDescription className="text-gray-300">
                Review and manage contact form submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submissions.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No contact submissions found.</p>
                ) : (
                  submissions.map((submission) => (
                    <Card key={submission.id} className="bg-slate-700/50 border-slate-600">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-white font-semibold">{submission.name}</h3>
                            <p className="text-gray-400 text-sm">{submission.email}</p>
                            <p className="text-gray-400 text-sm flex items-center mt-1">
                              <Clock className="h-4 w-4 mr-1" />
                              {new Date(submission.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(submission.status)}
                            <Select
                              value={submission.status}
                              onValueChange={(value) => updateSubmissionStatus(submission.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        {submission.subject && (
                          <div className="mb-3">
                            <p className="text-gray-300 font-medium">Subject: {submission.subject}</p>
                          </div>
                        )}
                        
                        <div className="bg-slate-800 p-4 rounded-lg">
                          <p className="text-gray-300 whitespace-pre-wrap">{submission.message}</p>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.location.href = `mailto:${submission.email}?subject=Re: ${submission.subject || 'Your Contact Form Submission'}`}
                            className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Reply
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              // Extract phone number from message if present
                              const phoneMatch = submission.message.match(/(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/);
                              if (phoneMatch) {
                                window.location.href = `tel:${phoneMatch[0]}`;
                              } else {
                                toast({
                                  title: "No phone number found",
                                  description: "Please check the message for contact details",
                                  variant: "destructive"
                                });
                              }
                            }}
                            className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Call
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription className="text-gray-300">
                Configure email notifications for form submissions and orders
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
                    onClick={updateNotificationEmail}
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

              <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-4">
                <h3 className="text-yellow-400 font-medium mb-2">Email Service Configuration</h3>
                <p className="text-yellow-300 text-sm">
                  To enable email notifications, you need to configure an email service like Resend. 
                  Contact your system administrator to set up the email service integration.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactManagement;
