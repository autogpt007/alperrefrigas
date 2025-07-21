import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const {
    products
  } = useProducts();
  const {
    addItem: addToRFQ
  } = useRFQ();
  const {
    addItem: addToCart
  } = useCart();
  const {
    toast
  } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [packaging, setPackaging] = useState('');
  const product = products.find(p => p.id === id);

  // Bulk pricing calculation functions
  const calculateBulkPrice = (packageType: string): number => {
    if (!product) return 0;
    
    const cylinderPrice = product.price; // Base price is per cylinder
    const discount20ft = product.discount_20ft || 0.30;
    const discount40ft = product.discount_40ft || 0.45;
    
    console.log('calculateBulkPrice called:', {
      packageType,
      cylinderPrice,
      discount20ft,
      discount40ft,
      productName: product.name
    });
    
    let calculatedPrice = 0;
    
    switch (packageType) {
      case '1 Pallet':
        // 40 cylinders per pallet - always calculate from cylinder price
        calculatedPrice = cylinderPrice * 40;
        console.log('1 Pallet calculation:', cylinderPrice, '* 40 =', calculatedPrice);
        break;
      case '20ft Container':
        // 1140 cylinders per 20ft container with discount
        const fullPrice20ft = cylinderPrice * 1140;
        calculatedPrice = fullPrice20ft * (1 - discount20ft);
        console.log('20ft Container calculation:', fullPrice20ft, '* (1 -', discount20ft, ') =', calculatedPrice);
        break;
      case '40ft Container':
        // 2280 cylinders per 40ft container with discount
        const fullPrice40ft = cylinderPrice * 2280;
        calculatedPrice = fullPrice40ft * (1 - discount40ft);
        console.log('40ft Container calculation:', fullPrice40ft, '* (1 -', discount40ft, ') =', calculatedPrice);
        break;
      default:
        calculatedPrice = cylinderPrice * 40; // Default to pallet pricing
    }
    
    console.log('Final calculated price:', calculatedPrice);
    return calculatedPrice;
  };

  const getCurrentPrice = (): number => {
    if (!packaging || !product) return product?.price || 0;
    return calculateBulkPrice(packaging);
  };

  const getDiscountPercentage = (): number => {
    if (!packaging || !product) return 0;
    
    const palletPrice = product.pallet_price || (product.price * 40);
    const currentPrice = getCurrentPrice();
    
    // Calculate discount percentage based on equivalent cylinder pricing
    if (packaging === '20ft Container') {
      const equivalentPrice = product.price * 1140;
      return Math.round(((equivalentPrice - currentPrice) / equivalentPrice) * 100);
    } else if (packaging === '40ft Container') {
      const equivalentPrice = product.price * 2280;
      return Math.round(((equivalentPrice - currentPrice) / equivalentPrice) * 100);
    }
    
    return 0; // No discount for pallet
  };
  if (!product) {
    return <div className="container mx-auto px-4 py-8">
        <SEOComponent title="Product Not Found" description="The requested refrigerant product could not be found." canonicalUrl={`/products/${id}`} />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>;
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

    // Create unique cart item ID based on product and packaging
    const cartItemId = `${product.id}-${packaging.replace(/\s+/g, '-').toLowerCase()}`;

    // Add multiple quantities based on user selection
    for (let i = 0; i < quantity; i++) {
    addToCart({
        id: cartItemId,
        name: product.name,
        price: getCurrentPrice(),
        image: product.image || '/placeholder.svg',
        sku: product.sku || 'N/A',
        epaApproved: product.epaApproved || false,
        packaging
      });
    }
    toast({
      title: "Added to Cart",
      description: `${quantity} ${packaging} of ${product.name} added to your cart.`,
      action: <Button variant="outline" size="sm" onClick={() => navigate('/cart')}>
          View Cart
        </Button>
    });

    // Reset form after adding to cart
    setQuantity(1);
    setPackaging('');
  };
  return <div className="min-h-screen bg-gray-50">
      <SEOComponent title={`${product.name} - Professional Grade Refrigerant`} description={`Buy ${product.name} refrigerant in bulk. ${product.description} EPA approved, fast shipping, competitive pricing. SKU: ${product.sku}`} keywords={`${product.name}, refrigerant, ${product.category}, ${product.sku}, HVAC, cooling, ${product.applications?.join(', ')}`} canonicalUrl={`/products/${product.id}`} ogImage={product.image} ogType="product" product={{
      name: product.name,
      price: product.price,
      currency: 'USD',
      availability: product.availability,
      brand: product.brand,
      sku: product.sku,
      gtin: product.gtin,
      description: product.description,
      image: product.image
    }} />

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
              {product.image && product.image !== '/placeholder.svg' ? <img src={product.image} alt={product.name} className="w-full h-full object-contain" /> : <div className="text-6xl font-bold text-blue-600">{product.name.split(' ')[1] || product.name.charAt(0)}</div>}
              
              {/* Status Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.epaApproved && <Badge className="bg-green-600 text-white">
                    <Shield className="h-3 w-3 mr-1" />
                    EPA Approved
                  </Badge>}
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
                  {product.chemicalFormula && <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Chemical Formula:</span>
                      <span className="text-gray-900">{product.chemicalFormula}</span>
                    </div>}
                  {product.casNumber && <div className="flex justify-between">
                      <span className="font-medium text-gray-600">CAS Number:</span>
                      <span className="text-gray-900">{product.casNumber}</span>
                    </div>}
                  {product.unNumber && <div className="flex justify-between">
                      <span className="font-medium text-gray-600">UN Number:</span>
                      <span className="text-gray-900">{product.unNumber}</span>
                    </div>}
                  {product.hazardClass && <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Hazard Class:</span>
                      <span className="text-gray-900">{product.hazardClass}</span>
                    </div>}
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Category:</span>
                    <span className="text-gray-900">{product.category}</span>
                  </div>
                  {product.shippingWeight && <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Weight:</span>
                      <span className="text-gray-900">{product.shippingWeight}</span>
                    </div>}
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
              
              {/* Pricing Display */}
              <div className="mb-4">
                {packaging ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <p className="text-3xl font-bold text-blue-600">
                        ${getCurrentPrice().toLocaleString()}
                      </p>
                      {getDiscountPercentage() > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                            {getDiscountPercentage()}% OFF
                          </span>
                          <span className="text-lg text-gray-500 line-through">
                            ${(product.price * (packaging === '1 Pallet' ? 40 : packaging === '20ft Container' ? 1140 : 2280)).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {packaging === '1 Pallet' && '40 cylinders per pallet'}
                      {packaging === '20ft Container' && '1,140 cylinders per container'}  
                      {packaging === '40ft Container' && '2,280 cylinders per container'}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg font-medium">Select packaging to see pricing</p>
                    <p className="text-sm text-gray-400 mt-1">Bulk discounts available</p>
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 mb-6">{product.description}</p>
              
              {product.sdsUrl && <Button variant="outline" className="mb-6">
                  <Download className="h-4 w-4 mr-2" />
                  Download Safety Data Sheet
                </Button>}
            </div>

            {/* Applications */}
            {product.applications && product.applications.length > 0 && <Card>
                <CardHeader>
                  <CardTitle>Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {product.applications.map((application, index) => <li key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        {application}
                      </li>)}
                  </ul>
                </CardContent>
              </Card>}

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
                      {(product.packaging_options || product.packaging)?.map(pkg => (
                        <SelectItem key={pkg} value={pkg}>
                          <div className="flex justify-between items-center w-full">
                            <span>{pkg}</span>
                            <div className="ml-4 text-right">
                              <span className="font-semibold text-blue-600">
                                ${calculateBulkPrice(pkg).toLocaleString()}
                              </span>
                              {pkg !== '1 Pallet' && (
                                <div className="text-xs text-green-600">
                                  {pkg === '20ft Container' ? '30% OFF' : '45% OFF'}
                                </div>
                              )}
                            </div>
                          </div>
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
                    <Button variant="outline" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                      -
                    </Button>
                    <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                    <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                      +
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button onClick={handleAddToCart} className="w-full bg-orange-500 hover:bg-orange-600">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>

                  <Button onClick={handleAddToRFQ} variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Quote Request
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link to="/cart">
                    <Button variant="outline" className="w-full">
                      View Cart
                    </Button>
                  </Link>
                  <Link to="/rfq">
                    <Button variant="outline" className="w-full">
                      View Quotes
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
    </div>;
};
export default ProductDetails;