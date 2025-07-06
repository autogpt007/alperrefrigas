import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Users, Award, Shield, CheckCircle, Star, TrendingUp, Package, Truck, Phone, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  thumbnail_url?: string;
  category?: string;
  epaApproved?: boolean;
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
    // Search functionality is handled by the useMemo filteredProducts
    console.log('Search performed for:', searchTerm);
    console.log('Filtered results:', filteredProducts);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                North America's Premier 
                <span className="text-cyan-300"> Refrigerant</span> Distributor
              </h1>
              <p className="text-xl mb-8 text-blue-100 leading-relaxed">
                EPA-certified distributor providing high-quality refrigerants, exceptional service, 
                and expert technical support to HVAC professionals across the continent.
              </p>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mb-8">
                <div className="flex gap-3 max-w-md">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type="text"
                      placeholder="Search refrigerants, brands, or SKUs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/70 focus:bg-white/20"
                    />
                  </div>
                  <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600 px-6">
                    Search
                  </Button>
                </div>
              </form>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Browse Products <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Request Quote
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                <img 
                  src="/api/placeholder/500/400" 
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
        <section className="py-12 bg-gray-50">
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
                        {product.epaApproved && (
                          <Badge className="bg-green-100 text-green-800">EPA Approved</Badge>
                        )}
                      </div>
                      
                      <Button className="w-full">
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Thousands of HVAC Professionals</h2>
            <p className="text-gray-600 text-lg">Your reliable partner for quality refrigerants and exceptional service</p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 text-lg">High-quality refrigerants for every application</p>
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
                      {product.epaApproved && (
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Alper Refrigerants?</h2>
            <p className="text-gray-600 text-lg">Experience the difference of working with industry leaders</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Premium Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  All refrigerants meet or exceed industry standards with guaranteed purity and performance. 
                  Rigorous testing ensures consistent quality.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Fast Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Quick processing and reliable shipping nationwide. Most orders ship within 24 hours 
                  with tracking information provided.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Expert Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Technical specialists and dedicated account managers provide personalized support 
                  and help you choose the right products.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of HVAC professionals who trust Alper Refrigerants for their business needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              <Phone className="h-5 w-5 mr-2" />
              Call: 1-800-REFRIGERANT
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Mail className="h-5 w-5 mr-2" />
              Request Quote
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
