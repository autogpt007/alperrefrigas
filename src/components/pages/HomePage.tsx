import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Users, Award, Shield, CheckCircle, Star, TrendingUp, Package, Truck, Phone, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Helmet } from 'react-helmet-async';

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  thumbnail_url?: string;
  category?: string;
  epa_approved?: boolean;
  stock_quantity?: number;
  sku?: string;
}

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(6);

      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    
    return products.filter(product =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search performed for:', searchTerm);
    console.log('Filtered results:', filteredProducts);
  };

  return (
    <>
      <Helmet>
        <title>Wholesale Refrigerant Supplier | EPA-Certified | Alper Refrigerants</title>
        <meta name="description" content="Wholesale refrigerant distributor offering bulk R-410A, R-134a, R-1234yf at competitive prices. EPA-certified supplier serving HVAC contractors across North America since 2010." />
        <meta name="keywords" content="wholesale refrigerant gas, bulk R-410A, HVAC refrigerant supplier, refrigerant distributor, R-134a for sale, EPA certified refrigerant" />
      </Helmet>
      
      <div className="min-h-screen w-full">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white py-20 w-full">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  Wholesale Refrigerant Supplier for 
                  <span className="text-cyan-300"> HVAC Professionals</span>
                </h1>
                <p className="text-xl mb-8 text-blue-100 leading-relaxed">
                  Certified bulk refrigerant distributor offering R-410A, R-134a, and R-1234yf at competitive prices. 
                  EPA-compliant products with fast shipping across North America since 2010.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Link to="/products">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                      Browse Wholesale Products <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                      Get Bulk Pricing Quote
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1581094288338-2314dddb7ece?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                    alt="Refrigerant Cylinders" 
                    className="rounded-xl shadow-lg w-full"
                  />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-6 -left-6 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <span className="font-semibold">EPA Certified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Results Section (conditionally shown) */}
        {searchTerm && (
          <section className="py-12 bg-gray-50 w-full">
            <div className="container mx-auto px-4 max-w-6xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Search Results for "{searchTerm}" ({filteredProducts.length} found)
              </h2>
              
              {filteredProducts.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                          {product.thumbnail_url ? (
                            <img
                              src={product.thumbnail_url}
                              alt={product.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
                              <Package className="h-16 w-16 text-blue-300" />
                            </div>
                          )}
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-2xl font-bold text-blue-600">
                            ${product.price}
                          </span>
                          {product.epa_approved && (
                            <Badge className="bg-green-100 text-green-800">EPA Approved</Badge>
                          )}
                        </div>
                        
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Quote
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600">Try adjusting your search terms or browse our categories.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Trust Indicators */}
        <section className="py-16 bg-white w-full">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted HVAC Refrigerant Distributor Since 2010</h2>
              <p className="text-gray-600 text-lg">EPA-certified supplier serving contractors and technicians across North America</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">EPA</h3>
                <p className="text-gray-600">Certified Distributor</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">5,000+</h3>
                <p className="text-gray-600">Satisfied Customers</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">13+</h3>
                <p className="text-gray-600">Years Experience</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10 text-yellow-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">99.8%</h3>
                <p className="text-gray-600">Purity Rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Wholesale Refrigerant Products</h2>
              <p className="text-gray-600 text-lg">Certified pure refrigerants including R-410A, R-134a, and R-1234yf at bulk pricing</p>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="text-gray-600">Loading products...</div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.slice(0, 6).map((product) => (
                  <Card key={product.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                        {product.thumbnail_url ? (
                          <img
                            src={product.thumbnail_url}
                            alt={product.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
                            <Package className="h-16 w-16 text-blue-300" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-blue-600">
                          ${product.price}
                        </span>
                        {product.epa_approved && (
                          <Badge className="bg-green-100 text-green-800">EPA Approved</Badge>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Button className="w-full">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Quote
                        </Button>
                        <Link to={`/products/${product.id}`} className="block">
                          <Button variant="outline" className="w-full">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            <div className="text-center mt-12">
              <Link to="/products">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  View All Products <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-white w-full">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why HVAC Contractors Choose Alper Refrigerants</h2>
              <p className="text-gray-600 text-lg">Certified purity standards, competitive bulk pricing, and reliable shipping across North America</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">Certified Purity Standards</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    EPA-compliant refrigerants with 99.8% purity rating. Every batch is laboratory tested 
                    to meet AHRI standards for optimal HVAC system performance.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Fast Nationwide Shipping</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Expedited processing with most bulk orders shipping within 24 hours. Temperature-controlled 
                    transport ensures product integrity across all 50 states and Canada.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">Technical Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    EPA Section 608 certified technicians provide expert guidance on refrigerant selection, 
                    handling procedures, and regulatory compliance for your specific applications.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-600 text-white w-full">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4">Get Your Wholesale Refrigerant Quote Today</h2>
            <p className="text-xl mb-8 text-blue-100">
              Join over 5,000 HVAC contractors who rely on our certified refrigerants and competitive bulk pricing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <Phone className="h-5 w-5 mr-2" />
                Call: 1-800-REFRIGERANT
              </Button>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Mail className="h-5 w-5 mr-2" />
                  Get Bulk Pricing Quote
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
