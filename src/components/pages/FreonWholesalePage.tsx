import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Quote, Award, Truck, Shield, Phone, Mail, CheckCircle, Star, Zap, Building2, Globe, ThermometerSun, ArrowRight, Package, Users, DollarSign } from 'lucide-react';
import SEOComponent from '@/components/seo/SEOComponent';
import { ContactDisplay } from '@/components/ui/ContactDisplay';
import EmailObfuscator from '@/components/seo/EmailObfuscator';

const FreonWholesalePage = () => {
  // Structured data optimized for freon wholesale
  const wholesaleStructuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Alper Refrigerants - Bulk Freon Distributor for Contractors",
    "description": "Specialized bulk freon distributor serving HVAC contractors with commercial wholesale pricing. R-22, R-410A, R-134a volume discounts up to 25%, contractor program, EPA certified.",
    "url": "https://alperrefrigas.com/freon-wholesale",
    "telephone": "+1-210-939-1115",
    "email": "wholesale@alperrefrigas.com",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US",
      "addressRegion": "TX"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "29.4241",
      "longitude": "-98.4936"
    },
    "openingHours": "Mo-Fr 08:00-18:00",
    "priceRange": "$$",
    "serviceArea": {
      "@type": "Country",
      "name": "United States"
    },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Contractor Freon Wholesale Program",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": "R-22 Bulk Freon for Contractors",
              "description": "Commercial wholesale R-22 freon with contractor volume discounts"
            }
          },
          {
            "@type": "Offer", 
            "itemOffered": {
              "@type": "Product",
              "name": "R-410A Contractor Bulk Pricing",
              "description": "R-410A refrigerant bulk pricing for HVAC contractors"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product", 
              "name": "R-134a Commercial Wholesale",
              "description": "R-134a commercial and automotive freon contractor pricing"
            }
          }
        ]
      },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "247"
    }
  };

  const freonProducts = [
    {
      name: "R-22 Freon",
      description: "Legacy HCFC refrigerant for existing systems",
      applications: ["Residential HVAC", "Commercial AC", "Heat Pumps"],
      pricing: "Bulk wholesale pricing available"
    },
    {
      name: "R-410A Freon", 
      description: "HFC refrigerant blend for modern HVAC systems",
      applications: ["New HVAC Systems", "Commercial Refrigeration", "Heat Pumps"],
      pricing: "Volume discounts for contractors"
    },
    {
      name: "R-134a Freon",
      description: "Automotive and commercial refrigerant",
      applications: ["Automotive AC", "Commercial Chillers", "Refrigeration"],
      pricing: "Competitive wholesale rates"
    },
    {
      name: "R-404A Freon",
      description: "Commercial refrigeration refrigerant",
      applications: ["Supermarket Systems", "Cold Storage", "Food Processing"],
      pricing: "Pallet and container pricing"
    }
  ];

  return (
    <>
      <SEOComponent
        title="Bulk Freon Distributor Contractors - R-22 R-410A R-134a Commercial Wholesale Pricing | Alper Refrigerants"
        description="🔥 HVAC contractor specialists! Bulk freon distributor with commercial wholesale pricing on R-22, R-410A, R-134a. Volume discounts up to 25%, same-day shipping, EPA certified. Contractor quotes in 24hrs!"
        keywords="bulk freon distributor contractors, commercial freon wholesale pricing, R-22 R-410A R-134a wholesale distributor, HVAC contractor bulk pricing, commercial refrigerant wholesale, contractor freon quotes, volume discounts freon, EPA certified bulk freon, commercial HVAC supplies, contractor wholesale program"
        canonicalUrl="/freon-wholesale"
        structuredData={wholesaleStructuredData}
        ogImage="/freon-wholesale-og.jpg"
        ogType="website"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Hero Section - Optimized for "freon wholesale" */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="max-w-5xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-6 py-2 text-lg">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Wholesale Pricing Available
                </Badge>
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
                  Bulk Freon Distributor for HVAC Contractors
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                  Specialized commercial wholesale pricing on bulk R-22, R-410A, R-134a freon for HVAC contractors. Volume discounts up to 25%, EPA certified with same-day shipping nationwide.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link to="/bulk-pricing">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
                  >
                    <Quote className="mr-3 h-6 w-6" />
                    Get Wholesale Quote
                  </Button>
                </Link>
                <EmailObfuscator 
                  email="wholesale@alperrefrigas.com"
                  className="inline-block"
                >
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 px-8 py-4 text-lg font-semibold shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Mail className="mr-3 h-6 w-6" />
                    Email Wholesale Team
                  </Button>
                </EmailObfuscator>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">25%</div>
                  <div className="text-gray-300">Bulk Savings</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">24hr</div>
                  <div className="text-gray-300">Quote Response</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">500+</div>
                  <div className="text-gray-300">Contractors Served</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400">EPA</div>
                  <div className="text-gray-300">Certified</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Freon Products Section */}
        <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Commercial Freon Wholesale for Contractors
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Specialized contractor pricing on R-22, R-410A, R-134a with volume discounts, technical support and guaranteed purity
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {freonProducts.map((product, index) => (
                <Card key={index} className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 transform hover:scale-105">
                  <CardHeader>
                    <CardTitle className="text-white text-xl">{product.name}</CardTitle>
                    <CardDescription className="text-gray-300">{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-cyan-400 font-semibold mb-2">Applications:</h4>
                        <ul className="space-y-1">
                          {product.applications.map((app, appIndex) => (
                            <li key={appIndex} className="text-gray-300 text-sm flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                              {app}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-4 border-t border-gray-600">
                        <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                          {product.pricing}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Wholesale Benefits Section */}
        <section className="py-20 bg-gradient-to-b from-slate-800/50 to-slate-900">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  HVAC Contractor Benefits Program
                </h2>
                <p className="text-xl text-gray-300">
                  Exclusive contractor advantages designed for commercial HVAC professionals
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-green-500/20">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <DollarSign className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Volume Discounts</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Save up to 25% with our tiered wholesale pricing. The more you buy, the more you save on bulk freon orders.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-blue-500/20">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Truck className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Fast Delivery</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Same-day shipping on in-stock freon. Emergency delivery available for urgent contractor needs.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-purple-500/20">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">EPA Certified</h3>
                    <p className="text-gray-300 leading-relaxed">
                      All freon products are EPA certified with guaranteed purity levels exceeding industry standards.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Contractor Program Section */}
        <section className="py-20 bg-gradient-to-b from-slate-800/50 to-slate-900">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Join Our Contractor Wholesale Program
                </h2>
                <p className="text-xl text-gray-300">
                  Exclusive benefits for qualified HVAC contractors and commercial refrigeration professionals
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-cyan-500/20">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">Tiered Volume Pricing</h3>
                          <p className="text-gray-300">Progressive discounts from 5% to 25% based on annual volume commitments</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-green-500/20">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">Flexible Packaging Options</h3>
                          <p className="text-gray-300">Cylinders, pallets, or container loads - customized to your project needs</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-purple-500/20">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Award className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">Technical Support</h3>
                          <p className="text-gray-300">Dedicated technical team for refrigerant selection and compliance guidance</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-400/30">
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold text-white mb-6 text-center">Contractor Pricing Tiers</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-white/10">
                          <span className="text-gray-300">Starter (1-10 pallets/year)</span>
                          <Badge className="bg-green-500/20 text-green-300">5% off</Badge>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/10">
                          <span className="text-gray-300">Professional (11-25 pallets/year)</span>
                          <Badge className="bg-blue-500/20 text-blue-300">12% off</Badge>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/10">
                          <span className="text-gray-300">Elite (26-50 pallets/year)</span>
                          <Badge className="bg-purple-500/20 text-purple-300">18% off</Badge>
                        </div>
                        <div className="flex justify-between items-center py-3">
                          <span className="text-gray-300">Master (50+ pallets/year)</span>
                          <Badge className="bg-yellow-500/20 text-yellow-300">25% off</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="text-center">
                    <Link to="/bulk-pricing">
                      <Button 
                        size="lg" 
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 px-8 py-4 text-lg font-semibold"
                      >
                        <Quote className="mr-3 h-6 w-6" />
                        Apply for Contractor Program
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-white mb-8">
                Ready for Commercial Freon Wholesale Pricing?
              </h2>
              <p className="text-xl text-gray-300 mb-12">
                Get contractor-specific quotes on bulk freon orders with dedicated account management and technical support
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-cyan-500/20">
                  <CardContent className="p-8">
                    <Phone className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Call Wholesale Direct</h3>
                    <ContactDisplay 
                      className="text-cyan-400 text-lg font-semibold"
                    />
                    <p className="text-gray-300 text-sm mt-2">Mon-Fri 8AM-6PM CT</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-green-500/20">
                  <CardContent className="p-8">
                    <Mail className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Email Wholesale Team</h3>
                    <EmailObfuscator 
                      email="wholesale@alperrefrigas.com"
                      className="text-green-400 text-lg font-semibold hover:text-green-300"
                    />
                    <p className="text-gray-300 text-sm mt-2">24-hour response guaranteed</p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/bulk-pricing">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 px-8 py-4 text-lg font-semibold"
                  >
                    <Quote className="mr-3 h-6 w-6" />
                    Request Wholesale Quote
                  </Button>
                </Link>
                <Link to="/products">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold"
                  >
                    <Package className="mr-3 h-6 w-6" />
                    View All Products
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default FreonWholesalePage;