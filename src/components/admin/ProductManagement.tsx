
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search, Package } from 'lucide-react';
import { useProducts } from '@/contexts/ProductsContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const ProductManagement = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Form state for new/edit product - aligned with Product interface
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: 0,
    pallet_price: 0,
    container_20ft_price: 0,
    container_40ft_price: 0,
    discount_20ft: 0.30,
    discount_40ft: 0.45,
    packaging_options: ["1 Pallet", "20ft Container", "40ft Container"],
    category: 'HFC' as string,
    description: '',
    availability: 'in_stock' as 'in_stock' | 'out_of_stock' | 'preorder' | 'backorder',
    condition: 'new' as 'new' | 'used' | 'refurbished',
    stock: 0,
    epaApproved: false,
    brand: '',
    chemicalFormula: '',
    casNumber: '',
    hazardClass: '',
    unNumber: '',
    shippingWeight: '',
    image: '/placeholder.svg'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      price: 0,
      pallet_price: 0,
      container_20ft_price: 0,
      container_40ft_price: 0,
      discount_20ft: 0.30,
      discount_40ft: 0.45,
      packaging_options: ["1 Pallet", "20ft Container", "40ft Container"],
      category: 'HFC',
      description: '',
      availability: 'in_stock',
      condition: 'new',
      stock: 0,
      epaApproved: false,
      brand: '',
      chemicalFormula: '',
      casNumber: '',
      hazardClass: '',
      unNumber: '',
      shippingWeight: '',
      image: '/placeholder.svg'
    });
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        await addProduct(formData);
        toast({
          title: "Success",
          description: "Product added successfully",
        });
      }
      
      resetForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: any) => {
    setFormData({
      name: product.name || '',
      sku: product.sku || '',
      price: product.price || 0,
      pallet_price: product.pallet_price || 0,
      container_20ft_price: product.container_20ft_price || 0,
      container_40ft_price: product.container_40ft_price || 0,
      discount_20ft: product.discount_20ft || 0.30,
      discount_40ft: product.discount_40ft || 0.45,
      packaging_options: product.packaging_options || ["1 Pallet", "20ft Container", "40ft Container"],
      category: product.category || 'HFC',
      description: product.description || '',
      availability: product.availability || 'in_stock',
      condition: product.condition || 'new',
      stock: product.stock || 0,
      epaApproved: product.epaApproved || false,
      brand: product.brand || '',
      chemicalFormula: product.chemicalFormula || '',
      casNumber: product.casNumber || '',
      hazardClass: product.hazardClass || '',
      unNumber: product.unNumber || '',
      shippingWeight: product.shippingWeight || '',
      image: product.image || '/placeholder.svg'
    });
    setEditingProduct(product);
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        toast({
          title: "Success",
          description: "Product deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive",
        });
      }
    }
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Product Management</h1>
          <p className="text-gray-300">Manage your product catalog</p>
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
          <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-white">Product Name</Label>
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

              {/* Bulk Pricing Section */}
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                <Label className="text-cyan-400 text-lg font-semibold block mb-4">Bulk Pricing Structure</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="pallet_price" className="text-white">1 Pallet Price ($)</Label>
                    <Input
                      id="pallet_price"
                      type="number"
                      step="0.01"
                      value={formData.pallet_price}
                      onChange={(e) => {
                        const palletPrice = parseFloat(e.target.value) || 0;
                        setFormData({
                          ...formData, 
                          price: palletPrice,
                          pallet_price: palletPrice,
                          container_20ft_price: palletPrice * (1 - formData.discount_20ft),
                          container_40ft_price: palletPrice * (1 - formData.discount_40ft)
                        });
                      }}
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">Base price - no discount</p>
                  </div>
                  <div>
                    <Label htmlFor="container_20ft_price" className="text-white">20ft Container Price ($)</Label>
                    <Input
                      id="container_20ft_price"
                      type="number"
                      step="0.01"
                      value={formData.container_20ft_price}
                      className="bg-slate-700 border-slate-600 text-white"
                      readOnly
                    />
                    <p className="text-xs text-green-400 mt-1">30% discount applied</p>
                  </div>
                  <div>
                    <Label htmlFor="container_40ft_price" className="text-white">40ft Container Price ($)</Label>
                    <Input
                      id="container_40ft_price"
                      type="number"
                      step="0.01"
                      value={formData.container_40ft_price}
                      className="bg-slate-700 border-slate-600 text-white"
                      readOnly
                    />
                    <p className="text-xs text-green-400 mt-1">45% discount applied</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="discount_20ft" className="text-white">20ft Container Discount (%)</Label>
                    <Input
                      id="discount_20ft"
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={formData.discount_20ft}
                      onChange={(e) => {
                        const discount = parseFloat(e.target.value) || 0.30;
                        setFormData({
                          ...formData, 
                          discount_20ft: discount,
                          container_20ft_price: formData.pallet_price * (1 - discount)
                        });
                      }}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <p className="text-xs text-gray-400 mt-1">Default: 0.30 (30%)</p>
                  </div>
                  <div>
                    <Label htmlFor="discount_40ft" className="text-white">40ft Container Discount (%)</Label>
                    <Input
                      id="discount_40ft"
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={formData.discount_40ft}
                      onChange={(e) => {
                        const discount = parseFloat(e.target.value) || 0.45;
                        setFormData({
                          ...formData, 
                          discount_40ft: discount,
                          container_40ft_price: formData.pallet_price * (1 - discount)
                        });
                      }}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <p className="text-xs text-gray-400 mt-1">Default: 0.45 (45%)</p>
                  </div>
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

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsAddDialogOpen(false);
                  }}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
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

      {/* Products Grid */}
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
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-cyan-400">${product.pallet_price || product.price}</span>
                    <p className="text-xs text-gray-400">1 Pallet</p>
                  </div>
                  <Badge 
                    variant={product.availability === 'in_stock' ? 'default' : 'secondary'}
                    className={product.availability === 'in_stock' ? 'bg-green-500' : 'bg-red-500'}
                  >
                    {product.availability?.replace('_', ' ')}
                  </Badge>
                </div>
                {product.container_20ft_price && product.container_40ft_price && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">20ft Container:</span>
                      <span className="text-green-400 font-semibold">${product.container_20ft_price} (-30%)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">40ft Container:</span>
                      <span className="text-green-400 font-semibold">${product.container_40ft_price} (-45%)</span>
                    </div>
                  </div>
                )}
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

      {filteredProducts.length === 0 && (
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

export default ProductManagement;
