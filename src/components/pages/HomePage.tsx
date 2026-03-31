
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Quote, Award, Truck, Shield, Phone, Mail, Clock, CheckCircle, Star, Zap, Users, Building2, Globe, ThermometerSun, ArrowRight, Search, FileText, Package } from 'lucide-react';
import QuoteTypeSelector from '@/components/ui/QuoteTypeSelector';
import { useProducts } from '@/contexts/ProductsContext';
import ProductCard from '@/components/ProductCard';
import TestimonialSection from '@/components/ui/TestimonialSection';
import { RollingTextBanner } from '@/components/ui/RollingTextBanner';
import { ContactDisplay } from '@/components/ui/ContactDisplay';
import { supabase } from '@/integrations/supabase/client';
import { createProductSlug } from '@/lib/slugs';
import SEOComponent from '@/components/seo/SEOComponent';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/contexts/OrdersContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const HomePage = () => {
  const { t } = useTranslation();
  const { products, loading } = useProducts();
  const [homepageProducts, setHomepageProducts] = useState<Array<{name: string, href: string}>>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const { addItem, clearCart, items } = useCart();
  const { createOrder, loading: orderLoading } = useOrders();
  const { user } = useAuth();

  // Removed test order functionality - not needed in production

  useEffect(() => {
    const fetchHomepageProducts = async () => {
      try {
        const { data: featuredData, error } = await supabase
          .from('featured_products')
          .select(`
            products (
              id,
              name
            )
          `)
          .eq('section_name', 'homepage_inventory')
          .eq('is_active', true)
          .order('order_index');

        if (error) throw error;

        const productList = featuredData?.map(item => ({
          name: item.products?.name || '',
          href: `/products/${createProductSlug(item.products?.name || '')}` // Use consistent slug generation
        })) || [];

        setHomepageProducts(productList);
      } catch (error) {
        console.error('Error fetching homepage products:', error);
        // Fallback to default products
        setHomepageProducts([
          { name: 'R-410A', href: '/products' },
          { name: 'R-134a', href: '/products' },
          { name: 'R-22', href: '/products' },
          { name: 'R-404A', href: '/products' },
          { name: 'R-507', href: '/products' },
          { name: 'Low-GWP', href: '/products' }
        ]);
      }
    };

    const fetchFeaturedProducts = async () => {
      try {
        // Try 'featured' section first, then fall back to 'homepage_inventory'
        let { data: featuredData, error } = await supabase
          .from('featured_products')
          .select(`
            products (
              id,
              name,
              price,
              pallet_price,
              container_20ft_price,
              container_40ft_price,
              discount_20ft,
              discount_40ft,
              packaging_options,
              images,
              thumbnail_url,
              sku,
              epa_approved,
              category,
              chemical_formula,
              applications,
              stock_quantity,
              availability
            )
          `)
          .eq('section_name', 'featured')
          .eq('is_active', true)
          .order('order_index')
          .limit(3);

        // If no featured products found, get from homepage_inventory instead
        if (!featuredData || featuredData.length === 0) {
          const { data: inventoryData, error: inventoryError } = await supabase
            .from('featured_products')
            .select(`
              products (
                id,
                name,
                price,
                pallet_price,
                container_20ft_price,
                container_40ft_price,
                discount_20ft,
                discount_40ft,
                packaging_options,
                images,
                thumbnail_url,
                sku,
                epa_approved,
                category,
                chemical_formula,
                applications,
                stock_quantity,
                availability
              )
            `)
            .eq('section_name', 'homepage_inventory')
            .eq('is_active', true)
            .order('order_index')
            .limit(3);
          
          featuredData = inventoryData;
          error = inventoryError;
        }

        if (error) throw error;

        const productList = featuredData?.map(item => ({
          id: item.products?.id || '',
          name: item.products?.name || '',
          price: item.products?.price || 0,
          pallet_price: item.products?.pallet_price,
          container_20ft_price: item.products?.container_20ft_price,
          container_40ft_price: item.products?.container_40ft_price,
          discount_20ft: item.products?.discount_20ft,
          discount_40ft: item.products?.discount_40ft,
          packaging_options: item.products?.packaging_options || [],
          image: item.products?.thumbnail_url || (Array.isArray(item.products?.images) ? item.products?.images[0] : '') || '',
          sku: item.products?.sku || '',
          epaApproved: item.products?.epa_approved || false,
          category: item.products?.category,
          chemical_formula: item.products?.chemical_formula,
          applications: item.products?.applications || [],
          stock_quantity: item.products?.stock_quantity,
          availability: item.products?.availability
        })) || [];

        setFeaturedProducts(productList);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        // Fallback to first 3 products from main products list
        setFeaturedProducts(products.slice(0, 3));
      }
    };

    fetchHomepageProducts();
    fetchFeaturedProducts();
  }, [products]);

  // Structured data for homepage
  const homepageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Alper Refrigerant - Professional Refrigerant Distributor",
    "url": "https://alperrefrigas.com",
    "description": "Leading wholesale refrigerant distributor specializing in HFC, HFO, and natural refrigerants for HVAC professionals, contractors, and industrial facilities.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://alperrefrigas.com/products?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "mainEntity": {
      "@type": "Organization",
      "name": "Alper Refrigerant",
      "alternateName": "Alper Refrigerants",
      "specialty": ["Refrigerant Distribution", "HVAC Supplies", "EPA Compliance", "Bulk Refrigerants"],
      "serviceArea": {
        "@type": "Country",
        "name": "United States"
      }
    }
  };

  // Homepage FAQ for better SEO
  const homepageFAQ = [
    {
      question: "What is the minimum order quantity for refrigerants?",
      answer: "Our minimum order quantity (MOQ) is 40 cylinders per pallet. We offer competitive bulk pricing for larger quantities including 20ft containers (1,140 cylinders) and 40ft containers (2,280 cylinders)."
    },
    {
      question: "Do you ship refrigerants internationally?",
      answer: "Yes, we ship refrigerants globally from our distribution centers in Texas, Florida, and California. All shipments are DOT certified and comply with international shipping regulations."
    },
    {
      question: "Are your refrigerants EPA approved?",
      answer: "Yes, all our refrigerants are EPA Section 608 compliant and approved for professional HVAC use in the United States. We provide certificates of compliance with every order."
    },
    {
      question: "What refrigerant types do you carry?",
      answer: "We specialize in HFC refrigerants (R-134a, R-410A, R-404A, R-22), HFO refrigerants for environmental compliance, and natural refrigerants. Our inventory includes over 30 different refrigerant types."
    },
    {
      question: "How fast is your shipping?",
      answer: "We offer same-day shipping for in-stock items from our Texas, Florida, and California distribution centers. Most orders arrive within 1-3 business days depending on location."
    },
    {
      question: "Do you provide Safety Data Sheets?",
      answer: "Yes, we provide comprehensive Safety Data Sheets (SDS) for all refrigerant products. SDS documents include handling instructions, safety precautions, and technical specifications."
    }
  ];

  return (
    <>
      <SEOComponent
        title="Alper Refrigerants - Wholesale Refrigerant Distributor | R-410A, R-134a, R-22 Bulk Supplier | EPA Certified"
        description="⭐ Leading wholesale refrigerant distributor since 2020. EPA certified bulk supplier of R-410A, R-134a, R-22, R-404A with 99.9% purity guarantee. MOQ 40 cylinders. Same-day shipping from TX, FL, CA distribution centers. Professional HVAC supply partner for contractors & distributors nationwide."
        keywords="alper refrigerants, wholesale refrigerant distributor, bulk refrigerant supplier, R-410A wholesale, R-134a bulk, R-22 distributor, HFC refrigerants, HFO refrigerants, HVAC supplies, EPA certified refrigerants, commercial refrigeration, automotive refrigerants, refrigerant bulk sales, MOQ 40 cylinders, fast shipping, distribution centers, professional HVAC supplier"
        canonicalUrl="/"
        structuredData={homepageStructuredData}
        faq={homepageFAQ}
        ogImage="/placeholder.svg"
        ogType="website"
      />
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Rolling Text Banner - Top placement for maximum visibility */}
      <RollingTextBanner 
        autoRotate={true}
        rotationInterval={6000}
        className="sticky top-[var(--header-height,83px)] z-40"
      />
      
      {/* Hero Section with improved visibility */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="container mx-auto px-4 py-10 sm:py-16 md:py-20 relative z-10">
          <div className="text-center space-y-6 sm:space-y-8">
            <div className="space-y-4">
              <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 px-4 sm:px-6 py-2 text-sm sm:text-lg">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                {t('home.hero.badge')}
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight" 
                  dangerouslySetInnerHTML={{ __html: t('home.hero.title') }}>
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-enhanced-secondary max-w-4xl mx-auto leading-relaxed text-shadow-sm">
                {t('home.hero.description')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Link to="/products">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
                    >
                      <ShoppingCart className="mr-3 h-6 w-6" />
                      {t('home.hero.shopRefrigerants')}
                    </Button>
                  </Link>
                  <Link to="/freon-wholesale">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 px-8 py-4 text-lg font-semibold shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Quote className="mr-3 h-6 w-6" />
                      Contractor Bulk Freon Quotes
                    </Button>
                  </Link>
            </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400 text-shadow-md">500+</div>
                  <div className="text-enhanced-secondary font-medium">Products Available</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 text-shadow-md">24/7</div>
                  <div className="text-enhanced-secondary font-medium">Customer Support</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 text-shadow-md">48hr</div>
                  <div className="text-enhanced-secondary font-medium">Fast Shipping</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 text-shadow-md">EPA</div>
                  <div className="text-enhanced-secondary font-medium">Certified</div>
                </div>
              </div>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800/50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-500/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Header section with visual elements */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full mb-6 shadow-lg shadow-cyan-500/25">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                Professional Wholesale Refrigerant Distributor
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-6 rounded-full"></div>
              <p className="text-xl text-enhanced-secondary max-w-3xl mx-auto">
                Trusted by thousands of HVAC professionals across North America
              </p>
            </div>

            {/* Main content in cards layout */}
            <div className="space-y-8">
              {/* Introduction card */}
              <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-cyan-500/20 backdrop-blur-sm hover:border-cyan-400/40 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-4 text-shadow-sm">Premier Freon & Refrigerant Quality Excellence</h3>
                          <p className="text-enhanced-secondary text-lg leading-relaxed">
                            Alper Refrigerant stands as North America's premier wholesale freon and refrigerant distributor, serving HVAC professionals, contractors, and industrial facilities with the highest quality refrigerants and unmatched technical expertise. Since our founding, we've built a reputation for reliability, compliance, and innovation in the refrigeration industry.
                          </p>
                        </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product range highlight */}
              <Card className="bg-gradient-to-br from-slate-800/95 to-slate-700/95 border-blue-500/20 backdrop-blur-sm hover:border-blue-400/40 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Package className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-4 text-shadow-sm">Comprehensive Freon & Refrigerant Inventory</h3>
                      <p className="text-enhanced-secondary leading-relaxed mb-4">
                        Our comprehensive freon and refrigerant inventory includes next-generation low-GWP refrigerants that meet the most stringent EPA regulations and environmental standards. Every freon product in our catalog undergoes rigorous quality testing to ensure optimal performance and purity levels that exceed industry benchmarks.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {homepageProducts.map((product) => (
                          <Link key={product.name} to={product.href}>
                            <Badge className="bg-cyan-500/20 text-cyan-200 border-cyan-400/30 hover:bg-cyan-500/40 hover:text-white transition-all duration-200 cursor-pointer">
                              {product.name}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                      
                      {/* Internal linking for SEO */}
                      <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-6 my-8">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                          <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                          Related Wholesale Products
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <Link
                            to="/freon-wholesale"
                            className="block p-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg border border-slate-600/50 hover:border-cyan-400/30 transition-all duration-200 group"
                          >
                            <span className="text-cyan-400 font-medium group-hover:text-cyan-300 transition-colors">
                              freon wholesale distributor
                            </span>
                            <p className="text-enhanced-muted text-sm mt-1">Bulk freon pricing for contractors</p>
                          </Link>
                          <Link
                            to="/products/r-410a-refrigerant-gas-alper-refrigerant-gas"
                            className="block p-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg border border-slate-600/50 hover:border-cyan-400/30 transition-all duration-200 group"
                          >
                            <span className="text-cyan-400 font-medium group-hover:text-cyan-300 transition-colors">
                              R-410A wholesale
                            </span>
                            <p className="text-gray-300 text-sm mt-1">R-410A bulk pricing</p>
                          </Link>
                          <Link
                            to="/products/r-134a-refrigerant"
                            className="block p-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg border border-slate-600/50 hover:border-cyan-400/30 transition-all duration-200 group"
                          >
                            <span className="text-cyan-400 font-medium group-hover:text-cyan-300 transition-colors">
                              R-134a freon
                            </span>
                            <p className="text-gray-300 text-sm mt-1">Automotive refrigerant wholesale</p>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Two-column expertise section */}
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-gradient-to-br from-slate-800/95 to-slate-700/95 border-green-500/20 backdrop-blur-sm hover:border-green-400/40 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Industry Expertise</h3>
                    </div>
                    <p className="text-gray-100 leading-relaxed">
                      With decades of combined experience, our certified technicians understand the complexities of refrigerant selection, system compatibility, and regulatory compliance. We provide comprehensive technical support, helping you navigate EPA Section 608 requirements, proper handling procedures, and optimal storage solutions.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-slate-800/95 to-slate-700/95 border-orange-500/20 backdrop-blur-sm hover:border-orange-400/40 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <Truck className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Nationwide Distribution</h3>
                    </div>
                    <p className="text-gray-100 leading-relaxed">
                      Our strategically located distribution centers across North America ensure rapid delivery to any location. Whether you need emergency refrigerant supply for critical repairs or scheduled deliveries for large-scale projects, our logistics network guarantees reliable, on-time service.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Quality assurance section */}
              <Card className="bg-gradient-to-br from-slate-800/95 to-slate-700/95 border-purple-500/20 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-4">Uncompromising Quality Assurance</h3>
                      <p className="text-gray-100 leading-relaxed mb-4">
                        Quality assurance is paramount in everything we do. Our state-of-the-art testing facility conducts purity analysis, moisture content verification, and contaminant screening on every batch. This meticulous attention to detail ensures that when you choose Alper Refrigerant products, you're getting products that perform consistently and reliably in the field.
                      </p>
                      <p className="text-gray-100 leading-relaxed">
                        We understand that HVAC professionals need more than just products – they need a partner who understands their business challenges. That's why we offer flexible payment terms, bulk pricing options, and customized delivery schedules that align with your project timelines and cash flow requirements.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Environmental responsibility */}
              <Card className="bg-gradient-to-br from-slate-800/95 to-slate-700/95 border-teal-500/20 backdrop-blur-sm hover:border-teal-400/40 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Globe className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-4">Environmental Stewardship</h3>
                      <p className="text-gray-100 leading-relaxed">
                        Environmental responsibility drives our operations. We maintain comprehensive recycling programs for used refrigerants, partner with certified reclamation facilities, and continuously invest in cleaner, more sustainable refrigerant technologies. Our commitment to environmental stewardship helps our customers meet their sustainability goals while maintaining operational efficiency.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency support callout */}
              <Card className="bg-gradient-to-r from-red-900/50 to-orange-900/50 border-2 border-red-500/30 backdrop-blur-sm hover:border-red-400/50 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-xl"></div>
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/25">
                      <Clock className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-4">24/7 Emergency Support</h3>
                      <p className="text-white text-lg leading-relaxed font-medium text-shadow-sm">
                        System failures don't wait for business hours. Our emergency response team is available around the clock to provide urgent refrigerant supply and technical guidance. When critical systems are down, count on Alper Refrigerant to get you back up and running quickly.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Future innovation section - Fixed visibility */}
              <Card className="bg-white/95 border-2 border-indigo-200 backdrop-blur-sm hover:border-indigo-300 transition-all duration-300 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Innovation & Future-Ready Solutions</h3>
                      <p className="text-gray-700 leading-relaxed text-lg">
                        Looking ahead, Alper Refrigerant continues to innovate and expand our service offerings. We're investing in advanced inventory management systems, enhanced logistics capabilities, and emerging refrigerant technologies that will define the future of HVAC and refrigeration. When you partner with Alper Refrigerant, you're not just buying refrigerants - you're gaining a strategic advantage in an evolving industry.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* How to Order Section */}
              <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-2 border-green-500/30 backdrop-blur-sm hover:border-green-400/50 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-xl"></div>
                <CardContent className="p-8 relative z-10">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mb-6 shadow-lg shadow-green-500/25">
                      <Package className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">How to Order</h3>
                    <p className="text-white text-lg font-medium text-shadow-sm">
                      Simple steps to get your refrigerants delivered fast
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mb-4 shadow-lg">
                        <Search className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">1. Browse & Select</h4>
                      <p className="text-gray-300">
                        Browse our catalog and select the refrigerants you need. Add them to your cart with desired quantities.
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
                        <FileText className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">2. Quick Checkout</h4>
                      <p className="text-gray-300">
                        Provide your shipping details and EPA certification. Choose from credit card, wire transfer, or company check.
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mb-4 shadow-lg">
                        <Truck className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">3. Fast Delivery</h4>
                      <p className="text-gray-300">
                        Orders ship within 24-48 hours. Track your shipment and receive SMS notifications for delivery updates.
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-center mt-8">
                    <Link to="/rfq">
                      <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 px-8 py-4 text-lg font-semibold shadow-xl transition-all duration-300">
                        <Quote className="mr-2 h-5 w-5" />
                        Get Bulk Quote
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Call to action */}
              <div className="text-center pt-8">
                <div className="inline-flex gap-4">
                  <Link to="/products">
                    <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
                      <Search className="mr-2 h-5 w-5" />
                      Explore Our Products
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button size="lg" variant="outline" className="bg-white/5 backdrop-blur-sm border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 px-8 py-4 text-lg font-semibold transition-all duration-300">
                      <ArrowRight className="mr-2 h-5 w-5" />
                      Get Expert Guidance
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Featured Refrigerants</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover our most popular refrigerants trusted by HVAC professionals worldwide. All products are EPA approved and ready for immediate shipping.
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-gradient-to-br from-slate-800 to-slate-700 border-cyan-500/20 animate-pulse">
                  <CardContent className="p-6">
                    <div className="aspect-square w-full bg-slate-600 rounded-lg mb-4"></div>
                    <div className="h-6 bg-slate-600 rounded mb-2"></div>
                    <div className="h-4 bg-slate-600 rounded mb-4"></div>
                    <div className="h-10 bg-slate-600 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8 items-stretch">
              {featuredProducts.map((product) => (
                <div key={product.id} className="animate-fade-in h-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No products available yet. Please add some products in the admin panel.</p>
              <Link to="/admin" className="inline-block mt-4">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                  Go to Admin Panel
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose Alper Refrigerant?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're more than just a supplier - we're your strategic partner in refrigerant solutions. Here's what sets us apart in the industry.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 p-8 rounded-xl border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">EPA Certified Excellence</h3>
              <p className="text-white leading-relaxed font-medium text-shadow-sm">
                All our refrigerants meet strict EPA standards and regulations. We maintain comprehensive documentation and certifications for complete regulatory compliance.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 p-8 rounded-xl border border-purple-500/20 hover:border-purple-400/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-6">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Lightning Fast Delivery</h3>
              <p className="text-white leading-relaxed font-medium text-shadow-sm">
                Same-day processing and 48-hour delivery to most locations. Our nationwide distribution network ensures your projects stay on schedule.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 p-8 rounded-xl border border-green-500/20 hover:border-green-400/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Expert Technical Support</h3>
              <p className="text-white leading-relaxed font-medium text-shadow-sm">
                Our certified technicians provide 24/7 support for product selection, compatibility, and technical guidance for your specific applications.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 p-8 rounded-xl border border-yellow-500/20 hover:border-yellow-400/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mb-6">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Premium Quality Guarantee</h3>
              <p className="text-white leading-relaxed font-medium text-shadow-sm">
                Every product undergoes rigorous quality testing. We guarantee purity levels and offer full replacement warranty for any quality issues.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 p-8 rounded-xl border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-6">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Industry Partnerships</h3>
              <p className="text-white leading-relaxed font-medium text-shadow-sm">
                Authorized distributor for leading manufacturers. Direct relationships ensure authentic products and competitive wholesale pricing.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 p-8 rounded-xl border border-red-500/20 hover:border-red-400/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Environmental Responsibility</h3>
              <p className="text-white leading-relaxed font-medium text-shadow-sm">
                Committed to sustainable practices with proper recycling programs and eco-friendly refrigerant solutions for a greener future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Comprehensive Refrigerant Services</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Beyond supply, we offer complete refrigerant lifecycle management to support your business operations and ensure regulatory compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-slate-700 to-slate-600 border-cyan-500/30 hover:border-cyan-400/50 transition-all">
              <CardContent className="p-6 text-center">
                <ThermometerSun className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Product Testing</h3>
                <p className="text-gray-300 text-sm">Comprehensive purity and quality testing for all refrigerant products.</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-700 to-slate-600 border-purple-500/30 hover:border-purple-400/50 transition-all">
              <CardContent className="p-6 text-center">
                <Zap className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Emergency Supply</h3>
                <p className="text-gray-300 text-sm">24/7 emergency refrigerant supply for critical system repairs.</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-700 to-slate-600 border-green-500/30 hover:border-green-400/50 transition-all">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Compliance Support</h3>
                <p className="text-gray-300 text-sm">EPA documentation and regulatory compliance assistance.</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-700 to-slate-600 border-blue-500/30 hover:border-blue-400/50 transition-all">
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Scheduled Delivery</h3>
                <p className="text-gray-300 text-sm">Regular delivery schedules to maintain your inventory levels.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Seamless Sourcing Process Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Seamless Sourcing: Our Simple Process</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From inquiry to delivery, we've streamlined every step to make refrigerant procurement effortless and efficient for your business.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Search className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Browse & Search</h3>
              <p className="text-white leading-relaxed font-medium text-shadow-sm">
                Explore our comprehensive catalog of EPA-approved refrigerants. Use our advanced search filters to find exactly what you need.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Quote className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Request Quote</h3>
              <p className="text-white leading-relaxed font-medium text-shadow-sm">
                Submit your requirements for bulk orders. Our team provides competitive pricing and customized solutions within 24 hours.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Order & Documentation</h3>
              <p className="text-white leading-relaxed font-medium text-shadow-sm">
                Place your order with complete EPA documentation, certifications, and compliance paperwork handled automatically.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  4
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Fast Delivery</h3>
              <p className="text-white leading-relaxed font-medium text-shadow-sm">
                Receive your refrigerants with our 48-hour delivery guarantee. Real-time tracking and signature confirmation included.
              </p>
            </div>
          </div>

          {/* Process CTA */}
          <div className="text-center mt-12">
            <Link to="/products">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300"
              >
                Start Your Order Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialSection />


    </div>
    </>
  );
};

export default HomePage;
