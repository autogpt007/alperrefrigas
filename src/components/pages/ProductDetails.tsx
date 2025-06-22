
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Plus, FileText, Shield, Truck, Award, ShoppingCart } from 'lucide-react';
import { useRFQ } from '../../contexts/RFQContext';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../hooks/use-toast';
import { useProducts } from '../../contexts/ProductsContext';
import SEOComponent from '../seo/SEOComponent';

const ProductDetails = () => {
  const { id } = useParams();
  const { products } = useProducts();
  const { addItem: addToRFQ } = useRFQ();
  const { addItem: addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [packaging, setPackaging] = useState('');

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SEOComponent
          title="Product Not Found"
          description="The requested refrigerant product could not be found."
          canonicalUrl={`/products/${id}`}
        />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToRFQ = () => {
    if (!packaging) {
      toast({
        title: "Please select packaging",
        description: "You must select a packaging option before adding to quote request.",
        variant: "destructive"
      });
      return;
    }

    addToRFQ({
      productId: product.id,
      productName: product.name,
      quantity,
      packaging,
      imageUrl: product.image
    });

    toast({
      title: "Added to Quote Request",
      description: `${quantity} ${packaging} of ${product.name} added to your quote request.`
    });

    setQuantity(1);
    setPackaging('');
  };

  const handleAddToCart = () => {
    if (!packaging) {
      toast({
        title: "Please select packaging",
        description: "You must select a packaging option before adding to cart.",
        variant: "destructive"
      });
      return;
    }

    addToCart({
      id: `${product.id}-${packaging}`,
      name: product.name,
      price: product.price,
      image: product.image,
      sku: product.sku,
      epaApproved: product.epaApproved,
      packaging
    });

    toast({
      title: "Added to Cart",
      description: `${quantity} ${packaging} of ${product.name} added to your cart.`
    });

    setQuantity(1);
    setPackaging('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOComponent
        title={`${product.name} - Professional Grade Refrigerant`}
        description={`Buy ${product.name} refrigerant in bulk. ${product.description} EPA approved, fast shipping, competitive pricing. SKU: ${product.sku}`}
        keywords={`${product.name}, refrigerant, ${product.category}, ${product.sku}, HVAC, cooling, ${product.applications?.join(', ')}`}
        canonicalUrl={`/products/${product.id}`}
        ogImage={product.image}
        ogType="product"
        product={{
          name: product.name,
          price: product.price,
          currency: 'USD',
          availability: product.availability,
          brand: product.brand,
          sku: product.sku,
          gtin: product.gtin,
          description: product.description,
          image: product.image
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/products" className="inline-flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image and Basic Info */}
          <div>
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg h-96 flex items-center justify-center mb-6 relative overflow-hidden">
              {product.image && product.image !== '/placeholder.svg' ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-6xl font-bold text-blue-600">{product.name.split(' ')[1] || product.name.charAt(0)}</div>
              )}
              
              {/* Status Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.epaApproved && (
                  <Badge className="bg-green-600 text-white">
                    <Shield className="h-3 w-3 mr-1" />
                    EPA Approved
                  </Badge>
                )}
                <Badge className={`${product.availability === 'in_stock' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                  {product.availability === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>
            </div>
            
            {/* Technical Specifications */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Technical Specifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">SKU:</span>
                    <span className="text-gray-900">{product.sku}</span>
                  </div>
                  {product.chemicalFormula && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Chemical Formula:</span>
                      <span className="text-gray-900">{product.chemicalFormula}</span>
                    </div>
                  )}
                  {product.casNumber && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">CAS Number:</span>
                      <span className="text-gray-900">{product.casNumber}</span>
                    </div>
                  )}
                  {product.unNumber && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">UN Number:</span>
                      <span className="text-gray-900">{product.unNumber}</span>
                    </div>
                  )}
                  {product.hazardClass && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Hazard Class:</span>
                      <span className="text-gray-900">{product.hazardClass}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Category:</span>
                    <span className="text-gray-900">{product.category}</span>
                  </div>
                  {product.shippingWeight && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Weight:</span>
                      <span className="text-gray-900">{product.shippingWeight}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Certifications & Compliance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Certifications & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-green-600 mr-2" />
                    <span>EPA Section 608 Compliant</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-green-600 mr-2" />
                    <span>DOT Shipping Certified</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-green-600 mr-2" />
                    <span>ISO 9001 Quality Assured</span>
                  </div>
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 text-blue-600 mr-2" />
                    <span>Fast & Secure Shipping</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Details and Purchase Options */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-2xl font-bold text-blue-600 mb-4">
                ${product.price.toFixed(2)} / cylinder
              </p>
              <p className="text-gray-600 mb-6">{product.description}</p>
              
              {product.sdsUrl && (
                <Button variant="outline" className="mb-6">
                  <Download className="h-4 w-4 mr-2" />
                  Download Safety Data Sheet
                </Button>
              )}
            </div>

            {/* Applications */}
            {product.applications && product.applications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {product.applications.map((application, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        {application}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Purchase Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Purchase Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Packaging Type *
                  </label>
                  <Select value={packaging} onValueChange={setPackaging}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select packaging option" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.packaging?.map((pkg) => (
                        <SelectItem key={pkg} value={pkg}>
                          {pkg}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handleAddToCart} 
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    disabled={product.availability !== 'in_stock'}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.availability === 'in_stock' ? 'Add to Cart' : 'Out of Stock'}
                  </Button>

                  <Button 
                    onClick={handleAddToRFQ} 
                    variant="outline"
                    className="w-full"
                    disabled={product.availability !== 'in_stock'}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Quote Request
                  </Button>
                </div>

                <div className="text-center">
                  <Link to="/cart">
                    <Button variant="outline" className="w-full">
                      View Cart
                    </Button>
                  </Link>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
                  <p className="text-blue-800 text-sm">
                    Our refrigerant experts are available to help you choose the right product for your application.
                  </p>
                  <Button variant="link" className="text-blue-600 p-0 h-auto mt-2">
                    Contact Technical Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
