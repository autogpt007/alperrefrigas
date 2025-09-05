import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Upload, X, ImageIcon, FileText, Award } from 'lucide-react';
import { useProducts } from '../../contexts/ProductsContext';
import { useToast } from '../../hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ProductForm = () => {
  const { addProduct } = useProducts();
  const { toast } = useToast();
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    pallet_price: 0,
    container_20ft_price: 0,
    container_40ft_price: 0,
    discount_20ft: 0.30,
    discount_40ft: 0.45,
    packaging_options: ["1 Pallet", "20ft Container", "40ft Container"],
    image: '',
    product_type: 'refrigerant' as 'refrigerant' | 'accessory',
    sku: '',
    epaApproved: false,
    category: '',
    description: '',
    stock: 0,
    packaging: [] as string[],
    applications: [] as string[],
    sdsUrl: '',
    brand: 'FrigidFlow',
    condition: 'new' as 'new' | 'used' | 'refurbished',
    availability: 'in_stock' as 'in_stock' | 'out_of_stock' | 'preorder' | 'backorder',
    gtin: '',
    shippingWeight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    chemicalFormula: '',
    casNumber: '',
    unNumber: '',
    hazardClass: '',
    certificates: [] as Array<{
      name: string;
      type: 'product' | 'iso' | 'epa' | 'distributor' | 'quality' | 'safety';
      description: string;
      pdf_url: string;
    }>
  });

  const [imagePreview, setImagePreview] = useState('');
  const [sdsFileName, setSdsFileName] = useState('');
  const [packagingInput, setPackagingInput] = useState('');
  const [applicationInput, setApplicationInput] = useState('');
  const [certificateInput, setCertificateInput] = useState({
    name: '',
    type: 'product' as 'product' | 'iso' | 'epa' | 'distributor' | 'quality' | 'safety',
    description: '',
    file: null as File | null,
    fileName: ''
  });

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

  const handleSdsUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF file for the SDS document",
          variant: "destructive"
        });
        return;
      }
      
      try {
        // Upload to Supabase storage
        const fileName = `sds_${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
          .from('product-documents')
          .upload(fileName, file);

        if (error) {
          throw error;
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('product-documents')
          .getPublicUrl(fileName);

        setNewProduct({...newProduct, sdsUrl: publicUrlData.publicUrl});
        setSdsFileName(file.name);
        
        toast({
          title: "Success",
          description: "SDS document uploaded successfully",
        });
      } catch (error) {
        console.error('Error uploading SDS:', error);
        toast({
          title: "Upload Failed",
          description: "Failed to upload SDS document. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF file for the certificate",
          variant: "destructive"
        });
        return;
      }
      
      setCertificateInput({
        ...certificateInput,
        file: file,
        fileName: file.name
      });
    }
  };

  const addCertificate = () => {
    if (certificateInput.name.trim() && certificateInput.file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const newCertificate = {
          name: certificateInput.name.trim(),
          type: certificateInput.type,
          description: certificateInput.description.trim(),
          pdf_url: result
        };
        
        setNewProduct({
          ...newProduct,
          certificates: [...newProduct.certificates, newCertificate]
        });
        
        setCertificateInput({
          name: '',
          type: 'product',
          description: '',
          file: null,
          fileName: ''
        });
      };
      reader.readAsDataURL(certificateInput.file);
    }
  };

  const removeCertificate = (index: number) => {
    setNewProduct({
      ...newProduct,
      certificates: newProduct.certificates.filter((_, i) => i !== index)
    });
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
    if (!newProduct.name || !newProduct.sku || !newProduct.category || !newProduct.sdsUrl) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Name, SKU, Category, and SDS document)",
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
      pallet_price: 0,
      container_20ft_price: 0,
      container_40ft_price: 0,
      discount_20ft: 0.30,
      discount_40ft: 0.45,
      packaging_options: ["1 Pallet", "20ft Container", "40ft Container"],
      image: '',
      product_type: 'refrigerant' as 'refrigerant' | 'accessory',
      sku: '',
      epaApproved: false,
      category: '',
      description: '',
      stock: 0,
      packaging: [],
      applications: [],
      sdsUrl: '',
      brand: 'FrigidFlow',
      condition: 'new' as 'new' | 'used' | 'refurbished',
      availability: 'in_stock' as 'in_stock' | 'out_of_stock' | 'preorder' | 'backorder',
      gtin: '',
      shippingWeight: '',
      dimensions: {
        length: '',
        width: '',
        height: ''
      },
      chemicalFormula: '',
      casNumber: '',
      unNumber: '',
      hazardClass: '',
      certificates: []
    });
    setImagePreview('');
    setSdsFileName('');
    setCertificateInput({
      name: '',
      type: 'product',
      description: '',
      file: null,
      fileName: ''
    });
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

        {/* SDS Document Upload - Required */}
        <div>
          <Label className="text-gray-300 block mb-2">Safety Data Sheet (SDS) *</Label>
          <div className="flex items-center gap-4">
            <div className="w-32 h-32 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center bg-slate-700/50">
              {sdsFileName ? (
                <div className="text-center">
                  <FileText className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-300 break-words">{sdsFileName}</p>
                </div>
              ) : (
                <FileText className="h-8 w-8 text-gray-500" />
              )}
            </div>
            <div>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleSdsUpload}
                className="hidden"
                id="sds-upload"
                required
              />
              <Label htmlFor="sds-upload" className="cursor-pointer">
                <Button type="button" className="bg-green-600 hover:bg-green-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload SDS (Required)
                </Button>
              </Label>
              <p className="text-gray-400 text-sm mt-2">Upload SDS document (PDF only) - Required for all products</p>
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
            <Label className="text-gray-300">Stock Quantity</Label>
            <Input
              type="number"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </div>

        {/* Bulk Pricing Section */}
        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
          <Label className="text-cyan-400 text-lg font-semibold block mb-4">Bulk Pricing Structure</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-gray-300">1 Pallet Price ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={newProduct.pallet_price}
                onChange={(e) => {
                  const palletPrice = parseFloat(e.target.value) || 0;
                  setNewProduct({
                    ...newProduct, 
                    price: palletPrice,
                    pallet_price: palletPrice,
                    container_20ft_price: palletPrice * (1 - newProduct.discount_20ft),
                    container_40ft_price: palletPrice * (1 - newProduct.discount_40ft)
                  });
                }}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Base price for 1 pallet"
              />
              <p className="text-xs text-gray-400 mt-1">Base price - no discount</p>
            </div>
            <div>
              <Label className="text-gray-300">20ft Container Price ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={newProduct.container_20ft_price}
                onChange={(e) => setNewProduct({...newProduct, container_20ft_price: parseFloat(e.target.value) || 0})}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Auto-calculated with 30% discount"
                readOnly
              />
              <p className="text-xs text-green-400 mt-1">30% discount applied</p>
            </div>
            <div>
              <Label className="text-gray-300">40ft Container Price ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={newProduct.container_40ft_price}
                onChange={(e) => setNewProduct({...newProduct, container_40ft_price: parseFloat(e.target.value) || 0})}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="Auto-calculated with 45% discount"
                readOnly
              />
              <p className="text-xs text-green-400 mt-1">45% discount applied</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label className="text-gray-300">20ft Container Discount (%)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={newProduct.discount_20ft}
                onChange={(e) => {
                  const discount = parseFloat(e.target.value) || 0.30;
                  setNewProduct({
                    ...newProduct, 
                    discount_20ft: discount,
                    container_20ft_price: newProduct.pallet_price * (1 - discount)
                  });
                }}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="0.30"
              />
              <p className="text-xs text-gray-400 mt-1">Default: 0.30 (30%)</p>
            </div>
            <div>
              <Label className="text-gray-300">40ft Container Discount (%)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={newProduct.discount_40ft}
                onChange={(e) => {
                  const discount = parseFloat(e.target.value) || 0.45;
                  setNewProduct({
                    ...newProduct, 
                    discount_40ft: discount,
                    container_40ft_price: newProduct.pallet_price * (1 - discount)
                  });
                }}
                className="bg-slate-700 border-slate-600 text-white"
                placeholder="0.45"
              />
              <p className="text-xs text-gray-400 mt-1">Default: 0.45 (45%)</p>
            </div>
          </div>
        </div>

        {/* Category, Brand, Condition, and Availability */}
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
          <div>
            <Label className="text-gray-300">Brand</Label>
            <Input
              value={newProduct.brand}
              onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="e.g., FrigidFlow"
            />
          </div>
          <div>
            <Label className="text-gray-300">Condition</Label>
            <Select value={newProduct.condition} onValueChange={(value) => setNewProduct({...newProduct, condition: value as 'new' | 'used' | 'refurbished'})}>
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
            <Select value={newProduct.availability} onValueChange={(value) => setNewProduct({...newProduct, availability: value as 'in_stock' | 'out_of_stock' | 'preorder' | 'backorder'})}>
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

        {/* EPA Approved Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={newProduct.epaApproved}
            onCheckedChange={(checked) => setNewProduct({...newProduct, epaApproved: checked as boolean})}
          />
          <Label className="text-gray-300">EPA Approved</Label>
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

        {/* Certificates Section */}
        <div>
          <Label className="text-gray-300 block mb-4">Product Certificates</Label>
          
          {/* Certificate Input Form */}
          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-gray-300 text-sm">Certificate Name</Label>
                <Input
                  value={certificateInput.name}
                  onChange={(e) => setCertificateInput({...certificateInput, name: e.target.value})}
                  className="bg-slate-600 border-slate-500 text-white"
                  placeholder="e.g., EPA Section 608 Certificate"
                />
              </div>
              <div>
                <Label className="text-gray-300 text-sm">Certificate Type</Label>
                <Select 
                  value={certificateInput.type} 
                  onValueChange={(value) => setCertificateInput({...certificateInput, type: value as any})}
                >
                  <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product">Product Certificate</SelectItem>
                    <SelectItem value="iso">ISO Certificate</SelectItem>
                    <SelectItem value="epa">EPA Certificate</SelectItem>
                    <SelectItem value="distributor">Distributor Agreement</SelectItem>
                    <SelectItem value="quality">Quality Certificate</SelectItem>
                    <SelectItem value="safety">Safety Certificate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mb-4">
              <Label className="text-gray-300 text-sm">Description</Label>
              <Textarea
                value={certificateInput.description}
                onChange={(e) => setCertificateInput({...certificateInput, description: e.target.value})}
                className="bg-slate-600 border-slate-500 text-white"
                rows={2}
                placeholder="Brief description of the certificate..."
              />
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleCertificateUpload}
                  className="hidden"
                  id="certificate-upload"
                />
                <Label htmlFor="certificate-upload" className="cursor-pointer">
                  <Button type="button" size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Award className="h-4 w-4 mr-2" />
                    Upload Certificate PDF
                  </Button>
                </Label>
                {certificateInput.fileName && (
                  <p className="text-sm text-green-400 mt-1">{certificateInput.fileName}</p>
                )}
              </div>
              <Button type="button" onClick={addCertificate} size="sm" disabled={!certificateInput.name || !certificateInput.file}>
                <Plus className="h-4 w-4 mr-1" />
                Add Certificate
              </Button>
            </div>
          </div>
          
          {/* Existing Certificates List */}
          {newProduct.certificates.length > 0 && (
            <div className="space-y-2">
              {newProduct.certificates.map((cert, index) => (
                <div key={index} className="bg-purple-600/20 text-white px-4 py-3 rounded-lg border border-purple-500/30 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{cert.name}</div>
                    <div className="text-sm text-gray-300">Type: {cert.type} | {cert.description}</div>
                  </div>
                  <button onClick={() => removeCertificate(index)} className="text-red-400 hover:text-red-300">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional SEO/GMC Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300">GTIN</Label>
            <Input
              value={newProduct.gtin}
              onChange={(e) => setNewProduct({...newProduct, gtin: e.target.value})}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="Global Trade Item Number"
            />
          </div>
          <div>
            <Label className="text-gray-300">Shipping Weight</Label>
            <Input
              value={newProduct.shippingWeight}
              onChange={(e) => setNewProduct({...newProduct, shippingWeight: e.target.value})}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="e.g., 30 lbs"
            />
          </div>
          <div>
            <Label className="text-gray-300">Chemical Formula</Label>
            <Input
              value={newProduct.chemicalFormula}
              onChange={(e) => setNewProduct({...newProduct, chemicalFormula: e.target.value})}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="e.g., R-32/R-125 (50/50)"
            />
          </div>
          <div>
            <Label className="text-gray-300">CAS Number</Label>
            <Input
              value={newProduct.casNumber}
              onChange={(e) => setNewProduct({...newProduct, casNumber: e.target.value})}
              className="bg-slate-700 border-slate-600 text-white"
              placeholder="e.g., 354-33-6"
            />
          </div>
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
