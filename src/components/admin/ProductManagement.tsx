
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
import { Plus, Edit, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProducts, Product } from '@/contexts/ProductsContext';

const ProductManagement = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    sku: '',
    category: '',
    brand: 'FrigidFlow',
    condition: 'new' as const,
    availability: 'in_stock' as const,
    epaApproved: false,
    packaging: [] as string[],
    applications: [] as string[],
    gtin: '',
    shippingWeight: '',
    dimensions: { length: '', width: '', height: '' },
    chemicalFormula: '',
    casNumber: '',
    unNumber: '',
    hazardClass: '',
    image: '/placeholder.svg'
  });
  
  const [packagingInput, setPackagingInput] = useState('');
  const [applicationInput, setApplicationInput] = useState('');

  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      name: '', description: '', price: 0, stock: 0, sku: '', category: '',
      brand: 'FrigidFlow', condition: 'new', availability: 'in_stock', epaApproved: false,
      packaging: [], applications: [], gtin: '', shippingWeight: '',
      dimensions: { length: '', width: '', height: '' }, chemicalFormula: '', casNumber: '',
      unNumber: '', hazardClass: '', image: '/placeholder.svg'
    });
    setEditingProduct(null);
    setPackagingInput('');
    setApplicationInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.sku.trim() || !formData.category) {
      toast({ title: 'Error', description: 'Name, SKU, and Category are required', variant: 'destructive' });
      return;
    }

    const productData = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      image: formData.image,
      sku: formData.sku,
      epaApproved: formData.epaApproved,
      category: formData.category,
      stock: formData.stock,
      packaging: formData.packaging,
      applications: formData.applications,
      brand: formData.brand,
      condition: formData.condition,
      availability: formData.availability,
      shippingWeight: formData.shippingWeight,
      dimensions: formData.dimensions,
      chemicalFormula: formData.chemicalFormula,
      casNumber: formData.casNumber,
      unNumber: formData.unNumber,
      hazardClass: formData.hazardClass,
      gtin: formData.gtin
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast({ title: 'Product updated successfully!' });
    } else {
      addProduct(productData);
      toast({ title: 'Product created successfully!' });
    }
    
    setActiveTab('list');
    resetForm();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock || 0,
      sku: product.sku || '',
      category: product.category || '',
      brand: product.brand || 'FrigidFlow',
      condition: product.condition || 'new',
      availability: product.availability || 'in_stock',
      epaApproved: product.epaApproved || false,
      packaging: product.packaging || [],
      applications: product.applications || [],
      gtin: product.gtin || '',
      shippingWeight: product.shippingWeight || '',
      dimensions: product.dimensions || { length: '', width: '', height: '' },
      chemicalFormula: product.chemicalFormula || '',
      casNumber: product.casNumber || '',
      unNumber: product.unNumber || '',
      hazardClass: product.hazardClass || '',
      image: product.image || '/placeholder.svg'
    });
    setActiveTab('form');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      toast({ title: 'Product deleted successfully!' });
    }
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
                <CardTitle className="text-white">Products ({products.length})</CardTitle>
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
              <div className="space-y-4">
                {products.length > 0 ? (
                  products.map((product) => (
                    <div key={product.id} className="border border-slate-600 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                            {product.image && product.image !== '/placeholder.svg' ? (
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
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
                              <Badge variant="secondary">Stock: {product.stock || 0}</Badge>
                              <Badge variant="secondary">{product.category}</Badge>
                              {product.epaApproved && <Badge className="bg-green-600">EPA Approved</Badge>}
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
                            onClick={() => handleDelete(product.id)}
                            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="form">
          <form onSubmit={handleSubmit}>
            <Card className="bg-slate-800/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </CardTitle>
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
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
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
                    <Select value={formData.condition} onValueChange={(value: any) => setFormData({ ...formData, condition: value })}>
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
                    <Select value={formData.availability} onValueChange={(value: any) => setFormData({ ...formData, availability: value })}>
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
                    checked={formData.epaApproved}
                    onCheckedChange={(checked) => setFormData({ ...formData, epaApproved: checked as boolean })}
                  />
                  <Label className="text-gray-300">EPA Approved</Label>
                </div>

                {/* Packaging Section */}
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

                {/* Applications Section */}
                <div>
                  <Label className="text-gray-300 block mb-2">Applications</Label>
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
                </div>

                {/* Technical Specs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Chemical Formula</Label>
                    <Input
                      value={formData.chemicalFormula}
                      onChange={(e) => setFormData({ ...formData, chemicalFormula: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">CAS Number</Label>
                    <Input
                      value={formData.casNumber}
                      onChange={(e) => setFormData({ ...formData, casNumber: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">UN Number</Label>
                    <Input
                      value={formData.unNumber}
                      onChange={(e) => setFormData({ ...formData, unNumber: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Hazard Class</Label>
                    <Input
                      value={formData.hazardClass}
                      onChange={(e) => setFormData({ ...formData, hazardClass: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex space-x-4 mt-6">
              <Button 
                type="submit" 
                className="bg-cyan-500 hover:bg-cyan-600"
              >
                {editingProduct ? 'Update Product' : 'Create Product'}
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
