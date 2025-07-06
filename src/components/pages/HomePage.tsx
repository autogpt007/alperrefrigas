
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Award, 
  Shield, 
  Truck, 
  Clock, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Snowflake,
  Thermometer,
  Zap,
  Users
} from 'lucide-react';
import { useProducts } from '../../contexts/ProductsContext';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { products } = useProducts();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const featuredProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-blue-500 text-white mb-6 px-4 py-2">
                <Shield className="h-4 w-4 mr-2" />
                EPA Certified Distributor
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                North America's Premier 
                <span className="block text-blue-200">Refrigerant Distributor</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Professional-grade refrigerants for HVAC contractors, with same-day shipping 
                and expert support. EPA certified, quality guaranteed.
              </p>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex gap-3 mb-8">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search refrigerants (e.g., R-410A, R-32, Freon)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 py-4 text-lg bg-white/95 border-0 shadow-lg focus:shadow-xl transition-shadow"
                  />
                </div>
                <Button 
                  type="submit"
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Search
                </Button>
              </form>

              <div className="flex flex-wrap gap-4">
                <Link to="/products">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-3">
                    View All Products
                  </Button>
                </Link>
                <Link to="/rfq">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 px-8 py-3">
                    Request Quote
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">99.8%</div>
                    <div className="text-blue-200 text-sm">Purity Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">5000+</div>
                    <div className="text-blue-200 text-sm">Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">24hr</div>
                    <div className="text-blue-200 text-sm">Fast Shipping</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">13+</div>
                    <div className="text-blue-200 text-sm">Years Experience</div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-white/10 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="h-5 w-5 text-yellow-400" />
                    <span className="font-semibold">Industry Certifications</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-white/20 text-white">EPA</Badge>
                    <Badge variant="secondary" className="bg-white/20 text-white">AHRI</Badge>
                    <Badge variant="secondary" className="bg-white/20 text-white">ISO 9001</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Featured Refrigerants</h2>
            <p className="text-xl text-gray-600">Professional-grade solutions for every application</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <Card key={product.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-4">
                    <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center mb-4">
                      {product.thumbnail_url || product.images?.[0] ? (
                        <img
                          src={product.thumbnail_url || product.images?.[0]}
                          alt={product.name}
                          className="h-32 w-32 object-contain"
                        />
                      ) : (
                        <Snowflake className="h-20 w-20 text-blue-400" />
                      )}
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      {product.epa_approved && (
                        <Badge className="bg-green-100 text-green-800">
                          <Shield className="h-3 w-3 mr-1" />
                          EPA
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold text-blue-600">
                        ${product.price}
                      </div>
                      <Link to={`/products/${product.id}`}>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          View Details
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Fallback featured products
              [
                {
                  name: "R-410A Refrigerant",
                  price: "299.99",
                  description: "High-efficiency refrigerant for residential and commercial AC systems",
                  icon: <Snowflake className="h-20 w-20 text-blue-400" />
                },
                {
                  name: "R-32 Refrigerant", 
                  price: "189.99",
                  description: "Next-generation low-GWP refrigerant for modern HVAC applications",
                  icon: <Thermometer className="h-20 w-20 text-green-400" />
                },
                {
                  name: "R-134a Refrigerant",
                  price: "149.99", 
                  description: "Automotive and commercial refrigeration solution",
                  icon: <Zap className="h-20 w-20 text-purple-400" />
                }
              ].map((product, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-4">
                    <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center mb-4">
                      {product.icon}
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <Badge className="bg-green-100 text-green-800">
                        <Shield className="h-3 w-3 mr-1" />
                        EPA
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold text-blue-600">
                        ${product.price}
                      </div>
                      <Link to="/products">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          View Details
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          
          <div className="text-center">
            <Link to="/products">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
                View All Products
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose Alper Refrigerants?</h2>
            <p className="text-xl text-gray-600">Industry-leading quality and service you can trust</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">EPA Certified</h3>
              <p className="text-gray-600">
                Fully licensed for refrigerant handling and distribution across North America with all required certifications.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Guaranteed</h3>
              <p className="text-gray-600">
                99.8% purity rate with rigorous testing. Every product meets or exceeds industry standards.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fast Shipping</h3>
              <p className="text-gray-600">
                Same-day processing with expedited shipping options. Get your refrigerants when you need them.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Support</h3>
              <p className="text-gray-600">
                Technical specialists available to help you choose the right refrigerant for your specific application.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of HVAC professionals who trust Alper Refrigerants for their refrigerant needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                Shop Now
              </Button>
            </Link>
            <Link to="/rfq">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold">
                Request Quote
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
