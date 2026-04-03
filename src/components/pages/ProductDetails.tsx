import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Plus, FileText, Shield, Truck, Award, ShoppingCart, AlertTriangle, CheckCircle } from 'lucide-react';
import { useRFQ } from '../../contexts/RFQContext';
import { useCart } from '../../contexts/CartContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useToast } from '../../hooks/use-toast';
import { useProducts } from '../../contexts/ProductsContext';
import SEOComponent from '../seo/SEOComponent';
import { createProductSlug, findProductBySlug } from '@/lib/slugs';
import { trackViewItem, productToGA4Item } from '@/utils/ga4Ecommerce';
import { trackFBViewContent } from '@/utils/facebookPixel';
import ACBulkPricing, { calculateACPricingTier } from '../ui/ACBulkPricing';
import ACConfigurator, { ACConfiguration, getDefaultConfiguration, formatConfigurationSummary } from '../ui/ACConfigurator';

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
  const { formatPrice } = useCurrency();
  const {
    toast
  } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [acQuantity, setAcQuantity] = useState(5); // AC products have MOQ of 5
  const [packaging, setPackaging] = useState('');
  const [acConfiguration, setAcConfiguration] = useState<ACConfiguration | null>(null);
  
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

  // Initialize AC configuration when product loads
  React.useEffect(() => {
    if (product?.product_type === 'air_conditioner' && !acConfiguration) {
      setAcConfiguration(getDefaultConfiguration(product));
    }
  }, [product]);

  // Redirect to SEO-friendly URL if accessed via ID
  React.useEffect(() => {
    if (product && id && !productSlug) {
      const slug = createProductSlug(product.name);
      navigate(`/products/${slug}`, { replace: true });
    }
  }, [product, id, productSlug, navigate]);

  // Track product view for GA4 and Facebook Pixel
  React.useEffect(() => {
    if (product && !id) {
      // Only track when using slug (not during redirect from ID)
      trackViewItem(productToGA4Item(product));
      trackFBViewContent(
        product.sku || product.id,
        product.name,
        'product',
        product.price,
        'USD'
      );
    }
  }, [product, id]);

  // Pallet quantity for tier 1 and tier 2
  const [palletQuantity, setPalletQuantity] = useState(1);

  // Container/Truck constants
  const CYLINDERS_PER_PALLET = 40;
  const CONTAINER_20FT = { pallets: 28, cylinders: 1120 };
  const CONTAINER_40FT = { pallets: 56, cylinders: 2240 };
  const TRUCK_LOAD = { pallets: 44, cylinders: 1760 };

  // Bulk pricing calculation functions
  const calculateBulkPrice = (packageType: string, palletQty: number = palletQuantity): number => {
    if (!product) return 0;

    // Accessory pricing: per piece with quantity discounts
    if (product.product_type === 'accessory') {
      const basePrice = product.price;
      let price = basePrice;
      if (packageType === '5-Pack') price = basePrice * 5 * 0.95;
      else if (packageType === '10-Pack') price = basePrice * 10 * 0.85;
      else price = basePrice;
      return price;
    }
    
    // Refrigerant pricing: 3-tier pallet-based system
    const basePrice = product.price; // Base price per cylinder (container-load price)
    
    switch (packageType) {
      case '1-10 Pallets':
        return (basePrice + 20) * CYLINDERS_PER_PALLET * palletQty;
      case '10-20 Pallets':
        return (basePrice + 15) * CYLINDERS_PER_PALLET * palletQty;
      case '20ft Container':
        return basePrice * CONTAINER_20FT.cylinders;
      case '40ft Container':
        return basePrice * CONTAINER_40FT.cylinders;
      case 'Truck Load (53ft)':
        return basePrice * TRUCK_LOAD.cylinders;
      default:
        return basePrice * CYLINDERS_PER_PALLET;
    }
  };

  // Get per-cylinder price for the selected tier
  const getPerCylinderPrice = (packageType: string): number => {
    if (!product) return 0;
    switch (packageType) {
      case '1-10 Pallets': return product.price + 20;
      case '10-20 Pallets': return product.price + 15;
      case '20ft Container':
      case '40ft Container':
      case 'Truck Load (53ft)': return product.price;
      default: return product.price + 20;
    }
  };

  // Get packaging description text
  const getPackagingDescription = (packageType: string): string => {
    switch (packageType) {
      case '1-10 Pallets': return `${palletQuantity} pallet${palletQuantity > 1 ? 's' : ''} · ${palletQuantity * CYLINDERS_PER_PALLET} cylinders`;
      case '10-20 Pallets': return `${palletQuantity} pallets · ${palletQuantity * CYLINDERS_PER_PALLET} cylinders`;
      case '20ft Container': return `${CONTAINER_20FT.pallets} pallets · ${CONTAINER_20FT.cylinders.toLocaleString()} cylinders`;
      case '40ft Container': return `${CONTAINER_40FT.pallets} pallets · ${CONTAINER_40FT.cylinders.toLocaleString()} cylinders`;
      case 'Truck Load (53ft)': return `${TRUCK_LOAD.pallets} pallets · ${TRUCK_LOAD.cylinders.toLocaleString()} cylinders`;
      default: return '';
    }
  };

  // Reset pallet quantity when packaging changes
  React.useEffect(() => {
    if (packaging === '1-10 Pallets') setPalletQuantity(1);
    else if (packaging === '10-20 Pallets') setPalletQuantity(10);
  }, [packaging]);

  const getCurrentPrice = (): number => {
    if (!product) return 0;
    if (product.product_type === 'air_conditioner') {
      const tier = calculateACPricingTier(product, acQuantity);
      return tier ? tier.total : 0;
    }
    if (!packaging) return product?.price || 0;
    return calculateBulkPrice(packaging, palletQuantity);
  };

  const getACUnitPrice = (): number => {
    if (!product || product.product_type !== 'air_conditioner') return 0;
    const tier = calculateACPricingTier(product, acQuantity);
    return tier ? tier.unitPrice : 0;
  };

  const getDiscountPercentage = (): number => {
    if (!packaging || !product) return 0;
    if (product.product_type === 'accessory') {
      if (packaging === '5-Pack') return 5;
      if (packaging === '10-Pack') return 15;
    }
    return 0;
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
    // AC products have different validation
    if (product.product_type === 'air_conditioner') {
      const tier = calculateACPricingTier(product, acQuantity);
      if (!tier) {
        if (acQuantity < 5) {
          toast({
            title: "Minimum Order Quantity",
            description: "Air conditioners require a minimum order of 5 units.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Pricing Not Configured",
            description: "This product's bulk pricing is not yet configured. Please contact us.",
            variant: "destructive"
          });
        }
        return;
      }
      
      // Create unique cart item ID for AC including configuration
      const configKey = acConfiguration ? 
        `${acConfiguration.accessories_mode}-${acConfiguration.selected_accessory_ids.join(',')}` : 
        'default';
      const cartItemId = `${product.id}-ac-bulk-${acQuantity}-${configKey}`;
      const q20 = product.q20_units || 0;
      const half = Math.ceil(q20 * 0.5);
      
      addToCart({
        id: cartItemId,
        name: product.name,
        price: tier.total,
        image: product.image || '/placeholder.svg',
        sku: product.sku || 'N/A',
        epaApproved: product.epaApproved || false,
        packaging: `${acQuantity} units (${tier.label})`,
        product_type: 'air_conditioner',
        // AC Bulk Pricing audit fields for order storage
        ac_bulk_pricing: {
          base_unit_price: product.base_unit_price || 0,
          applied_uplift_percent: tier.upliftPercent,
          final_unit_price: tier.unitPrice,
          tier_label: tier.label,
          q20_units: q20,
          half_units: half,
          ordered_quantity: acQuantity
        },
        // AC Configuration for order storage
        configuration_json: acConfiguration ? {
          btu: acConfiguration.btu,
          ac_type: acConfiguration.ac_type,
          voltage: acConfiguration.voltage,
          plug_type: acConfiguration.plug_type,
          frequency: acConfiguration.frequency,
          phase: acConfiguration.phase,
          accessories_mode: acConfiguration.accessories_mode,
          selected_accessory_ids: acConfiguration.selected_accessory_ids,
          comes_with_list: acConfiguration.comes_with_list
        } : undefined
      });
      
      toast({
        title: "Added to Cart",
        description: `${acQuantity} units of ${product.name} added to your cart.`,
        action: <Button variant="outline" size="sm" onClick={() => navigate('/cart')}>
            View Cart
          </Button>
      });
      
      setAcQuantity(5);
      return;
    }
    
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
  // Enhanced product description - different for each product type
  const enhancedDescription = product.product_type === 'air_conditioner'
    ? `${product.description || `${product.name} - High-efficiency air conditioning unit`}. Bulk quantities available with tiered pricing. ${product.category} category. Fast shipping from multiple distribution centers.`
    : product.product_type === 'accessory'
    ? `${product.description || `${product.name} - Professional HVAC accessory`}. Quality equipment for HVAC professionals. Fast shipping available.`
    : `${product.description || `${product.name} refrigerant for professional HVAC applications`} - EPA approved, bulk quantities available. Minimum Order Quantity (MOQ): 40 cylinders per pallet. ${product.epaApproved ? 'EPA certified' : ''} ${product.category} refrigerant. Fast shipping from multiple distribution centers in TX, FL, and CA.`;

  // Product FAQ data for better SEO - different for each product type
  const productFAQ = product.product_type === 'air_conditioner'
    ? [
        {
          question: `What is the minimum order quantity for ${product.name}?`,
          answer: "Our minimum order quantity (MOQ) for air conditioners is 5 units. We offer tiered bulk pricing with better rates at higher quantities."
        },
        {
          question: `What warranty does ${product.name} come with?`,
          answer: `${product.name} comes with a manufacturer warranty. Contact us for specific warranty details and coverage information.`
        },
        {
          question: "What are your shipping terms?",
          answer: "We ship from distribution centers in Texas, Florida, and California. All shipments include fast, secure delivery with tracking information."
        },
        {
          question: "Do you offer installation services?",
          answer: "We recommend professional installation for all air conditioning units. Contact us for referrals to certified HVAC installers in your area."
        }
      ]
    : product.product_type === 'accessory'
    ? [
        {
          question: `What is included with ${product.name}?`,
          answer: `${product.name} includes all standard components as listed in the product specifications. Contact us for complete details.`
        },
        {
          question: "What are your shipping terms?",
          answer: "We ship from distribution centers in Texas, Florida, and California. Fast, secure delivery with tracking information."
        }
      ]
    : [
        {
          question: `What is the minimum order quantity for ${product.name}?`,
          answer: "Our minimum order is 1 pallet (40 cylinders). We offer tiered volume pricing: 1-5 pallets, 5-10 pallets, 20ft containers (28 pallets / 1,120 cylinders), 40ft containers (56 pallets / 2,240 cylinders), and truck loads (44 pallets / 1,760 cylinders)."
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

  // Dynamic SEO keyword mapping
  const currentYear = new Date().getFullYear();
  const isRefrigerant = product.product_type === 'refrigerant';
  const seoTitle = isRefrigerant
    ? `${product.name} Wholesale Price ${currentYear} | Alper`
    : `${product.name} | Wholesale | Alper`;
  const seoDescription = isRefrigerant
    ? `Buy ${product.name} wholesale from ${formatPrice(product.price)}/cylinder. EPA approved, bulk quantities available. Fast shipping from TX, FL, CA.`
    : enhancedDescription;
  const seoKeywords = isRefrigerant
    ? `wholesale ${product.name} price ${currentYear}, buy ${product.name} bulk, ${product.name}, ${product.category} refrigerant, EPA approved refrigerant, HVAC, ${product.sku}, bulk refrigerant, MOQ 40 cylinders, wholesale refrigerant, ${product.applications?.join(', ') || ''}, refrigerant distributor, fast shipping`
    : `${product.name}, ${product.category} refrigerant, EPA approved refrigerant, HVAC, ${product.sku}, bulk refrigerant, wholesale refrigerant, ${product.applications?.join(', ') || ''}`;

  // Use cases derived from product data
  const useCases = React.useMemo(() => {
    const cases: string[] = [];
    if (isRefrigerant) {
      cases.push('Commercial rooftop HVAC units', 'Split system air conditioners', 'Industrial chillers and cooling systems', 'Automotive air conditioning systems', 'Refrigerated transport and cold storage', 'Supermarket refrigeration systems');
      if (product.applications?.length) {
        product.applications.forEach(app => {
          if (!cases.includes(app)) cases.push(app);
        });
      }
    } else if (product.product_type === 'air_conditioner') {
      cases.push('Residential cooling', 'Commercial office buildings', 'Retail and hospitality venues', 'Data center cooling', 'Warehouse climate control');
    } else {
      cases.push('Professional HVAC installation', 'Maintenance and servicing', 'System retrofitting');
    }
    return cases;
  }, [product]);

  // Specifications for table
  const specsTableData = React.useMemo(() => {
    const specs: { label: string; value: string }[] = [];
    if (product.sku) specs.push({ label: 'SKU / Part Number', value: product.sku });
    if (product.brand) specs.push({ label: 'Brand', value: product.brand });
    if (product.category) specs.push({ label: 'Category', value: product.category });
    if (product.chemicalFormula) specs.push({ label: 'Chemical Formula', value: product.chemicalFormula });
    if (product.casNumber) specs.push({ label: 'CAS Number', value: product.casNumber });
    if (product.unNumber) specs.push({ label: 'UN Number', value: product.unNumber });
    if (product.hazardClass) specs.push({ label: 'Hazard Class', value: product.hazardClass });
    if (product.shippingWeight) specs.push({ label: 'Shipping Weight', value: product.shippingWeight });
    if (product.refrigerantType) specs.push({ label: 'Refrigerant Type', value: product.refrigerantType });
    if (product.epaApproved !== undefined) specs.push({ label: 'EPA Approved', value: product.epaApproved ? 'Yes' : 'No' });
    if (product.availability) specs.push({ label: 'Availability', value: product.availability === 'in_stock' ? 'In Stock' : 'Contact for availability' });
    return specs;
  }, [product]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOComponent
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonicalUrl={canonicalUrl}
        ogImage={product.thumbnailUrl || product.images?.[0] || product.image}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Products", url: "/products" },
          { name: isRefrigerant ? "Refrigerants" : "Products", url: "/products" },
          { name: product.name, url: canonicalUrl }
        ]}
        faq={productFAQ}
        aggregateRating={{ ratingValue: 4.8, reviewCount: 127, bestRating: 5 }}
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

            {/* Certifications & Compliance - Only show refrigerant-specific for refrigerants */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  {product.product_type === 'refrigerant' ? 'Certifications & Compliance' : 'Quality Assurance'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {product.product_type === 'refrigerant' && (
                    <>
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 text-green-600 mr-2" />
                        <span>EPA Section 608 Compliant</span>
                      </div>
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 text-green-600 mr-2" />
                        <span>DOT Shipping Certified</span>
                      </div>
                    </>
                  )}
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
              {product.product_type === 'refrigerant' && (
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
              
              {/* Starting Price display - show different content for AC products */}
              {product.product_type === 'air_conditioner' ? (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 mb-1">Full Container Base Price</p>
                  <p className="text-lg font-semibold text-blue-900">
                    {product.base_unit_price ? formatPrice(product.base_unit_price) : 'Not configured'}/unit
                  </p>
                  <p className="text-xs text-blue-600">
                    Tiered bulk pricing: MOQ 5 units. Best price at full container quantities.
                  </p>
                </div>
              ) : product.product_type === 'accessory' ? (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 mb-1">Starting Price</p>
                  <p className="text-lg font-semibold text-blue-900">
                    {formatPrice(product.price)}/piece
                  </p>
                  <p className="text-xs text-blue-600">
                    Quantity discounts available (5% for 5-pack, 15% for 10-pack)
                  </p>
                </div>
              ) : null}

              {/* Refrigerant Pricing Display */}
              {product.product_type === 'refrigerant' && (
                <div className="mb-4">
                  {packaging ? (
                     <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-slate-50 p-5">
                       <div className="flex items-center gap-2 mb-3">
                         <Badge className="bg-blue-600 text-white text-xs">{packaging}</Badge>
                         {(packaging === '1-10 Pallets' || packaging === '10-20 Pallets') && (
                           <span className="text-sm text-muted-foreground">× {palletQuantity} pallet{palletQuantity > 1 ? 's' : ''}</span>
                         )}
                       </div>
                       {/* Per-cylinder price is the HERO */}
                       <p className="text-4xl font-bold text-blue-700 mb-1">
                         {formatPrice(getPerCylinderPrice(packaging))}<span className="text-lg font-medium text-blue-500">/cylinder</span>
                       </p>
                       {/* Total cost shown second */}
                       <p className="text-lg text-muted-foreground font-medium mb-2">
                         Total: {formatPrice(getCurrentPrice())}
                       </p>
                       <p className="text-sm text-muted-foreground">
                         {getPackagingDescription(packaging)}
                       </p>
                       {packaging !== '20ft Container' && packaging !== '40ft Container' && packaging !== 'Truck Load (53ft)' && (
                         <p className="text-xs text-emerald-600 mt-3 flex items-center gap-1">
                           💡 Best price at full load: {formatPrice(product.price)}/cyl
                         </p>
                       )}
                     </div>
                   ) : (
                     <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-slate-50 p-5">
                       <p className="text-sm font-semibold text-blue-800 mb-3">Volume Pricing (per cylinder)</p>
                       <div className="space-y-2">
                         <div className="flex justify-between items-center py-2 border-b border-blue-100">
                           <span className="text-sm text-muted-foreground">1–10 Pallets</span>
                           <span className="font-semibold text-foreground">{formatPrice(product.price + 20)}/cyl</span>
                         </div>
                         <div className="flex justify-between items-center py-2 border-b border-blue-100">
                           <span className="text-sm text-muted-foreground">10–20 Pallets</span>
                           <span className="font-semibold text-foreground">{formatPrice(product.price + 15)}/cyl</span>
                         </div>
                         <div className="flex justify-between items-center py-2">
                           <span className="text-sm text-muted-foreground">Full Load</span>
                           <span className="font-bold text-emerald-700">{formatPrice(product.price)}/cyl</span>
                         </div>
                       </div>
                       <p className="text-xs text-muted-foreground mt-3 text-center">Select a packaging option below to see your total</p>
                     </div>
                   )}
                </div>
              )}

              {/* Accessory Pricing Display */}
              {product.product_type === 'accessory' && (
                <div className="mb-4">
                  {packaging ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <p className="text-3xl font-bold text-blue-600">
                          {formatPrice(getCurrentPrice())}
                        </p>
                        {getDiscountPercentage() > 0 && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                            {getDiscountPercentage()}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <p className="text-gray-500 text-lg font-medium">Select packaging to see pricing</p>
                    </div>
                  )}
                </div>
              )}

              {/* Purchase Options - Moved up for better UX */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Purchase Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* AC Products: Configuration + tiered bulk pricing */}
                  {product.product_type === 'air_conditioner' ? (
                    <>
                      {/* AC Configurator - Configure Your Unit section */}
                      {acConfiguration && (
                        <div className="mb-4">
                          <ACConfigurator
                            product={product}
                            configuration={acConfiguration}
                            onConfigurationChange={setAcConfiguration}
                          />
                        </div>
                      )}
                      
                      <ACBulkPricing
                        product={product}
                        quantity={acQuantity}
                        onQuantityChange={setAcQuantity}
                        formatPrice={formatPrice}
                      />
                      
                      {/* Configuration Summary */}
                      {acConfiguration && (
                        <div className="text-sm text-muted-foreground bg-muted/50 rounded-md p-2 text-center">
                          {formatConfigurationSummary(acConfiguration)}
                        </div>
                      )}
                      
                      <div className="space-y-3 pt-4 border-t">
                        <Button 
                          onClick={handleAddToCart} 
                          className="w-full bg-orange-500 hover:bg-orange-600"
                          disabled={acQuantity < 5 || !calculateACPricingTier(product, acQuantity)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>

                        <Button onClick={handleAddToRFQ} variant="outline" className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Request Quote
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Non-AC products: Packaging selector */}
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
                                      {formatPrice(calculateBulkPrice(pkg, pkg === '5-10 Pallets' ? 5 : 1))}
                                    </span>
                                    {product.product_type === 'accessory' ? (
                                      pkg === '5-Pack' ? <div className="text-xs text-green-600">5% OFF</div> :
                                      pkg === '10-Pack' ? <div className="text-xs text-green-600">15% OFF</div> : null
                                    ) : null}
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Pallet quantity selector for tier 1 and 2 */}
                      {product.product_type === 'refrigerant' && (packaging === '1-10 Pallets' || packaging === '10-20 Pallets') && (
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-2">
                             Number of Pallets
                           </label>
                           <div className="flex items-center space-x-3">
                             <Button variant="outline" size="sm" onClick={() => setPalletQuantity(Math.max(packaging === '10-20 Pallets' ? 10 : 1, palletQuantity - 1))}>
                               -
                             </Button>
                             <span className="text-xl font-semibold w-12 text-center">{palletQuantity}</span>
                             <Button variant="outline" size="sm" onClick={() => setPalletQuantity(Math.min(packaging === '1-10 Pallets' ? 10 : 20, palletQuantity + 1))}>
                               +
                             </Button>
                           </div>
                           <p className="text-xs text-gray-500 mt-1">
                             {palletQuantity * CYLINDERS_PER_PALLET} cylinders total ({CYLINDERS_PER_PALLET} per pallet)
                           </p>
                         </div>
                       )}

                      {/* Quantity selector - for accessories and legacy */}
                      {product.product_type !== 'refrigerant' && (
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
                      )}

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
                    </>
                  )}

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
                      {product.product_type === 'air_conditioner' 
                        ? 'Our HVAC experts are available to help you select the right units for your project.'
                        : 'Our refrigerant experts are available to help you choose the right product for your application.'}
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