
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Quote, Award, Truck, Shield, Phone, Mail, Clock, CheckCircle, Star, Zap, Users, Building2, Globe, ThermometerSun } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section with improved visibility */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 px-6 py-2 text-lg">
                <Shield className="h-5 w-5 mr-2" />
                EPA Certified & Compliant
              </Badge>
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
                Professional Grade<br />Refrigerants
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Your trusted partner for wholesale refrigerant distribution. We provide premium quality refrigerants, expert technical support, and reliable delivery to HVAC professionals across North America.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/products">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <ShoppingCart className="mr-3 h-6 w-6" />
                  Shop Refrigerants
                </Button>
              </Link>
              <Link to="/rfq">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 px-8 py-4 text-lg font-semibold shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Quote className="mr-3 h-6 w-6" />
                  Get Bulk Pricing Quote
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">500+</div>
                <div className="text-gray-300">Products Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">24/7</div>
                <div className="text-gray-300">Customer Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">48hr</div>
                <div className="text-gray-300">Fast Shipping</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">EPA</div>
                <div className="text-gray-300">Certified</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Featured Refrigerants</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover our most popular refrigerants trusted by HVAC professionals worldwide. All products are EPA approved and ready for immediate shipping.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 group">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-cyan-400 group-hover:text-cyan-300 transition-colors">R-410A</CardTitle>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Popular</Badge>
                </div>
                <CardDescription className="text-gray-300">
                  Most widely used refrigerant for residential and commercial air conditioning systems. Environmentally friendly HFC blend.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Starting at:</span>
                    <span className="text-2xl font-bold text-cyan-400">$299.99</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-gray-300 border-gray-500">25lb Cylinder</Badge>
                    <Badge variant="outline" className="text-gray-300 border-gray-500">EPA Approved</Badge>
                  </div>
                  <Link to="/products">
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 group">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-purple-400 group-hover:text-purple-300 transition-colors">R-134A</CardTitle>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Reliable</Badge>
                </div>
                <CardDescription className="text-gray-300">
                  Versatile refrigerant for automotive and medium-temperature applications. Non-toxic and non-flammable HFC.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Starting at:</span>
                    <span className="text-2xl font-bold text-purple-400">$189.99</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-gray-300 border-gray-500">30lb Cylinder</Badge>
                    <Badge variant="outline" className="text-gray-300 border-gray-500">Automotive</Badge>
                  </div>
                  <Link to="/products">
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-green-500/20 hover:border-green-400/50 transition-all duration-300 group">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-green-400 group-hover:text-green-300 transition-colors">R-32</CardTitle>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Eco-Friendly</Badge>
                </div>
                <CardDescription className="text-gray-300">
                  Next-generation refrigerant with lower global warming potential. Perfect for new energy-efficient systems.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Starting at:</span>
                    <span className="text-2xl font-bold text-green-400">$249.99</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-gray-300 border-gray-500">20lb Cylinder</Badge>
                    <Badge variant="outline" className="text-gray-300 border-gray-500">Low GWP</Badge>
                  </div>
                  <Link to="/products">
                    <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose FrigidFlow?</h2>
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
              <p className="text-gray-300 leading-relaxed">
                All our refrigerants meet strict EPA standards and regulations. We maintain comprehensive documentation and certifications for complete regulatory compliance.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 p-8 rounded-xl border border-purple-500/20 hover:border-purple-400/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-6">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Lightning Fast Delivery</h3>
              <p className="text-gray-300 leading-relaxed">
                Same-day processing and 48-hour delivery to most locations. Our nationwide distribution network ensures your projects stay on schedule.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 p-8 rounded-xl border border-green-500/20 hover:border-green-400/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Expert Technical Support</h3>
              <p className="text-gray-300 leading-relaxed">
                Our certified technicians provide 24/7 support for product selection, compatibility, and technical guidance for your specific applications.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 p-8 rounded-xl border border-yellow-500/20 hover:border-yellow-400/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mb-6">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Premium Quality Guarantee</h3>
              <p className="text-gray-300 leading-relaxed">
                Every product undergoes rigorous quality testing. We guarantee purity levels and offer full replacement warranty for any quality issues.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 p-8 rounded-xl border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-6">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Industry Partnerships</h3>
              <p className="text-gray-300 leading-relaxed">
                Authorized distributor for leading manufacturers. Direct relationships ensure authentic products and competitive wholesale pricing.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 p-8 rounded-xl border border-red-500/20 hover:border-red-400/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Environmental Responsibility</h3>
              <p className="text-gray-300 leading-relaxed">
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-600/20 to-purple-600/20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to Optimize Your Refrigerant Supply?
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Join thousands of HVAC professionals who trust FrigidFlow for their refrigerant needs. 
              Experience the difference that quality products and exceptional service can make for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/contact">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-cyan-500/25"
                >
                  <Phone className="mr-3 h-6 w-6" />
                  Contact Sales Team
                </Button>
              </Link>
              <Link to="/rfq">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 px-8 py-4 text-lg font-semibold"
                >
                  <Mail className="mr-3 h-6 w-6" />
                  Request Custom Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
