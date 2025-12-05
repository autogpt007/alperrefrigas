import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Plus, FileText, Shield, Truck, Award, ShoppingCart, AlertTriangle } from 'lucide-react';
import { useRFQ } from '../../contexts/RFQContext';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../hooks/use-toast';
import { useProducts } from '../../contexts/ProductsContext';
import SEOComponent from '../seo/SEOComponent';
import { createProductSlug, findProductBySlug } from '@/lib/slugs';
import { trackViewItem, productToGA4Item } from '@/utils/ga4Ecommerce';
const ProductDetails = () => {
  const { id, productSlug } = useParams();
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
  // Find product by ID or by slug with better logic
  const product = React.useMemo(() => {
    if (id) {
      // Direct ID lookup (for legacy support)
      return products.find(p => p.id === id);
    }
    if (productSlug) {
      // Slug-based lookup
      return findProductBySlug(products, productSlug);
    }
    return null;
  }, [products, id, productSlug]);

  // Redirect to SEO-friendly URL if accessed via ID
  React.useEffect(() => {
    if (product && id && !productSlug) {
      const slug = createProductSlug(product.name);
      navigate(`/products/${slug}`, { replace: true });
    }
  }, [product, id, productSlug, navigate]);

  // Track product view for GA4
  React.useEffect(() => {
    if (product && !id) {
      // Only track when using slug (not during redirect from ID)
      trackViewItem(productToGA4Item(product));
    }
  }, [product, id]);

  // Bulk pricing calculation functions
  const calculateBulkPrice = (packageType: string): number => {
    if (!product) return 0;

    // Accessory pricing: per piece with quantity discounts
    if (product.product_type === 'accessory') {
      const basePrice = product.price;
      let price = basePrice;
      if (packageType === '5-Pack') price = basePrice * 5 * 0.95; // 5% off
      else if (packageType === '10-Pack') price = basePrice * 10 * 0.85; // 15% off
      else price = basePrice; // Individual
      console.log('Accessory calculateBulkPrice:', { packageType, basePrice, price, productName: product.name });
      return price;
    }
    
    // Refrigerant pricing: pallet/container logic
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
    if (!packaging || !product) {
      console.log('getCurrentPrice: No packaging or product', { packaging, hasProduct: !!product });
      return product?.price || 0;
    }
    const price = calculateBulkPrice(packaging);
    console.log('getCurrentPrice result:', price, 'for packaging:', packaging);
    return price;
  };

  const getDiscountPercentage = (): number => {
    if (!packaging || !product) return 0;

    // Accessory discount percentages
    if (product.product_type === 'accessory') {
      if (packaging === '5-Pack') return 5;
      if (packaging === '10-Pack') return 15;
      return 0;
    }
    
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

  // Show loading state while products are being fetched
  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">Loading product details...</div>
        </div>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">Product Not Found</div>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist or may have been removed.</p>
          <Link to="/products">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Create SEO-friendly canonical URL
  const canonicalUrl = `/products/${createProductSlug(product.name)}`;
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
        packaging,
        product_type: product.product_type || 'refrigerant'
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
  // Enhanced product description with MOQ information
  const enhancedDescription = `${product.description || `${product.name} refrigerant for professional HVAC applications`} - EPA approved, bulk quantities available. Minimum Order Quantity (MOQ): 40 cylinders per pallet. ${product.epaApproved ? 'EPA certified' : ''} ${product.category} refrigerant. Fast shipping from multiple distribution centers in TX, FL, and CA.`;

  // Product FAQ data for better SEO
  const productFAQ = [
    {
      question: `What is the minimum order quantity for ${product.name}?`,
      answer: "Our minimum order quantity (MOQ) is 40 cylinders per pallet. We also offer 20ft containers (1,140 cylinders) and 40ft containers (2,280 cylinders) with bulk discounts."
    },
    {
      question: `Is ${product.name} EPA approved?`,
      answer: product.epaApproved 
        ? `Yes, ${product.name} is EPA Section 608 compliant and approved for professional HVAC use in the United States.`
        : `${product.name} meets all applicable EPA regulations for refrigerant use in professional HVAC applications.`
    },
    {
      question: "What are your shipping terms?",
      answer: "We ship from distribution centers in Texas, Florida, and California. All shipments are DOT certified and include fast, secure delivery with tracking information."
    },
    {
      question: "Do you provide Safety Data Sheets (SDS)?",
      answer: "Yes, we provide comprehensive Safety Data Sheets for all our refrigerant products. SDS documents include handling instructions, safety precautions, and technical specifications."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOComponent
        title={`${product.name} - Premium Refrigerant | MOQ 40 Cylinders | Alper Refrigerants`}
        description={enhancedDescription}
        keywords={`${product.name}, ${product.category} refrigerant, EPA approved refrigerant, HVAC, ${product.sku}, bulk refrigerant, MOQ 40 cylinders, wholesale refrigerant, ${product.applications?.join(', ') || ''}, refrigerant distributor, fast shipping`}
        canonicalUrl={canonicalUrl}
        ogImage={product.thumbnailUrl || product.images?.[0] || product.image}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Products", url: "/products" },
          { name: "Refrigerants", url: "/products/refrigerants" },
          { name: product.name, url: canonicalUrl }
        ]}
        faq={productFAQ}
        product={{
          name: product.name,
          price: getCurrentPrice(),
          currency: 'USD',
          availability: product.availability === 'in_stock' ? 'InStock' : 'OutOfStock',
          brand: product.brand || 'Alper Refrigerant',
          sku: product.sku || product.id,
          gtin: product.gtin,
          description: enhancedDescription,
          image: product.thumbnailUrl || product.images?.[0] || product.image || '',
          moq: 40,
          category: product.category,
          specifications: {
            chemicalFormula: product.chemicalFormula,
            casNumber: product.casNumber,
            unNumber: product.unNumber,
            hazardClass: product.hazardClass,
            applications: product.applications
          }
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
              
              {/* PROFESSIONAL USE ONLY Disclaimer - Only show for refrigerants */}
              {product.product_type !== 'accessory' && (
                <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-yellow-800 text-lg mb-1">
                        ⚠️ PROFESSIONAL USE ONLY
                      </h3>
                      <div className="text-sm text-yellow-700 space-y-1">
                        <p><strong>EPA Section 608 certification REQUIRED</strong> for purchase.</p>
                        <p>This product is regulated under the Clean Air Act and is restricted to licensed HVAC professionals and EPA-certified technicians only.</p>
                        <p className="text-xs mt-2">
                          <strong>DOT HazMat Compliance:</strong> All refrigerant shipments comply with DOT hazardous materials regulations (49 CFR). Commercial delivery address required.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Starting Price display */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 mb-1">Starting Price</p>
                <p className="text-lg font-semibold text-blue-900">
                  ${product.price}/{product.product_type === 'accessory' ? 'piece' : 'cylinder'}
                </p>
                <p className="text-xs text-blue-600">
                  {product.product_type === 'accessory' ? 'Quantity discounts available (5% for 5-pack, 15% for 10-pack)' : 'Bulk discounts available for containers'}
                </p>
              </div>
              
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
                            {product.product_type === 'accessory' ? (
                              packaging === '5-Pack' ? `$${(product.price * 5).toFixed(2)}` :
                              packaging === '10-Pack' ? `$${(product.price * 10).toFixed(2)}` : `$${product.price.toFixed(2)}`
                            ) : (
                              `$${(product.price * (packaging === '1 Pallet' ? 40 : packaging === '20ft Container' ? 1140 : 2280)).toLocaleString()}`
                            )}
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

              {/* Purchase Options - Moved up for better UX */}
              <Card className="mb-6">
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
                                {product.product_type === 'accessory' ? (
                                  pkg === '5-Pack' ? <div className="text-xs text-green-600">5% OFF</div> :
                                  pkg === '10-Pack' ? <div className="text-xs text-green-600">15% OFF</div> : null
                                ) : (
                                  pkg !== '1 Pallet' && (
                                    <div className="text-xs text-green-600">
                                      {pkg === '20ft Container' ? '30% OFF' : '45% OFF'}
                                    </div>
                                  )
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
              
              <div className="text-gray-600 mb-6 whitespace-pre-line">
                {product.description?.split('\n').map((line, index) => (
                  <p key={index} className="mb-2 last:mb-0">
                    {line}
                  </p>
                ))}
              </div>
              
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;