import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Package, Search, AlertCircle, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/ui/image-upload';

interface Accessory {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  sku: string;
  stock_quantity: number;
  availability: string;
  images: string[];
  thumbnail_url: string;
  condition: string;
  product_type: string;
  technical_specs: any;
  applications: string[];
  packaging_options: string[];
  created_at: string;
  updated_at: string;
}

const ACCESSORY_CATEGORIES = [
  'Gauges & Manifolds',
  'Recovery Equipment', 
  'Tools',
  'Fittings & Adapters',
  'Safety Equipment',
  'Valves & Controls',
  'Leak Detection',
  'Vacuum Equipment',
  'Service Hoses',
  'Thermometers',
  'Other'
];

const BRANDS = [
  'Yellow Jacket',
  'Robinair',
  'CPS',
  'Inficon',
  'Fieldpiece',
  'Mastercool',
  'Refco',
  'Value',
  'JB Industries',
  'Hilmor',
  'Other'
];

const AccessoryManagement = () => {
  const [selectedAccessory, setSelectedAccessory] = useState<Accessory | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const queryClient = useQueryClient();

  // Fetch accessories
  const { data: accessories = [], isLoading, error } = useQuery({
    queryKey: ['accessories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('product_type', 'accessory')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type cast the data to ensure arrays are properly handled
      return (data || []).map(item => ({
        ...item,
        images: Array.isArray(item.images) ? item.images : [],
        applications: Array.isArray(item.applications) ? item.applications : [],
        packaging_options: Array.isArray(item.packaging_options) ? item.packaging_options : ['Individual'],
      })) as Accessory[];
    },
  });

  // Add accessory mutation
  const addAccessoryMutation = useMutation({
    mutationFn: async (accessoryData: Omit<Accessory, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('products')
        .insert([{ ...accessoryData, product_type: 'accessory' }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accessories'] });
      setIsAddDialogOpen(false);
      toast.success('Accessory added successfully');
    },
    onError: (error) => {
      console.error('Error adding accessory:', error);
      toast.error('Failed to add accessory');
    },
  });

  // Update accessory mutation
  const updateAccessoryMutation = useMutation({
    mutationFn: async ({ id, ...accessoryData }: Partial<Accessory> & { id: string }) => {
      const { data, error } = await supabase
        .from('products')
        .update(accessoryData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accessories'] });
      setIsEditDialogOpen(false);
      setSelectedAccessory(null);
      toast.success('Accessory updated successfully');
    },
    onError: (error) => {
      console.error('Error updating accessory:', error);
      toast.error('Failed to update accessory');
    },
  });

  // Delete accessory mutation
  const deleteAccessoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accessories'] });
      toast.success('Accessory deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting accessory:', error);
      toast.error('Failed to delete accessory');
    },
  });

  // Filter accessories based on search and category
  const filteredAccessories = accessories.filter((accessory) => {
    const matchesSearch = accessory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         accessory.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         accessory.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || accessory.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const AccessoryForm = ({ accessory, onSubmit, onCancel }: {
    accessory?: Accessory | null;
    onSubmit: (data: any) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: accessory?.name || '',
      description: accessory?.description || '',
      price: accessory?.price || 0,
      category: accessory?.category || '',
      brand: accessory?.brand || '',
      sku: accessory?.sku || '',
      stock_quantity: accessory?.stock_quantity || 0,
      availability: accessory?.availability || 'in_stock',
      condition: accessory?.condition || 'new',
      images: accessory?.images || [],
      thumbnail_url: accessory?.thumbnail_url || '',
      technical_specs: accessory?.technical_specs || {},
      applications: accessory?.applications || [],
      packaging_options: accessory?.packaging_options || ['Individual'],
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!formData.name || !formData.category || !formData.brand) {
        toast.error('Please fill in all required fields');
        return;
      }

      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Accessory name"
              required
            />
          </div>
          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              placeholder="Product SKU"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Product description"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {ACCESSORY_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="brand">Brand *</Label>
            <Select value={formData.brand} onValueChange={(value) => setFormData({ ...formData, brand: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {BRANDS.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="stock_quantity">Stock Quantity</Label>
            <Input
              id="stock_quantity"
              type="number"
              value={formData.stock_quantity}
              onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="availability">Availability</Label>
            <Select value={formData.availability} onValueChange={(value) => setFormData({ ...formData, availability: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
                <SelectItem value="pre_order">Pre-Order</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="condition">Condition</Label>
          <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="refurbished">Refurbished</SelectItem>
              <SelectItem value="used">Used</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Product Images</Label>
          <ImageUpload
            currentImage={formData.thumbnail_url}
            onImageUploaded={(url) => {
              const newImages = [...formData.images, url];
              setFormData({ 
                ...formData, 
                images: newImages,
                thumbnail_url: formData.thumbnail_url || url
              });
            }}
            onImageRemoved={() => {
              setFormData({ 
                ...formData, 
                images: [],
                thumbnail_url: ''
              });
            }}
            bucket="product-images"
            folder="accessories"
            label="Upload Accessory Image"
          />
          {formData.images.length > 0 && (
            <div className="mt-2 grid grid-cols-4 gap-2">
              {formData.images.map((url, index) => (
                <div key={index} className="relative">
                  <img src={url} alt={`Product ${index + 1}`} className="w-full h-16 object-cover rounded" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-1 -right-1 h-6 w-6 p-0"
                    onClick={() => {
                      const newImages = formData.images.filter((_, i) => i !== index);
                      setFormData({ 
                        ...formData, 
                        images: newImages,
                        thumbnail_url: newImages[0] || ''
                      });
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {accessory ? 'Update' : 'Add'} Accessory
          </Button>
        </div>
      </form>
    );
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">Error loading accessories</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accessory Management</h1>
          <p className="text-gray-600">Manage HVAC accessories and tools</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Accessory
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Accessory</DialogTitle>
            </DialogHeader>
            <AccessoryForm
              onSubmit={(data) => addAccessoryMutation.mutate(data)}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex space-x-4 items-center bg-white p-4 rounded-lg border">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search accessories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="w-48">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {ACCESSORY_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Accessories Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="bg-gray-200 h-48 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredAccessories.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No accessories found</h3>
          <p className="text-gray-600">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search criteria' 
              : 'Add your first accessory to get started'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAccessories.map((accessory) => (
            <Card key={accessory.id} className="overflow-hidden">
              <div className="aspect-square bg-gray-100 relative">
                {accessory.thumbnail_url ? (
                  <img 
                    src={accessory.thumbnail_url} 
                    alt={accessory.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant={accessory.availability === 'in_stock' ? 'default' : 'secondary'}>
                    {accessory.availability.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-2">{accessory.name}</h3>
                  <p className="text-sm text-gray-600">SKU: {accessory.sku}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{accessory.category}</Badge>
                    <span className="font-bold text-lg text-blue-600">
                      ${accessory.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Stock: {accessory.stock_quantity}</p>
                  
                  <div className="flex space-x-2 pt-2">
                    <Dialog open={isEditDialogOpen && selectedAccessory?.id === accessory.id} 
                           onOpenChange={(open) => {
                             setIsEditDialogOpen(open);
                             if (!open) setSelectedAccessory(null);
                           }}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setSelectedAccessory(accessory)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Accessory</DialogTitle>
                        </DialogHeader>
                        <AccessoryForm
                          accessory={selectedAccessory}
                          onSubmit={(data) => updateAccessoryMutation.mutate({ id: accessory.id, ...data })}
                          onCancel={() => {
                            setIsEditDialogOpen(false);
                            setSelectedAccessory(null);
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this accessory?')) {
                          deleteAccessoryMutation.mutate(accessory.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccessoryManagement;