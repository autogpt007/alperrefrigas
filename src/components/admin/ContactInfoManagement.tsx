import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Edit, Plus, Trash2, Save, X, Phone, Mail, Clock, AlertTriangle } from 'lucide-react';

interface ContactInfo {
  id: string;
  category: string;
  contact_type: string;
  label: string;
  value: string;
  description: string | null;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

const ContactInfoManagement = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ContactInfo | null>(null);
  const [isNewItem, setIsNewItem] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .order('category', { ascending: true })
        .order('order_index', { ascending: true });

      if (error) throw error;
      setContactInfo(data || []);
    } catch (error) {
      console.error('Error fetching contact info:', error);
      toast({
        title: "Error",
        description: "Failed to fetch contact information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingItem) return;

    try {
      if (isNewItem) {
        const { error } = await supabase
          .from('contact_info')
          .insert([{
            category: editingItem.category,
            contact_type: editingItem.contact_type,
            label: editingItem.label,
            value: editingItem.value,
            description: editingItem.description,
            is_active: editingItem.is_active,
            order_index: editingItem.order_index
          }]);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('contact_info')
          .update({
            category: editingItem.category,
            contact_type: editingItem.contact_type,
            label: editingItem.label,
            value: editingItem.value,
            description: editingItem.description,
            is_active: editingItem.is_active,
            order_index: editingItem.order_index
          })
          .eq('id', editingItem.id);

        if (error) throw error;
      }

      await fetchContactInfo();
      setEditingItem(null);
      setIsNewItem(false);
      toast({
        title: "Success",
        description: `Contact information ${isNewItem ? 'added' : 'updated'} successfully`,
      });
    } catch (error) {
      console.error('Error saving contact info:', error);
      toast({
        title: "Error",
        description: "Failed to save contact information",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact information?')) return;

    try {
      const { error } = await supabase
        .from('contact_info')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchContactInfo();
      toast({
        title: "Success",
        description: "Contact information deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting contact info:', error);
      toast({
        title: "Error",
        description: "Failed to delete contact information",
        variant: "destructive",
      });
    }
  };

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'hours': return <Clock className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'emergency': return '🚨';
      case 'general': return '📞';
      case 'returns': return '↩️';
      case 'support': return '🛠️';
      case 'legal': return '⚖️';
      case 'compliance': return '📋';
      default: return '📋';
    }
  };

  const groupedContactInfo = contactInfo.reduce((groups, item) => {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
    return groups;
  }, {} as Record<string, ContactInfo[]>);

  const startEdit = (item: ContactInfo) => {
    setEditingItem({ ...item });
    setIsNewItem(false);
  };

  const startNew = () => {
    setEditingItem({
      id: '',
      category: 'general',
      contact_type: 'phone',
      label: '',
      value: '',
      description: '',
      is_active: true,
      order_index: 0,
      created_at: '',
      updated_at: ''
    });
    setIsNewItem(true);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setIsNewItem(false);
  };

  if (loading) {
    return <div className="p-6 text-white">Loading contact information...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Contact Information Management</h1>
          <p className="text-gray-300">Manage contact details displayed across the website</p>
        </div>
        <Button onClick={startNew} className="bg-cyan-600 hover:bg-cyan-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Contact Info
        </Button>
      </div>

      {editingItem && (
        <Card className="mb-6 bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">
              {isNewItem ? 'Add New Contact Information' : 'Edit Contact Information'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category" className="text-white">Category</Label>
                <Select
                  value={editingItem.category}
                  onValueChange={(value) => setEditingItem({...editingItem, category: value})}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="returns">Returns</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="contact_type" className="text-white">Contact Type</Label>
                <Select
                  value={editingItem.contact_type}
                  onValueChange={(value) => setEditingItem({...editingItem, contact_type: value})}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="hours">Business Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="label" className="text-white">Label</Label>
                <Input
                  id="label"
                  value={editingItem.label}
                  onChange={(e) => setEditingItem({...editingItem, label: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="e.g., Emergency Hotline"
                />
              </div>

              <div>
                <Label htmlFor="value" className="text-white">Value</Label>
                <Input
                  id="value"
                  value={editingItem.value}
                  onChange={(e) => setEditingItem({...editingItem, value: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="e.g., 1-800-734-HELP"
                />
              </div>

              <div>
                <Label htmlFor="order_index" className="text-white">Order Index</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={editingItem.order_index}
                  onChange={(e) => setEditingItem({...editingItem, order_index: parseInt(e.target.value) || 0})}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={editingItem.is_active}
                  onCheckedChange={(checked) => setEditingItem({...editingItem, is_active: checked})}
                />
                <Label htmlFor="is_active" className="text-white">Active</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-white">Description</Label>
              <Textarea
                id="description"
                value={editingItem.description || ''}
                onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Additional description or context"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={cancelEdit} variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="by-category">By Category</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">All Contact Information</CardTitle>
              <CardDescription className="text-gray-300">
                Complete list of all contact information entries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contactInfo.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getContactIcon(item.contact_type)}
                      <div>
                        <div className="text-white font-medium">{item.label}</div>
                        <div className="text-cyan-400">{item.value}</div>
                        <div className="text-gray-400 text-sm">
                          {getCategoryIcon(item.category)} {item.category} • Order: {item.order_index}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`px-2 py-1 rounded text-xs ${item.is_active ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'}`}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </div>
                      <Button
                        onClick={() => startEdit(item)}
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-white hover:bg-slate-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(item.id)}
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-category">
          <div className="grid gap-6">
            {Object.entries(groupedContactInfo).map(([category, items]) => (
              <Card key={category} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <span>{getCategoryIcon(category)}</span>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {items.length} contact{items.length !== 1 ? 's' : ''} in this category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-slate-700 rounded">
                        <div className="flex items-center space-x-3">
                          {getContactIcon(item.contact_type)}
                          <div>
                            <div className="text-white font-medium">{item.label}</div>
                            <div className="text-cyan-400">{item.value}</div>
                            {item.description && (
                              <div className="text-gray-400 text-sm">{item.description}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`px-2 py-1 rounded text-xs ${item.is_active ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'}`}>
                            {item.is_active ? 'Active' : 'Inactive'}
                          </div>
                          <Button
                            onClick={() => startEdit(item)}
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-white hover:bg-slate-600"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(item.id)}
                            size="sm"
                            variant="outline"
                            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactInfoManagement;