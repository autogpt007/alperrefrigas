
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Upload, X, ImageIcon } from 'lucide-react';
import { useProducts } from '../../contexts/ProductsContext';
import { useToast } from '../../hooks/use-toast';

const ProductForm = () => {
  const { addProduct } = useProducts();
  const { toast } = useToast();
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    image: '',
    sku: '',
    epaApproved: false,
    category: '',
    description: '',
    stock: 0,
    packaging: [] as string[],
    applications: [] as string[]
  });

  const [imagePreview, setImagePreview] = useState('');
  const [packagingInput, setPackagingInput] = useState('');
  const [applicationInput, setApplicationInput] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setNewProduct({...newProduct, image: result});
      };
      reader.readAsDataURL(file);
    }
  };

  const addPackaging = () => {
    if (packagingInput.trim()) {
      setNewProduct({
        ...newProduct,
        packaging: [...newProduct.packaging, packagingInput.trim()]
      });
      setPackagingInput('');
    }
  };

  const removePackaging = (index: number) => {
    setNewProduct({
      ...newProduct,
      packaging: newProduct.packaging.filter((_, i) => i !== index)
    });
  };

  const addApplication = () => {
    if (applicationInput.trim()) {
      setNewProduct({
        ...newProduct,
        applications: [...newProduct.applications, applicationInput.trim()]
      });
      setApplicationInput('');
    }
  };

  const removeApplication = (index: number) => {
    setNewProduct({
      ...newProduct,
      applications: newProduct.applications.filter((_, i) => i !== index)
    });
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.sku || !newProduct.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Name, SKU, Category)",
        variant: "destructive"
      });
      return;
    }

    addProduct(newProduct);
    
    toast({
      title: "Product Added",
      description: `${newProduct.name} has been added successfully`,
    });

    // Reset form
    setNewProduct({
      name: '',
      price: 0,
      image: '',
      sku: '',
      epaApproved: false,
      category: '',
      description: '',
      stock: 0,
      packaging: [],
      applications: []
    });
    setImagePreview('');
  };

  return (
    <Card className="bg-slate-800/50 border-cyan-500/20">
      <CardHeader>
        <CardTitle className="text-cyan-400 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Product
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image Upload */}
        <div>
          <Label className="text-gray-300 block mb-2">Product Image</Label>
          <div className="flex items-center gap-4">
            <div className="w-32 h-32 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center bg-slate-700/50">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <ImageIcon className="h-8 w-8 text-gray-500" />
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <Label htmlFor="image-upload" className="cursor-pointer">
                <Button type="button" className="bg-blue-600 hover:bg-blue-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              </Label>
              <p className="text-gray-400 text-sm mt-2">Upload a product image (JPG, PNG)</p>
            </div>
          </div>
        </div>

        {/* Basic Product Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300">Product Name *</Label>
            <Input
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="e.g., Refrigerant R-410A"
            />
          </div>
          <div>
            <Label className="text-gray-300">SKU *</Label>
            <Input
              value={newProduct.sku}
              onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="e.g., R410A-30LB"
            />
          </div>
          <div>
            <Label className="text-gray-300">Price ($)</Label>
            <Input
              type="number"
              step="0.01"
              value={newProduct.price}
              onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div>
            <Label className="text-gray-300">Stock Quantity</Label>
            <Input
              type="number"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </div>

        {/* Category and EPA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300">Category *</Label>
            <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HFC">HFC</SelectItem>
                <SelectItem value="HFO">HFO</SelectItem>
                <SelectItem value="Natural">Natural</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 mt-6">
            <Checkbox
              checked={newProduct.epaApproved}
              onCheckedChange={(checked) => setNewProduct({...newProduct, epaApproved: checked as boolean})}
            />
            <Label className="text-gray-300">EPA Approved</Label>
          </div>
        </div>

        {/* Description */}
        <div>
          <Label className="text-gray-300">Description</Label>
          <Textarea
            value={newProduct.description}
            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
            className="bg-slate-700 border-slate-600 text-white"
            rows={3}
            placeholder="Detailed product description..."
          />
        </div>

        {/* Packaging Options */}
        <div>
          <Label className="text-gray-300 block mb-2">Packaging Options</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={packagingInput}
              onChange={(e) => setPackagingInput(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="e.g., Pallet (48 cylinders)"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPackaging())}
            />
            <Button type="button" onClick={addPackaging} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {newProduct.packaging.map((pkg, index) => (
              <div key={index} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {pkg}
                <button onClick={() => removePackaging(index)}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Applications */}
        <div>
          <Label className="text-gray-300 block mb-2">Applications</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={applicationInput}
              onChange={(e) => setApplicationInput(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="e.g., Residential AC"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addApplication())}
            />
            <Button type="button" onClick={addApplication} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {newProduct.applications.map((app, index) => (
              <div key={index} className="bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {app}
                <button onClick={() => removeApplication(index)}>
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <Button onClick={handleAddProduct} className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
