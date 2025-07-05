import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Search, Package, Save, Loader2 } from 'lucide-react';
import { useProducts } from '@/contexts/ProductsContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ui/image-upload';

const EnhancedProductManagement = () => {
  const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: 0,
    category: 'HFC' as string,
    description: '',
    availability: 'in_stock' as 'in_stock' | 'out_of_stock' | 'preorder' | 'backorder',
    condition: 'new' as 'new' | 'used' | 'refurbished',
    stock: 0,
    epaApproved: false,
    brand: 'FrigidFlow',
    chemicalFormula: '',
    casNumber: '',
    hazardClass: '',
    unNumber: '',
    shippingWeight: '',
    image: '',
    images: [] as string[],
    sdsUrl: '',
    applications: [] as string[],
    technicalSpecs: {} as Record<string, any>,
    packaging: [] as string[],
    gtin: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      price: 0,
      category: 'HFC',
      description: '',
      availability: 'in_stock',
      condition: 'new',
      stock: 0,
      epaApproved: false,
      brand: 'FrigidFlow',
      chemicalFormula: '',
      casNumber: '',
      hazardClass: '',
      unNumber: '',
      shippingWeight: '',
      image: '',
      images: [],
      sdsUrl: '',
      applications: [],
      technicalSpecs: {},
      packaging: [],
      gtin: '',
      dimensions: {
        length: '',
        width: '',
        height: ''
      }
    });
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      const productData = {
        ...formData,
        images: formData.image ? [formData.image, ...formData.images] : formData.images
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }
      
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      // Error handling is done in the context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: any) => {
    setFormData({
      name: product.name || '',
      sku: product.sku || '',
      price: product.price || 0,
      category: product.category || 'HFC',
      description: product.description || '',
      availability: product.availability || 'in_stock',
      condition: product.condition || 'new',
      stock: product.stock || 0,
      epaApproved: product.epaApproved || false,
      brand: product.brand || 'FrigidFlow',
      chemicalFormula: product.chemicalFormula || '',
      casNumber: product.casNumber || '',
      hazardClass: product.hazardClass || '',
      unNumber: product.unNumber || '',
      shippingWeight: product.shippingWeight || '',
      image: product.image || product.images?.[0] || '',
      images: product.images || [],
      sdsUrl: product.sdsUrl || '',
      applications: Array.isArray(product.applications) ? product.applications : [],
      technicalSpecs: product.technicalSpecs || {},
      packaging: Array.isArray(product.packaging) ? product.packaging : [],
      gtin: product.gtin || '',
      dimensions: product.dimensions || { length: '', width: '', height: '' }
    });
    setEditingProduct(product);
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
      } catch (error) {
        // Error handling is done in the context
      }
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading products...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Enhanced Product Management</h1>
          <p className="text-gray-300">Manage your complete product catalog with images and detailed specifications</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                resetForm();
                setIsAddDialogOpen(true);
              }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl bg-slate-800 border-slate-700 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="images">Images</TabsTrigger>
                  <TabsTrigger value="specs">Specifications</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-white">Product Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="sku" className="text-white">SKU</Label>
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price" className="text-white">Price *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock" className="text-white">Stock Quantity</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="brand" className="text-white">Brand</Label>
                      <Input
                        id="brand"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="category" className="text-white">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value: string) => 
                          setFormData({ ...formData, category: value })
                        }
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
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
                      <Label htmlFor="availability" className="text-white">Availability</Label>
                      <Select
                        value={formData.availability}
                        onValueChange={(value: 'in_stock' | 'out_of_stock' | 'preorder' | 'backorder') => 
                          setFormData({ ...formData, availability: value })
                        }
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in_stock">In Stock</SelectItem>
                          <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                          <SelectItem value="preorder">Pre-order</SelectItem>
                          <SelectItem value="backorder">Backorder</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="condition" className="text-white">Condition</Label>
                      <Select
                        value={formData.condition}
                        onValueChange={(value: 'new' | 'used' | 'refurbished') => 
                          setFormData({ ...formData, condition: value })
                        }
                      >
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
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-white">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="epaApproved"
                      checked={formData.epaApproved}
                      onCheckedChange={(checked) => setFormData({ ...formData, epaApproved: checked })}
                    />
                    <Label htmlFor="epaApproved" className="text-white">EPA Approved</Label>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="chemicalFormula" className="text-white">Chemical Formula</Label>
                      <Input
                        id="chemicalFormula"
                        value={formData.chemicalFormula}
                        onChange={(e) => setFormData({ ...formData, chemicalFormula: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="casNumber" className="text-white">CAS Number</Label>
                      <Input
                        id="casNumber"
                        value={formData.casNumber}
                        onChange={(e) => setFormData({ ...formData, casNumber: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hazardClass" className="text-white">Hazard Class</Label>
                      <Input
                        id="hazardClass"
                        value={formData.hazardClass}
                        onChange={(e) => setFormData({ ...formData, hazardClass: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="unNumber" className="text-white">UN Number</Label>
                      <Input
                        id="unNumber"
                        value={formData.unNumber}
                        onChange={(e) => setFormData({ ...formData, unNumber: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="shippingWeight" className="text-white">Shipping Weight</Label>
                      <Input
                        id="shippingWeight"
                        value={formData.shippingWeight}
                        onChange={(e) => setFormData({ ...formData, shippingWeight: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="e.g., 30 lbs"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gtin" className="text-white">GTIN/Barcode</Label>
                      <Input
                        id="gtin"
                        value={formData.gtin}
                        onChange={(e) => setFormData({ ...formData, gtin: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-white">Dimensions</Label>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div>
                        <Label htmlFor="length" className="text-sm text-gray-300">Length</Label>
                        <Input
                          id="length"
                          value={formData.dimensions.length}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            dimensions: { ...formData.dimensions, length: e.target.value }
                          })}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="e.g., 12 in"
                        />
                      </div>
                      <div>
                        <Label htmlFor="width" className="text-sm text-gray-300">Width</Label>
                        <Input
                          id="width"
                          value={formData.dimensions.width}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            dimensions: { ...formData.dimensions, width: e.target.value }
                          })}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="e.g., 12 in"
                        />
                      </div>
                      <div>
                        <Label htmlFor="height" className="text-sm text-gray-300">Height</Label>
                        <Input
                          id="height"
                          value={formData.dimensions.height}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            dimensions: { ...formData.dimensions, height: e.target.value }
                          })}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="e.g., 18 in"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="sdsUrl" className="text-white">SDS Document URL</Label>
                    <Input
                      id="sdsUrl"
                      value={formData.sdsUrl}
                      onChange={(e) => setFormData({ ...formData, sdsUrl: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="https://..."
                    />
                  </div>
                </TabsContent>

                <TabsContent value="images" className="space-y-4">
                  <ImageUpload
                    onImageUploaded={(url) => setFormData({ ...formData, image: url })}
                    currentImage={formData.image}
                    onImageRemoved={() => setFormData({ ...formData, image: '' })}
                    label="Product Image"
                  />
                </TabsContent>

                <TabsContent value="specs" className="space-y-4">
                  <div>
                    <Label className="text-white">Applications (one per line)</Label>
                    <Textarea
                      value={formData.applications.join('\n')}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        applications: e.target.value.split('\n').filter(app => app.trim()) 
                      })}
                      className="bg-slate-700 border-slate-600 text-white"
                      rows={3}
                      placeholder="Air Conditioning&#10;Refrigeration&#10;Heat Pumps"
                    />
                  </div>

                  <div>
                    <Label className="text-white">Packaging Options (one per line)</Label>
                    <Textarea
                      value={formData.packaging.join('\n')}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        packaging: e.target.value.split('\n').filter(pkg => pkg.trim()) 
                      })}
                      className="bg-slate-700 border-slate-600 text-white"
                      rows={3}
                      placeholder="30 lb Cylinder&#10;125 lb Cylinder&#10;Bulk Containers"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsAddDialogOpen(false);
                  }}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {editingProduct ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="HFC">HFC</SelectItem>
                <SelectItem value="HFO">HFO</SelectItem>
                <SelectItem value="Natural">Natural</SelectItem>
                <SelectItem value="HCFC">HCFC</SelectItem>
                <SelectItem value="CFC">CFC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg mb-1">{product.name}</CardTitle>
                  <p className="text-gray-400 text-sm">SKU: {product.sku}</p>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(product)}
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(product.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {product.image && (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
              )}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-cyan-400">${product.price}</span>
                  <Badge 
                    variant={product.availability === 'in_stock' ? 'default' : 'secondary'}
                    className={product.availability === 'in_stock' ? 'bg-green-500' : 'bg-red-500'}
                  >
                    {product.availability?.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Category:</span>
                  <span className="text-white">{product.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Stock:</span>
                  <span className="text-white">{product.stock || 0}</span>
                </div>
                {product.epaApproved && (
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    EPA Approved
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
            <p className="text-gray-400">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Start by adding your first product'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedProductManagement;
