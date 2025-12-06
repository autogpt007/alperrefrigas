import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sanitizeInlineHTML } from '@/lib/sanitize';

interface Advert {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'success' | 'warning' | 'discount' | 'emergency';
  is_active: boolean;
  dismissible: boolean;
  start_date: string | null;
  end_date: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

const AdvertManagement = () => {
  const [adverts, setAdverts] = useState<Advert[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Advert | null>(null);
  const [isNewItem, setIsNewItem] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAdverts();
  }, []);

  const fetchAdverts = async () => {
    try {
      const { data, error } = await supabase
        .from('adverts')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setAdverts((data || []) as Advert[]);
    } catch (error) {
      console.error('Error fetching adverts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch adverts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (advertData: Partial<Advert>) => {
    try {
      const { id, created_at, updated_at, ...dataToSave } = advertData;
      
      if (isNewItem) {
        // Ensure required fields are present for new items
        if (!dataToSave.title || !dataToSave.content) {
          toast({
            title: "Error",
            description: "Title and content are required",
            variant: "destructive"
          });
          return;
        }
        
        const { error } = await supabase
          .from('adverts')
          .insert([{
            title: dataToSave.title!,
            content: dataToSave.content!,
            type: dataToSave.type,
            is_active: dataToSave.is_active,
            dismissible: dataToSave.dismissible,
            start_date: dataToSave.start_date,
            end_date: dataToSave.end_date,
            order_index: dataToSave.order_index
          }]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('adverts')
          .update(dataToSave)
          .eq('id', id);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Advert ${isNewItem ? 'created' : 'updated'} successfully`
      });

      fetchAdverts();
      setEditingItem(null);
      setIsNewItem(false);
    } catch (error) {
      console.error('Error saving advert:', error);
      toast({
        title: "Error",
        description: "Failed to save advert",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this advert?')) return;

    try {
      const { error } = await supabase
        .from('adverts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Advert deleted successfully"
      });

      fetchAdverts();
    } catch (error) {
      console.error('Error deleting advert:', error);
      toast({
        title: "Error",
        description: "Failed to delete advert",
        variant: "destructive"
      });
    }
  };

  const startEdit = (advert: Advert) => {
    setEditingItem(advert);
    setIsNewItem(false);
  };

  const startNew = () => {
    setEditingItem({
      id: '',
      title: '',
      content: '',
      type: 'info',
      is_active: true,
      dismissible: true,
      start_date: null,
      end_date: null,
      order_index: adverts.length,
      created_at: '',
      updated_at: ''
    });
    setIsNewItem(true);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setIsNewItem(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500/20 text-green-200 border-green-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30';
      case 'discount': return 'bg-purple-500/20 text-purple-200 border-purple-500/30';
      case 'emergency': return 'bg-red-500/20 text-red-200 border-red-500/30';
      default: return 'bg-blue-500/20 text-blue-200 border-blue-500/30';
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading adverts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Advert Management</h1>
          <p className="text-gray-400">Manage homepage banner advertisements and announcements</p>
        </div>
        <Button onClick={startNew} className="bg-gradient-to-r from-cyan-500 to-blue-500">
          <Plus className="h-4 w-4 mr-2" />
          Add Advert
        </Button>
      </div>

      {editingItem && (
        <Card className="bg-slate-800/50 border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-white">
              {isNewItem ? 'Create New Advert' : 'Edit Advert'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-300">Title</Label>
                <Input
                  id="title"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter advert title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type" className="text-gray-300">Type</Label>
                <Select
                  value={editingItem.type}
                  onValueChange={(value) => setEditingItem({...editingItem, type: value as any})}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="discount">Discount</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content" className="text-gray-300">Content</Label>
              <Textarea
                id="content"
                value={editingItem.content}
                onChange={(e) => setEditingItem({...editingItem, content: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                placeholder="Enter advert content (HTML supported)"
              />
              <p className="text-xs text-gray-400">
                You can use HTML tags like &lt;strong&gt;, &lt;em&gt;, etc.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date" className="text-gray-300">Start Date (Optional)</Label>
                <Input
                  id="start_date"
                  type="datetime-local"
                  value={editingItem.start_date ? new Date(editingItem.start_date).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setEditingItem({...editingItem, start_date: e.target.value ? new Date(e.target.value).toISOString() : null})}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end_date" className="text-gray-300">End Date (Optional)</Label>
                <Input
                  id="end_date"
                  type="datetime-local"
                  value={editingItem.end_date ? new Date(editingItem.end_date).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setEditingItem({...editingItem, end_date: e.target.value ? new Date(e.target.value).toISOString() : null})}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order_index" className="text-gray-300">Order Index</Label>
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
                <Label htmlFor="is_active" className="text-gray-300">Active</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="dismissible"
                  checked={editingItem.dismissible}
                  onCheckedChange={(checked) => setEditingItem({...editingItem, dismissible: checked})}
                />
                <Label htmlFor="dismissible" className="text-gray-300">Dismissible</Label>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={() => handleSave(editingItem)}
                className="bg-green-600 hover:bg-green-700"
              >
                Save
              </Button>
              <Button onClick={cancelEdit} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {adverts.map((advert) => (
          <Card key={advert.id} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-white">{advert.title}</h3>
                    <Badge className={getTypeColor(advert.type)}>
                      {advert.type}
                    </Badge>
                    <div className="flex items-center gap-2">
                      {advert.is_active ? (
                        <Eye className="h-4 w-4 text-green-400" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-red-400" />
                      )}
                      {advert.dismissible && (
                        <Badge variant="outline" className="text-xs">
                          Dismissible
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div 
                    className="text-gray-300 mb-3"
                    dangerouslySetInnerHTML={{ __html: sanitizeInlineHTML(advert.content) }}
                  />
                  
                  <div className="text-sm text-gray-400 space-y-1">
                    <div>Order: {advert.order_index}</div>
                    {advert.start_date && (
                      <div>Start: {new Date(advert.start_date).toLocaleString()}</div>
                    )}
                    {advert.end_date && (
                      <div>End: {new Date(advert.end_date).toLocaleString()}</div>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => startEdit(advert)}
                    size="sm"
                    variant="outline"
                    className="border-blue-500 text-blue-400 hover:bg-blue-500/20"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(advert.id)}
                    size="sm"
                    variant="outline"
                    className="border-red-500 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {adverts.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-8 text-center">
            <p className="text-gray-400">No adverts found. Create your first advert to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvertManagement;