
import React, { useState } from 'react';
import { useProducts } from '@/contexts/ProductsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ImageUpload } from '@/components/ui/image-upload';
import { Plus, Edit, Trash2, Wind, Zap, ThermometerSun, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const ACProductManagement = () => {
  const { products, addProduct, updateProduct, deleteProduct, loading } = useProducts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'configured' | 'needs-config'>('all');

  // Filter only AC products
  const acProducts = products.filter(p => p.product_type === 'air_conditioner');

  const filteredProducts = acProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const isConfigured = product.btu && product.voltage && product.ac_type;
    
    if (filterStatus === 'configured') return matchesSearch && isConfigured;
    if (filterStatus === 'needs-config') return matchesSearch && !isConfigured;
    return matchesSearch;
  });

  const initialFormData: {
    name: string;
    description: string;
    price: number;
    sku: string;
    category: string;
    product_type: 'air_conditioner';
    stock: number;
    availability: 'in_stock' | 'out_of_stock' | 'preorder' | 'backorder';
    images: string[];
    image: string;
    epaApproved: boolean;
    brand: string;
    condition: 'new' | 'used' | 'refurbished';
    ac_type: string;
    btu: number | undefined;
    voltage: string;
    frequency: string;
    phase: string;
    plug_type: string;
    refrigerant_type: string;
    efficiency_label: string;
    max_room_size: string;
    comes_with_base: string[];
    comes_with_accessories: string[];
    base_unit_price: number | undefined;
    q20_units: number | undefined;
    q40_units: number | undefined;
    mid_bulk_uplift_percent: number;
    custom_uplift_5_19: number;
    custom_uplift_20_39: number;
    custom_uplift_40_half: number;
    weight_kg: number | undefined;
    length_cm: number | undefined;
    width_cm: number | undefined;
    height_cm: number | undefined;
  } = {
    name: '',
    description: '',
    price: 0,
    sku: '',
    category: 'air-conditioners',
    product_type: 'air_conditioner',
    stock: 0,
    availability: 'in_stock',
    images: [],
    image: '',
    epaApproved: false,
    brand: 'Generic',
    condition: 'new',
    ac_type: '',
    btu: undefined,
    voltage: '',
    frequency: '60Hz',
    phase: '1-Phase',
    plug_type: '',
    refrigerant_type: '',
    efficiency_label: '',
    max_room_size: '',
    comes_with_base: [],
    comes_with_accessories: [],
    base_unit_price: undefined,
    q20_units: undefined as number | undefined,
    q40_units: undefined as number | undefined,
    mid_bulk_uplift_percent: 12,
    custom_uplift_5_19: 35,
    custom_uplift_20_39: 25,
    custom_uplift_40_half: 15,
    // Dimensions
    weight_kg: undefined as number | undefined,
    length_cm: undefined as number | undefined,
    width_cm: undefined as number | undefined,
    height_cm: undefined as number | undefined,
  };

  const [formData, setFormData] = useState(initialFormData);

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingProduct(null);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || 0,
      sku: product.sku || '',
      category: product.category || 'air-conditioners',
      product_type: 'air_conditioner',
      stock: product.stock || 0,
      availability: product.availability || 'in_stock',
      images: product.images || [],
      image: product.image || '',
      epaApproved: product.epaApproved || false,
      brand: product.brand || 'Generic',
      condition: product.condition || 'new',
      ac_type: product.ac_type || '',
      btu: product.btu || undefined,
      voltage: product.voltage || '',
      frequency: product.frequency || '60Hz',
      phase: product.phase || '1-Phase',
      plug_type: product.plug_type || '',
      refrigerant_type: product.refrigerant_type || '',
      efficiency_label: product.efficiency_label || '',
      max_room_size: product.max_room_size || '',
      comes_with_base: product.comes_with_base || [],
      comes_with_accessories: product.comes_with_accessories || [],
      base_unit_price: product.base_unit_price || undefined,
      q20_units: product.q20_units || undefined,
      q40_units: product.q40_units || undefined,
      mid_bulk_uplift_percent: product.mid_bulk_uplift_percent ?? 12,
      custom_uplift_5_19: product.custom_uplift_5_19 ?? 35,
      custom_uplift_20_39: product.custom_uplift_20_39 ?? 25,
      custom_uplift_40_half: product.custom_uplift_40_half ?? 15,
      weight_kg: product.weight_kg || undefined,
      length_cm: product.length_cm || undefined,
      width_cm: product.width_cm || undefined,
      height_cm: product.height_cm || undefined,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        ...formData,
        product_type: 'air_conditioner' as const,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast.success('AC product updated successfully');
      } else {
        await addProduct(productData);
        toast.success('AC product added successfully');
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (productId: string) => {
    if (confirm('Are you sure you want to delete this AC product?')) {
      try {
        await deleteProduct(productId);
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const getConfigStatus = (product: any) => {
    const hasBasic = product.btu && product.voltage && product.ac_type;
    const hasPricing = product.base_unit_price && product.q20_units;
    
    if (hasBasic && hasPricing) return 'complete';
    if (hasBasic) return 'partial';
    return 'incomplete';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Wind className="h-6 w-6 text-cyan-400" />
            AC Products Management
          </h1>
          <p className="text-gray-400 mt-1">
            Manage air conditioner products with BTU, voltage, and bulk pricing configuration
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              <Plus className="h-4 w-4 mr-2" />
              Add AC Product
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingProduct ? 'Edit AC Product' : 'Add New AC Product'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-slate-700">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="ac-specs">AC Specs</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  <TabsTrigger value="includes">Includes</TabsTrigger>
                  <TabsTrigger value="images">Images</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Product Name *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">SKU</Label>
                      <Input
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-gray-300">Description</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-gray-300">Price ($) *</Label>
                      <Input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Stock Quantity</Label>
                      <Input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Availability</Label>
                      <Select
                        value={formData.availability}
                        onValueChange={(value) => setFormData({ ...formData, availability: value as 'in_stock' | 'out_of_stock' | 'preorder' | 'backorder' })}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="in_stock">In Stock</SelectItem>
                          <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                          <SelectItem value="preorder">Pre-order</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="ac-specs" className="space-y-4 mt-4">
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mb-4">
                    <p className="text-cyan-400 text-sm flex items-center gap-2">
                      <ThermometerSun className="h-4 w-4" />
                      Configure AC-specific specifications for proper product display and filtering
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">AC Type *</Label>
                      <Select
                        value={formData.ac_type}
                        onValueChange={(value) => setFormData({ ...formData, ac_type: value })}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Select AC type" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="Mini-Split">Mini-Split</SelectItem>
                          <SelectItem value="Window">Window Unit</SelectItem>
                          <SelectItem value="Portable">Portable</SelectItem>
                          <SelectItem value="Central">Central</SelectItem>
                          <SelectItem value="Ductless">Ductless</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">BTU Rating *</Label>
                      <Input
                        type="number"
                        value={formData.btu || ''}
                        onChange={(e) => setFormData({ ...formData, btu: parseInt(e.target.value) || undefined })}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="e.g., 12000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-gray-300">Voltage *</Label>
                      <Select
                        value={formData.voltage}
                        onValueChange={(value) => setFormData({ ...formData, voltage: value })}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Select voltage" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="110-120V">110-120V</SelectItem>
                          <SelectItem value="220-240V">220-240V</SelectItem>
                          <SelectItem value="208-230V">208-230V</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Frequency</Label>
                      <Select
                        value={formData.frequency}
                        onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="50Hz">50Hz</SelectItem>
                          <SelectItem value="60Hz">60Hz</SelectItem>
                          <SelectItem value="50/60Hz">50/60Hz</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Phase</Label>
                      <Select
                        value={formData.phase}
                        onValueChange={(value) => setFormData({ ...formData, phase: value })}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="1-Phase">1-Phase</SelectItem>
                          <SelectItem value="3-Phase">3-Phase</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-gray-300">Plug Type</Label>
                      <Select
                        value={formData.plug_type}
                        onValueChange={(value) => setFormData({ ...formData, plug_type: value })}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Select plug" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="NEMA 5-15">NEMA 5-15 (Standard)</SelectItem>
                          <SelectItem value="NEMA 6-15">NEMA 6-15</SelectItem>
                          <SelectItem value="NEMA 6-20">NEMA 6-20</SelectItem>
                          <SelectItem value="NEMA 14-30">NEMA 14-30</SelectItem>
                          <SelectItem value="Hardwired">Hardwired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Refrigerant Type</Label>
                      <Select
                        value={formData.refrigerant_type}
                        onValueChange={(value) => setFormData({ ...formData, refrigerant_type: value })}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Select refrigerant" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="R-410A">R-410A</SelectItem>
                          <SelectItem value="R-32">R-32</SelectItem>
                          <SelectItem value="R-22">R-22</SelectItem>
                          <SelectItem value="R-290">R-290 (Propane)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Efficiency Label</Label>
                      <Select
                        value={formData.efficiency_label}
                        onValueChange={(value) => setFormData({ ...formData, efficiency_label: value })}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="SEER 14">SEER 14</SelectItem>
                          <SelectItem value="SEER 16">SEER 16</SelectItem>
                          <SelectItem value="SEER 18">SEER 18</SelectItem>
                          <SelectItem value="SEER 20">SEER 20</SelectItem>
                          <SelectItem value="SEER 22+">SEER 22+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-300">Max Room Size</Label>
                    <Input
                      value={formData.max_room_size}
                      onChange={(e) => setFormData({ ...formData, max_room_size: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="e.g., 550 sq ft"
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <Label className="text-gray-300">Weight (kg)</Label>
                      <Input
                        type="number"
                        value={formData.weight_kg || ''}
                        onChange={(e) => setFormData({ ...formData, weight_kg: parseFloat(e.target.value) || undefined })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Length (cm)</Label>
                      <Input
                        type="number"
                        value={formData.length_cm || ''}
                        onChange={(e) => setFormData({ ...formData, length_cm: parseFloat(e.target.value) || undefined })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Width (cm)</Label>
                      <Input
                        type="number"
                        value={formData.width_cm || ''}
                        onChange={(e) => setFormData({ ...formData, width_cm: parseFloat(e.target.value) || undefined })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Height (cm)</Label>
                      <Input
                        type="number"
                        value={formData.height_cm || ''}
                        onChange={(e) => setFormData({ ...formData, height_cm: parseFloat(e.target.value) || undefined })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="pricing" className="space-y-4 mt-4">
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                    <p className="text-yellow-400 text-sm flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Configure bulk pricing tiers for container quantities
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-gray-300">Base Unit Price ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.base_unit_price || ''}
                        onChange={(e) => setFormData({ ...formData, base_unit_price: parseFloat(e.target.value) || undefined })}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Price per unit at full container"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Q20 Units (20ft Container)</Label>
                      <Input
                        type="number"
                        value={formData.q20_units || ''}
                        onChange={(e) => setFormData({ ...formData, q20_units: parseInt(e.target.value) || undefined })}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Units in 20ft container"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Q40 Units (40ft Container)</Label>
                      <Input
                        type="number"
                        value={formData.q40_units || ''}
                        onChange={(e) => setFormData({ ...formData, q40_units: parseInt(e.target.value) || undefined })}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Units in 40ft container"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-600 pt-4">
                    <Label className="text-cyan-400 text-lg">Price Uplift Percentages</Label>
                    <p className="text-gray-500 text-sm mb-4">Set markup percentages for smaller order quantities</p>
                    
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <Label className="text-gray-300">5-19 Units (%)</Label>
                        <Input
                          type="number"
                          value={formData.custom_uplift_5_19}
                          onChange={(e) => setFormData({ ...formData, custom_uplift_5_19: parseFloat(e.target.value) || 0 })}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">20-39 Units (%)</Label>
                        <Input
                          type="number"
                          value={formData.custom_uplift_20_39}
                          onChange={(e) => setFormData({ ...formData, custom_uplift_20_39: parseFloat(e.target.value) || 0 })}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">40-Half Container (%)</Label>
                        <Input
                          type="number"
                          value={formData.custom_uplift_40_half}
                          onChange={(e) => setFormData({ ...formData, custom_uplift_40_half: parseFloat(e.target.value) || 0 })}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Mid-Bulk (%)</Label>
                        <Input
                          type="number"
                          value={formData.mid_bulk_uplift_percent}
                          onChange={(e) => setFormData({ ...formData, mid_bulk_uplift_percent: parseFloat(e.target.value) || 0 })}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {formData.base_unit_price && formData.q20_units && (
                    <div className="bg-slate-700/50 rounded-lg p-4 mt-4">
                      <Label className="text-cyan-400">Price Preview</Label>
                      <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">5-19 units:</span>
                          <span className="text-white">${(formData.base_unit_price * (1 + formData.custom_uplift_5_19 / 100)).toFixed(2)}/unit</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">20-39 units:</span>
                          <span className="text-white">${(formData.base_unit_price * (1 + formData.custom_uplift_20_39 / 100)).toFixed(2)}/unit</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Full 20ft ({formData.q20_units} units):</span>
                          <span className="text-green-400">${formData.base_unit_price.toFixed(2)}/unit</span>
                        </div>
                        {formData.q40_units && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Full 40ft ({formData.q40_units} units):</span>
                            <span className="text-green-400">${formData.base_unit_price.toFixed(2)}/unit</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="includes" className="space-y-4 mt-4">
                  <div>
                    <Label className="text-gray-300">Comes With (Base Items)</Label>
                    <Textarea
                      value={formData.comes_with_base.join('\n')}
                      onChange={(e) => setFormData({ ...formData, comes_with_base: e.target.value.split('\n').filter(Boolean) })}
                      className="bg-slate-700 border-slate-600 text-white"
                      rows={4}
                      placeholder="Enter one item per line, e.g.:&#10;Indoor Unit&#10;Outdoor Unit&#10;Remote Control"
                    />
                    <p className="text-gray-500 text-xs mt-1">One item per line</p>
                  </div>

                  <div>
                    <Label className="text-gray-300">Included Accessories</Label>
                    <Textarea
                      value={formData.comes_with_accessories.join('\n')}
                      onChange={(e) => setFormData({ ...formData, comes_with_accessories: e.target.value.split('\n').filter(Boolean) })}
                      className="bg-slate-700 border-slate-600 text-white"
                      rows={4}
                      placeholder="Enter one item per line, e.g.:&#10;Mounting Bracket&#10;Installation Kit&#10;Line Set"
                    />
                    <p className="text-gray-500 text-xs mt-1">One item per line</p>
                  </div>
                </TabsContent>

                <TabsContent value="images" className="space-y-4 mt-4">
                  <div>
                    <Label className="text-gray-300">Main Image URL</Label>
                    <Input
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="https://..."
                    />
                  </div>
                  
                  <div>
                    <Label className="text-gray-300">Product Images</Label>
                    <ImageUpload
                      onImageUploaded={(url) => setFormData({ ...formData, images: [...formData.images, url] })}
                      currentImage={formData.images[0]}
                      bucket="product-images"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-600">
                <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search AC products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-slate-700 border-slate-600 text-white max-w-sm"
        />
        <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
          <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            <SelectItem value="all">All AC Products</SelectItem>
            <SelectItem value="configured">✓ Fully Configured</SelectItem>
            <SelectItem value="needs-config">⚠ Needs Configuration</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-white">{acProducts.length}</div>
            <div className="text-gray-400 text-sm">Total AC Products</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-400">
              {acProducts.filter(p => p.btu && p.voltage && p.ac_type).length}
            </div>
            <div className="text-gray-400 text-sm">Fully Configured</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-400">
              {acProducts.filter(p => !p.btu || !p.voltage || !p.ac_type).length}
            </div>
            <div className="text-gray-400 text-sm">Needs Configuration</div>
          </CardContent>
        </Card>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => {
          const status = getConfigStatus(product);
          
          return (
            <Card key={product.id} className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-white text-lg line-clamp-2">{product.name}</CardTitle>
                  {status === 'complete' && (
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  )}
                  {status === 'incomplete' && (
                    <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {product.ac_type && (
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      {product.ac_type}
                    </Badge>
                  )}
                  {product.btu && (
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {product.btu.toLocaleString()} BTU
                    </Badge>
                  )}
                  {product.voltage && (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      {product.voltage}
                    </Badge>
                  )}
                </div>

                {(!product.btu || !product.voltage || !product.ac_type) && (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                    ⚠ Missing: {[
                      !product.ac_type && 'AC Type',
                      !product.btu && 'BTU',
                      !product.voltage && 'Voltage'
                    ].filter(Boolean).join(', ')}
                  </Badge>
                )}

                <div className="text-sm space-y-1">
                  <div className="flex justify-between text-gray-400">
                    <span>Price:</span>
                    <span className="text-cyan-400">${product.price}</span>
                  </div>
                  {product.base_unit_price && (
                    <div className="flex justify-between text-gray-400">
                      <span>Base Unit:</span>
                      <span className="text-green-400">${product.base_unit_price}/unit</span>
                    </div>
                  )}
                  {product.q20_units && (
                    <div className="flex justify-between text-gray-400">
                      <span>20ft Container:</span>
                      <span className="text-white">{product.q20_units} units</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Wind className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No AC products found</p>
          {filterStatus === 'needs-config' && (
            <p className="text-sm mt-2">All AC products are fully configured!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ACProductManagement;
