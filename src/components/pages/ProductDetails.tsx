import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Plus, FileText, Shield, Truck, Award, ShoppingCart, AlertTriangle, CheckCircle, Minus } from 'lucide-react';
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

  // --- New pallet-based tier pricing for refrigerants ---
  const getTierFromPalletCount = (qty: number) => {
    if (!product) return { markup: 20, label: '1–10 Pallets', perCylinder: 0, total: 0, tierHint: '' };
    const base = product.price;
    let markup = 20;
    let label = '1–10 Pallets';
    let tierHint = '';

    if (qty >= 28) {
      markup = 0;
      if (qty === 28) label = '20ft Container';
      else if (qty === 44) label = 'Truck Load';
      else if (qty === 56) label = '40ft Container';
      else label = `${qty} Pallets (Container Rate)`;
    } else if (qty >= 11) {
      markup = 15;
      label = '11–27 Pallets';
      const needed = 28 - qty;
      tierHint = `Add ${needed} more pallet${needed > 1 ? 's' : ''} to unlock container pricing`;
    } else {
      markup = 20;
      label = '1–10 Pallets';
      if (qty >= 8) {
        tierHint = `Add ${11 - qty} more pallet${11 - qty > 1 ? 's' : ''} to get the mid-volume rate`;
      }
    }
    const perCylinder = base + markup;
    const cylinders = qty * CYLINDERS_PER_PALLET;
    const total = perCylinder * cylinders;
    return { markup, label, perCylinder, total, tierHint, cylinders };
  };

  // Derive packaging label from pallet count
  const getPalletPackagingLabel = (qty: number): string => {
    if (qty === 28) return '20ft Container (1,120 cylinders)';
    if (qty === 44) return 'Truck Load (1,760 cylinders)';
    if (qty === 56) return '40ft Container (2,240 cylinders)';
    return `${qty} Pallet${qty > 1 ? 's' : ''} (${qty * CYLINDERS_PER_PALLET} cylinders)`;
  };

  // Legacy bulk pricing for accessories
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
    
    // Refrigerant: use new tier system
    return getTierFromPalletCount(palletQty).total;
  };

  const getCurrentPrice = (): number => {
    if (!product) return 0;
    if (product.product_type === 'air_conditioner') {
      const tier = calculateACPricingTier(product, acQuantity);
      return tier ? tier.total : 0;
    }
    if (product.product_type === 'refrigerant') {
      return getTierFromPalletCount(palletQuantity).total;
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

  // Use cases derived from product data (must be before early returns to maintain hook order)
  const useCases = React.useMemo(() => {
    if (!product) return [];
    const cases: string[] = [];
    const isRef = product.product_type === 'refrigerant';
    if (isRef) {
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

  // Specifications for table (must be before early returns to maintain hook order)
  const specsTableData = React.useMemo(() => {
    if (!product) return [];
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
    // Refrigerants derive packaging from pallet count
    if (product.product_type === 'refrigerant') {
      const packagingLabel = getPalletPackagingLabel(palletQuantity);
      addToRFQ({
        productId: product.id,
        productName: product.name,
        quantity: 1,
        packaging: packagingLabel,
        imageUrl: product.image
      });
      toast({
        title: "Added to Quote Request",
        description: `${packagingLabel} of ${product.name} added to your quote request.`
      });
      return;
    }

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
    
    // Refrigerant: derive from pallet count
    if (product.product_type === 'refrigerant') {
      const tier = getTierFromPalletCount(palletQuantity);
      const packagingLabel = getPalletPackagingLabel(palletQuantity);
      const cartItemId = `${product.id}-refrigerant-${palletQuantity}p`;

      addToCart({
        id: cartItemId,
        name: product.name,
        price: tier.total,
        image: product.image || '/placeholder.svg',
        sku: product.sku || 'N/A',
        epaApproved: product.epaApproved || false,
        packaging: packagingLabel,
        product_type: 'refrigerant'
      });
      toast({
        title: "Added to Cart",
        description: `${packagingLabel} of ${product.name} added to your cart.`,
        action: <Button variant="outline" size="sm" onClick={() => navigate('/cart')}>
            View Cart
          </Button>
      });
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

  // Dynamic SEO keyword mapping with short-form aliases
  const currentYear = new Date().getFullYear();
  const isRefrigerant = product.product_type === 'refrigerant';
  const isAC = product.product_type === 'air_conditioner';
  
  // Extract short-form name for SEO (e.g., "R-134A" from "R-134A Refrigerant Gas | Alper Refrigerant Gas")
  const shortName = (() => {
    const name = product.name;
    // Match R-XXX pattern or brand model pattern
    const rMatch = name.match(/R-?\d{2,4}[A-Za-z]*/i);
    if (rMatch) return rMatch[0].toUpperCase();
    // For Freon products, extract the trade name
    const freonMatch = name.match(/Freon[™\s]*([^\(]+)/i);
    if (freonMatch) return freonMatch[0].replace(/[™]/g, '').trim();
    // For accessories, extract brand + model
    const words = name.split(/[\s|–—-]+/).filter(Boolean);
    return words.slice(0, 3).join(' ');
  })();
  
  // Build concise SEO title under 60 chars
  const seoTitle = (() => {
    if (isRefrigerant) {
      const candidate = `${shortName} Wholesale Price ${currentYear} | Alper`;
      return candidate.length <= 60 ? candidate : `${shortName} Bulk Price ${currentYear} | Alper`;
    }
    if (isAC) {
      const candidate = `${shortName} Wholesale ${currentYear} | Alper`;
      return candidate.length <= 60 ? candidate : `${product.name.substring(0, 35)} | Alper`;
    }
    // Accessories: use brand + model
    const candidate = `${shortName} — Buy Wholesale | Alper`;
    return candidate.length <= 60 ? candidate : `${product.name.substring(0, 35)} | Alper`;
  })();

  const seoDescription = isRefrigerant
    ? `Buy ${shortName} wholesale from $${product.price}/cylinder. EPA approved, bulk pallet & container quantities. Fast shipping from TX, FL, CA warehouses.`
    : isAC
    ? `Buy ${product.name} wholesale. Bulk pricing from ${formatPrice(product.price)}/unit. MOQ 5 units. Fast shipping across the US.`
    : `Buy ${product.name} at wholesale prices. Professional HVAC tool with fast shipping. In stock at Alper Refrigerants.`;
    
  // Include both full name AND short aliases for keyword coverage
  const seoKeywords = isRefrigerant
    ? `${shortName}, ${product.name}, ${shortName} refrigerant, ${shortName} price, wholesale ${shortName} ${currentYear}, buy ${shortName} bulk, ${product.sku}, ${product.category} refrigerant, EPA approved, HVAC refrigerant, bulk refrigerant, ${product.applications?.join(', ') || ''}`
    : `${product.name}, ${shortName}, ${product.sku}, ${product.category}, wholesale HVAC, ${product.applications?.join(', ') || ''}`;

  // useCases and specsTableData hooks moved above early returns

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
        
        product={{
          name: product.name,
          // Per-unit price to match Google Merchant Center feed (per-cylinder for refrigerants, per-piece for accessories, per-unit for AC)
          price: isRefrigerant ? product.price : (product.base_unit_price || product.price),
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

            {/* Mobile price summary — keeps price above the fold on phones */}
            <div className="lg:hidden mb-6 rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-slate-50 p-4">
              <h1 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-3xl font-bold text-primary">
                {formatPrice(product.price)}
                <span className="text-sm font-medium text-muted-foreground">
                  {product.product_type === 'refrigerant' ? '/cylinder' : product.product_type === 'air_conditioner' ? '/unit' : '/piece'}
                </span>
              </p>
              {product.product_type === 'air_conditioner' && (
                <p className="text-xs text-blue-800 mt-1">Minimum order 5 units</p>
              )}
              <Button
                className="mt-3 w-full"
                onClick={() => document.getElementById('purchase-options')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                See order options
              </Button>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isRefrigerant ? `${product.name} — Wholesale ${product.category || ''} Refrigerant` : product.name}
              </h1>
              
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
                <div className="mb-4 p-4 rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-slate-50">
                  <p className="text-4xl font-bold text-primary mb-1">
                    {formatPrice(product.price)}
                    <span className="text-lg font-medium text-muted-foreground">/unit</span>
                  </p>
                  <p className="text-sm text-blue-800">Minimum order 5 units</p>
                  {product.base_unit_price && product.base_unit_price < product.price && (
                    <p className="text-xs text-emerald-600 mt-2">
                      💡 As low as {formatPrice(product.base_unit_price)}/unit at full container volume
                    </p>
                  )}
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

              {/* Refrigerant Pricing Display — driven by palletQuantity */}
              {product.product_type === 'refrigerant' && (() => {
                const tier = getTierFromPalletCount(palletQuantity);
                return (
                  <div className="mb-4">
                    <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-slate-50 p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-primary text-primary-foreground text-xs">{tier.label}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {palletQuantity} pallet{palletQuantity > 1 ? 's' : ''} · {tier.cylinders?.toLocaleString()} cylinders
                        </span>
                      </div>
                      {/* Per-cylinder price is the HERO */}
                      <p className="text-4xl font-bold text-primary mb-1">
                        {formatPrice(tier.perCylinder)}<span className="text-lg font-medium text-muted-foreground">/cylinder</span>
                      </p>
                      {tier.markup > 0 && (
                        <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                          💡 Best price at 28+ pallets: {formatPrice(product.price)}/cyl
                        </p>
                      )}
                      {tier.tierHint && (
                        <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                          🚀 {tier.tierHint}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })()}

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

              {/* Trust strip */}
              <div className="mb-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground sm:grid-cols-4">
                <div className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{product.product_type === 'refrigerant' ? 'EPA 608 certified' : 'Factory warranty'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-blue-600" />
                  <span>Ships from US warehouses</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Secure payment</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-amber-600" />
                  <a href="tel:+16822152974" className="hover:underline">682-215-2974</a>
                </div>
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
                  ) : product.product_type === 'refrigerant' ? (
                    <>
                      {/* Refrigerant: Pallet quantity slider */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          How many pallets do you need?
                        </label>
                        <div className="flex items-center space-x-3 mb-3">
                          <Button variant="outline" size="sm" onClick={() => setPalletQuantity(Math.max(1, palletQuantity - 1))}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="text-2xl font-bold w-16 text-center text-foreground">{palletQuantity}</span>
                          <Button variant="outline" size="sm" onClick={() => setPalletQuantity(Math.min(56, palletQuantity + 1))}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Slider
                          value={[palletQuantity]}
                          onValueChange={(val) => setPalletQuantity(val[0])}
                          min={1}
                          max={56}
                          step={1}
                          className="mb-2"
                        />
                        <p className="text-xs text-muted-foreground">
                          {palletQuantity * CYLINDERS_PER_PALLET} cylinders · {CYLINDERS_PER_PALLET} per pallet
                        </p>
                      </div>

                      {/* Full Load quick-select buttons */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Or choose a full load
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            variant={palletQuantity === 28 ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPalletQuantity(28)}
                            className="text-xs"
                          >
                            <Truck className="h-3 w-3 mr-1" />
                            20ft (28)
                          </Button>
                          <Button
                            variant={palletQuantity === 56 ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPalletQuantity(56)}
                            className="text-xs"
                          >
                            <Truck className="h-3 w-3 mr-1" />
                            40ft (56)
                          </Button>
                          <Button
                            variant={palletQuantity === 44 ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPalletQuantity(44)}
                            className="text-xs"
                          >
                            <Truck className="h-3 w-3 mr-1" />
                            Truck (44)
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3 pt-4 border-t">
                        <Button onClick={handleAddToCart} className="w-full bg-orange-500 hover:bg-orange-600">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart — {formatPrice(getTierFromPalletCount(palletQuantity).total)}
                        </Button>

                        <Button onClick={handleAddToRFQ} variant="outline" className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Request Quote
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Accessory products: Packaging selector */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
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
                                    <span className="font-semibold text-primary">
                                      {formatPrice(calculateBulkPrice(pkg, 1))}
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

                      {/* Quantity selector - for accessories */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
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

        {/* SEO Content Sections - Use Cases, Specs Table, FAQ */}
        <div className="mt-12 space-y-8">
          {/* Use Cases & Compatibility */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Use Cases &amp; Compatibility — {product.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {isRefrigerant
                  ? `${product.name} is a ${product.category || 'professional-grade'} refrigerant widely used across residential, commercial, and industrial HVAC-R systems. It is compatible with a broad range of equipment from major manufacturers and is suitable for both new installations and retrofit applications.`
                  : `${product.name} is designed for professional HVAC applications, delivering reliable performance across a range of commercial and residential systems.`}
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {useCases.map((useCase, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{useCase}</span>
                  </li>
                ))}
              </ul>
              {isRefrigerant && (
                <p className="text-sm text-muted-foreground mt-4">
                  All {product.name} shipments comply with DOT hazardous materials regulations (49 CFR) and EPA Section 608 requirements. Purchasers must hold valid EPA certification.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Full Specifications Table */}
          {specsTableData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Complete Specifications — {product.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">Specification</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {specsTableData.map((spec, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{spec.label}</TableCell>
                        <TableCell>{spec.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* FAQ Accordion */}
          {productFAQ.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions — {product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {productFAQ.map((faqItem, idx) => (
                    <AccordionItem key={idx} value={`faq-${idx}`}>
                      <AccordionTrigger>{faqItem.question}</AccordionTrigger>
                      <AccordionContent>{faqItem.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;