import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Download, Trash2, Search, UserPlus, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  subscribed_at: string;
  is_active: boolean;
  source: string;
}

const NewsletterManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch newsletter subscribers using secure admin endpoint
  const { data: subscribers = [], isLoading } = useQuery({
    queryKey: ['newsletter-subscribers'],
    queryFn: async () => {
      // Verify user is authenticated
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('Authentication required');
      }

      const { data, error } = await supabase.functions.invoke('admin-data-access', {
        body: { table: 'newsletter_subscribers' }
      });

      if (error) throw error;
      return data as Subscriber[];
    }
  });

  // Toggle subscriber status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ is_active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Subscriber status updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['newsletter-subscribers'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update subscriber status",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Delete subscriber mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Subscriber deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['newsletter-subscribers'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to delete subscriber",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Filter subscribers based on search query
  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (subscriber.name && subscriber.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeSubscribers = subscribers.filter(s => s.is_active).length;
  const totalSubscribers = subscribers.length;

  const handleExportCSV = () => {
    const csvContent = [
      ['Email', 'Name', 'Subscribed Date', 'Status', 'Source'],
      ...filteredSubscribers.map(sub => [
        sub.email,
        sub.name || '',
        format(new Date(sub.subscribed_at), 'yyyy-MM-dd HH:mm:ss'),
        sub.is_active ? 'Active' : 'Inactive',
        sub.source
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Newsletter Management</h1>
          <p className="text-gray-300">Manage newsletter subscribers and view statistics</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={handleExportCSV}
            className="bg-green-500 hover:bg-green-600"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Subscribers</p>
                <p className="text-2xl font-bold text-white">{totalSubscribers}</p>
              </div>
              <UserPlus className="h-8 w-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Subscribers</p>
                <p className="text-2xl font-bold text-white">{activeSubscribers}</p>
              </div>
              <Mail className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Growth Rate</p>
                <p className="text-2xl font-bold text-white">
                  {totalSubscribers > 0 ? Math.round((activeSubscribers / totalSubscribers) * 100) : 0}%
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-slate-800/50 border-slate-600 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by email or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscribers List */}
      <Card className="bg-slate-800/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">
            Subscribers ({filteredSubscribers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-white text-center py-8">Loading subscribers...</div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              {searchQuery ? 'No subscribers found matching your search.' : 'No subscribers yet.'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubscribers.map((subscriber) => (
                <div key={subscriber.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-white font-medium">{subscriber.email}</p>
                        {subscriber.name && (
                          <p className="text-sm text-gray-300">{subscriber.name}</p>
                        )}
                        <p className="text-xs text-gray-400">
                          Subscribed: {format(new Date(subscriber.subscribed_at), 'MMM dd, yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={subscriber.is_active ? "default" : "secondary"}
                      className={subscriber.is_active ? "bg-green-500" : "bg-gray-500"}
                    >
                      {subscriber.is_active ? "Active" : "Inactive"}
                    </Badge>
                    
                    <Badge variant="outline" className="text-gray-300 border-gray-500">
                      {subscriber.source}
                    </Badge>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleStatusMutation.mutate({ 
                        id: subscriber.id, 
                        is_active: !subscriber.is_active 
                      })}
                      disabled={toggleStatusMutation.isPending}
                      className="border-slate-600 text-white hover:bg-slate-600"
                    >
                      {subscriber.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMutation.mutate(subscriber.id)}
                      disabled={deleteMutation.isPending}
                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsletterManagement;