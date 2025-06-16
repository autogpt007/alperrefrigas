
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Truck, Shield, Users, Award, Clock } from 'lucide-react';
import AIRecommendationWidget from '../widgets/AIRecommendationWidget';

const HomePage = () => {
  const featuredProducts = [
    {
      id: 1,
      name: 'R-134a Refrigerant',
      description: 'Automotive & Commercial AC Systems',
      price: '$89.99',
      image: '/api/placeholder/300/200',
      epaApproved: true,
      inStock: true,
    },
    {
      id: 2,
      name: 'R-410A Refrigerant',
      description: 'Residential & Commercial HVAC',
      price: '$124.99',
      image: '/api/placeholder/300/200',
      epaApproved: true,
      inStock: true,
    },
    {
      id: 3,
      name: 'R-454B Refrigerant',
      description: 'Next-Gen Low-GWP Alternative',
      price: '$189.99',
      image: '/api/placeholder/300/200',
      epaApproved: true,
      inStock: false,
    },
  ];

  const certifications = [
    'EPA Section 608 Certified',
    'AHRI Certified',
    'DOT Hazmat Certified',
    'ISO 9001:2015',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                North America's
                <span className="block text-blue-300">Refrigerant</span>
                <span className="block">Specialists</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                EPA-certified distribution of high-quality refrigerants across all 50 states and Canada. 
                Fast shipping, competitive pricing, and expert support for HVAC professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
                    Browse Products
                  </Button>
                </Link>
                <Link to="/shipping">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900 px-8 py-3">
                    Calculate Shipping
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8">
                <AIRecommendationWidget />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Frigid Flow?</h2>
            <p className="text-xl text-gray-600">Professional-grade refrigerants with unmatched service</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>EPA Certified</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Fully licensed and compliant with all federal and state regulations
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Truck className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Fast Shipping</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Next-day delivery available to most locations across North America
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Expert Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Technical assistance from certified HVAC professionals
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Quality Assured</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Premium refrigerants from trusted manufacturers worldwide
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600">Popular refrigerants for every application</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {product.epaApproved && (
                      <Badge className="bg-green-500 text-white">EPA Approved</Badge>
                    )}
                    {product.inStock ? (
                      <Badge className="bg-blue-500 text-white">In Stock</Badge>
                    ) : (
                      <Badge variant="secondary">Out of Stock</Badge>
                    )}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                  <p className="text-gray-600">{product.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">{product.price}</span>
                    <Button disabled={!product.inStock}>
                      {product.inStock ? 'Add to Cart' : 'Notify When Available'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Certifications & Compliance</h2>
            <p className="text-xl text-blue-100">Trusted by professionals nationwide</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="text-center">
                <div className="bg-white bg-opacity-10 rounded-lg p-6">
                  <Award className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                  <h3 className="font-semibold">{cert}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile AI Widget */}
      <section className="lg:hidden py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AIRecommendationWidget />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join thousands of HVAC professionals who trust Frigid Flow</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/account">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3">
                Create Account
              </Button>
            </Link>
            <Link to="/support">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
