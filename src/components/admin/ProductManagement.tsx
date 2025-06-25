
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Image as ImageIcon, Upload, X, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  thumbnail_url: string;
  images: string[];
  stock_quantity: number;
  sku: string;
  category: string;
  brand: string;
  condition: string;
  availability: string;
  epa_approved: boolean;
  packaging: string[];
  applications: string[];
  technical_specs: Record<string, any>;
  sds_url: string;
  certificate_urls: string[];
  gtin: string;
  shipping_weight: string;
  dimensions: Record<string, string>;
  chemical_formula: string;
  cas_number: string;
  un_number: string;
  hazard_class: string;
  created_at: string;
}

const ProductManagement = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock_quantity: 0,
    sku: '',
    category: '',
    brand: 'FrigidFlow',
    condition: 'new',
    availability: 'in_stock',
    epa_approved: false,
    packaging: [] as string[],
    applications: [] as string[],
    technical_specs: {} as Record<string, any>,
    gtin: '',
    shipping_weight: '',
    dimensions: { length: '', width: '', height: '' },
    chemical_formula: '',
    cas_number: '',
    un_number: '',
    hazard_class: ''
  });
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);
  const [sdsFile, setSdsFile] = useState<File | null>(null);
  const [packagingInput, setPackagingInput] = useState('');
  const [applicationInput, setApplicationInput] = useState('');
  const [techSpecKey, setTechSpecKey] = useState('');
  const [techSpecValue, setTechSpecValue] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch products
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      console.log('Fetching products...');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      console.log('Products fetched:', data);
      return data as Product[];
    },
    retry: 3,
    retryDelay: 1000,
  });

  // Upload file to Supabase storage
  const uploadFile = async (file: File, bucket: string, folder: string = '') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      console.log('Creating product with data:', productData);
      
      // Upload images
      const imageUrls = [];
      for (const file of imageFiles) {
        const url = await uploadFile(file, 'product-images', 'thumbnails');
        imageUrls.push(url);
      }

      // Upload certificates
      const certificateUrls = [];
      for (const file of certificateFiles) {
        const url = await uploadFile(file, 'product-documents', 'certificates');
        certificateUrls.push(url);
      }

      // Upload SDS
      let sdsUrl = '';
      if (sdsFile) {
        sdsUrl = await uploadFile(sdsFile, 'product-documents', 'sds');
      }

      const finalProductData = {
        ...productData,
        thumbnail_url: imageUrls[0] || '/placeholder.svg',
        images: imageUrls,
        certificate_urls: certificateUrls,
        sds_url: sdsUrl,
        packaging: productData.packaging,
        applications: productData.applications,
        technical_specs: productData.technical_specs,
        dimensions: productData.dimensions
      };

      console.log('Final product data to insert:', finalProductData);

      const { data, error } = await supabase
        .from('products')
        .insert([finalProductData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating product:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: 'Product created successfully!' });
      setActiveTab('list');
      resetForm();
    },
    onError: (error: any) => {
      console.error('Create product error:', error);
      toast({ title: 'Error creating product', description: error.message, variant: 'destructive' });
    }
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, ...productData }: any) => {
      console.log('Updating product:', id, productData);
      
      // Handle file uploads for updates
      let imageUrls = editingProduct?.images || [];
      let certificateUrls = editingProduct?.certificate_urls || [];
      let sdsUrl = editingProduct?.sds_url || '';

      // Upload new images
      if (imageFiles.length > 0) {
        const newImageUrls = [];
        for (const file of imageFiles) {
          const url = await uploadFile(file, 'product-images', 'thumbnails');
          newImageUrls.push(url);
        }
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      // Upload new certificates
      if (certificateFiles.length > 0) {
        const newCertificateUrls = [];
        for (const file of certificateFiles) {
          const url = await uploadFile(file, 'product-documents', 'certificates');
          newCertificateUrls.push(url);
        }
        certificateUrls = [...certificateUrls, ...newCertificateUrls];
      }

      // Upload new SDS
      if (sdsFile) {
        sdsUrl = await uploadFile(sdsFile, 'product-documents', 'sds');
      }

      const finalProductData = {
        ...productData,
        thumbnail_url: imageUrls[0] || '/placeholder.svg',
        images: imageUrls,
        certificate_urls: certificateUrls,
        sds_url: sdsUrl
      };

      const { data, error } = await supabase
        .from('products')
        .update(finalProductData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating product:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: 'Product updated successfully!' });
      setActiveTab('list');
      resetForm();
    },
    onError: (error: any) => {
      console.error('Update product error:', error);
      toast({ title: 'Error updating product', description: error.message, variant: 'destructive' });
    }
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting product:', id);
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting product:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: 'Product deleted successfully!' });
    },
    onError: (error: any) => {
      console.error('Delete product error:', error);
      toast({ title: 'Error deleting product', description: error.message, variant: 'destructive' });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '', description: '', price: 0, stock_quantity: 0, sku: '', category: '',
      brand: 'FrigidFlow', condition: 'new', availability: 'in_stock', epa_approved: false,
      packaging: [], applications: [], technical_specs: {}, gtin: '', shipping_weight: '',
      dimensions: { length: '', width: '', height: '' }, chemical_formula: '', cas_number: '',
      un_number: '', hazard_class: ''
    });
    setEditingProduct(null);
    setImageFiles([]);
    setCertificateFiles([]);
    setSdsFile(null);
    setPackagingInput('');
    setApplicationInput('');
    setTechSpecKey('');
    setTechSpecValue('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.sku.trim() || !formData.category) {
      toast({ title: 'Error', description: 'Name, SKU, and Category are required', variant: 'destructive' });
      return;
    }

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, ...formData });
    } else {
      createProductMutation.mutate(formData);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock_quantity: product.stock_quantity || 0,
      sku: product.sku || '',
      category: product.category || '',
      brand: product.brand || 'FrigidFlow',
      condition: product.condition || 'new',
      availability: product.availability || 'in_stock',
      epa_approved: product.epa_approved || false,
      packaging: product.packaging || [],
      applications: product.applications || [],
      technical_specs: product.technical_specs || {},
      gtin: product.gtin || '',
      shipping_weight: product.shipping_weight || '',
      dimensions: product.dimensions || { length: '', width: '', height: '' },
      chemical_formula: product.chemical_formula || '',
      cas_number: product.cas_number || '',
      un_number: product.un_number || '',
      hazard_class: product.hazard_class || ''
    });
    setActiveTab('form');
  };

  const addPackaging = () => {
    if (packagingInput.trim()) {
      setFormData({ ...formData, packaging: [...formData.packaging, packagingInput.trim()] });
      setPackagingInput('');
    }
  };

  const removePackaging = (index: number) => {
    setFormData({ ...formData, packaging: formData.packaging.filter((_, i) => i !== index) });
  };

  const addApplication = () => {
    if (applicationInput.trim()) {
      setFormData({ ...formData, applications: [...formData.applications, applicationInput.trim()] });
      setApplicationInput('');
    }
  };

  const removeApplication = (index: number) => {
    setFormData({ ...formData, applications: formData.applications.filter((_, i) => i !== index) });
  };

  const addTechnicalSpec = () => {
    if (techSpecKey.trim() && techSpecValue.trim()) {
      setFormData({
        ...formData,
        technical_specs: { ...formData.technical_specs, [techSpecKey.trim()]: techSpecValue.trim() }
      });
      setTechSpecKey('');
      setTechSpecValue('');
    }
  };

  const removeTechnicalSpec = (key: string) => {
    const newSpecs = { ...formData.technical_specs };
    delete newSpecs[key];
    setFormData({ ...formData, technical_specs: newSpecs });
  };

  if (error) {
    console.error('ProductManagement error:', error);
    return (
      <div className="p-6">
        <div className="text-red-400">Error loading products: {error.message}</div>
        <Button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-products'] })}
          className="mt-4 bg-cyan-500 hover:bg-cyan-600"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Product Management</h1>
        <p className="text-gray-300">Manage your product catalog</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="list">Product List</TabsTrigger>
          <TabsTrigger value="form">
            {editingProduct ? 'Edit Product' : 'Add Product'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Products</CardTitle>
                <CardDescription className="text-gray-300">
                  Manage your product inventory
                </CardDescription>
              </div>
              <Button 
                onClick={() => {
                  resetForm();
                  setActiveTab('form');
                }}
                className="bg-cyan-500 hover:bg-cyan-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="text-white">Loading products...</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <div key={product.id} className="border border-slate-600 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                              {product.thumbnail_url && product.thumbnail_url !== '/placeholder.svg' ? (
                                <img src={product.thumbnail_url} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <ImageIcon className="h-6 w-6 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <h3 className="text-white font-medium">{product.name}</h3>
                              <p className="text-gray-400 text-sm">{product.description}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-cyan-400 font-medium">${product.price}</span>
                                <Badge variant="secondary">SKU: {product.sku}</Badge>
                                <Badge variant="secondary">Stock: {product.stock_quantity || 0}</Badge>
                                {product.epa_approved && <Badge className="bg-green-600">EPA Approved</Badge>}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(product)}
                              className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteProductMutation.mutate(product.id)}
                              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                              disabled={deleteProductMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No products found. Add your first product!</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="form">
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList>
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="media">Images & Documents</TabsTrigger>
                <TabsTrigger value="applications">Applications</TabsTrigger>
                <TabsTrigger value="specifications">Technical Specs</TabsTrigger>
                <TabsTrigger value="packaging">Packaging</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <Card className="bg-slate-800/50 border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-white">Basic Product Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Product Name *</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter product name"
                          required
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">SKU *</Label>
                        <Input
                          value={formData.sku}
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                          placeholder="Enter SKU"
                          required
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Category *</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="HFC">HFC</SelectItem>
                            <SelectItem value="HFO">HFO</SelectItem>
                            <SelectItem value="Natural">Natural</SelectItem>
                            <SelectItem value="HCFC">HCFC</SelectItem>
                            <SelectItem value="CFC">CFC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-gray-300">Brand</Label>
                        <Input
                          value={formData.brand}
                          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Price ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Stock Quantity</Label>
                        <Input
                          type="number"
                          value={formData.stock_quantity}
                          onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-300">Description</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Condition</Label>
                        <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value })}>
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="used">Used</SelectItem>
                            <SelectItem value="refurbished">Refurbished</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-gray-300">Availability</Label>
                        <Select value={formData.availability} onValueChange={(value) => setFormData({ ...formData, availability: value })}>
                          <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="in_stock">In Stock</SelectItem>
                            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                            <SelectItem value="preorder">Preorder</SelectItem>
                            <SelectItem value="backorder">Backorder</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={formData.epa_approved}
                        onCheckedChange={(checked) => setFormData({ ...formData, epa_approved: checked as boolean })}
                      />
                      <Label className="text-gray-300">EPA Approved</Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="media">
                <Card className="bg-slate-800/50 border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-white">Images & Documents</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Image Upload */}
                    <div>
                      <Label className="text-gray-300 block mb-2">Product Images</Label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
                        className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                      />
                      {imageFiles.length > 0 && (
                        <div className="mt-2 text-green-400 text-sm">
                          {imageFiles.length} image(s) selected
                        </div>
                      )}
                    </div>

                    {/* Certificate Upload */}
                    <div>
                      <Label className="text-gray-300 block mb-2">Certificates</Label>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setCertificateFiles(Array.from(e.target.files || []))}
                        className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      />
                      {certificateFiles.length > 0 && (
                        <div className="mt-2 text-green-400 text-sm">
                          {certificateFiles.length} certificate(s) selected
                        </div>
                      )}
                    </div>

                    {/* SDS Upload */}
                    <div>
                      <Label className="text-gray-300 block mb-2">Safety Data Sheet (SDS)</Label>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setSdsFile(e.target.files?.[0] || null)}
                        className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                      />
                      {sdsFile && (
                        <div className="mt-2 text-green-400 text-sm">
                          SDS file selected: {sdsFile.name}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="applications">
                <Card className="bg-slate-800/50 border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-white">Applications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 mb-4">
                      <Input
                        value={applicationInput}
                        onChange={(e) => setApplicationInput(e.target.value)}
                        placeholder="e.g., Residential AC"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addApplication())}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                      <Button type="button" onClick={addApplication} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.applications.map((app, index) => (
                        <div key={index} className="bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                          {app}
                          <button type="button" onClick={() => removeApplication(index)}>
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="specifications">
                <Card className="bg-slate-800/50 border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-white">Technical Specifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Chemical Formula</Label>
                        <Input
                          value={formData.chemical_formula}
                          onChange={(e) => setFormData({ ...formData, chemical_formula: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">CAS Number</Label>
                        <Input
                          value={formData.cas_number}
                          onChange={(e) => setFormData({ ...formData, cas_number: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">UN Number</Label>
                        <Input
                          value={formData.un_number}
                          onChange={(e) => setFormData({ ...formData, un_number: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Hazard Class</Label>
                        <Input
                          value={formData.hazard_class}
                          onChange={(e) => setFormData({ ...formData, hazard_class: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-300 block mb-2">Custom Technical Specifications</Label>
                      <div className="flex gap-2 mb-4">
                        <Input
                          value={techSpecKey}
                          onChange={(e) => setTechSpecKey(e.target.value)}
                          placeholder="Specification name"
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                        <Input
                          value={techSpecValue}
                          onChange={(e) => setTechSpecValue(e.target.value)}
                          placeholder="Specification value"
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                        <Button type="button" onClick={addTechnicalSpec} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {Object.entries(formData.technical_specs).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between bg-slate-700 p-2 rounded">
                            <span className="text-white">{key}: {value}</span>
                            <button type="button" onClick={() => removeTechnicalSpec(key)}>
                              <X className="h-4 w-4 text-red-400" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="packaging">
                <Card className="bg-slate-800/50 border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="text-white">Packaging Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-gray-300 block mb-2">Packaging Types</Label>
                      <div className="flex gap-2 mb-4">
                        <Input
                          value={packagingInput}
                          onChange={(e) => setPackagingInput(e.target.value)}
                          placeholder="e.g., 30 lb Cylinder"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPackaging())}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                        <Button type="button" onClick={addPackaging} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.packaging.map((pkg, index) => (
                          <div key={index} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            {pkg}
                            <button type="button" onClick={() => removePackaging(index)}>
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Shipping Weight</Label>
                        <Input
                          value={formData.shipping_weight}
                          onChange={(e) => setFormData({ ...formData, shipping_weight: e.target.value })}
                          placeholder="e.g., 30 lbs"
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">GTIN</Label>
                        <Input
                          value={formData.gtin}
                          onChange={(e) => setFormData({ ...formData, gtin: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-300 block mb-2">Dimensions</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          value={formData.dimensions.length}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            dimensions: { ...formData.dimensions, length: e.target.value }
                          })}
                          placeholder="Length"
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                        <Input
                          value={formData.dimensions.width}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            dimensions: { ...formData.dimensions, width: e.target.value }
                          })}
                          placeholder="Width"
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                        <Input
                          value={formData.dimensions.height}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            dimensions: { ...formData.dimensions, height: e.target.value }
                          })}
                          placeholder="Height"
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex space-x-4 mt-6">
              <Button 
                type="submit" 
                className="bg-cyan-500 hover:bg-cyan-600"
                disabled={createProductMutation.isPending || updateProductMutation.isPending}
              >
                {createProductMutation.isPending || updateProductMutation.isPending 
                  ? 'Saving...' 
                  : editingProduct ? 'Update Product' : 'Create Product'
                }
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  resetForm();
                  setActiveTab('list');
                }}
                className="border-slate-600 text-gray-300 hover:bg-slate-700"
              >
                Cancel
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductManagement;
