import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Truck, Shield, Award, ArrowRight, Star, Users, Package } from 'lucide-react';
import { useProducts } from '../../contexts/ProductsContext';

const HomePage = () => {
  const { products } = useProducts();
  const [contactForm, setContactForm] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    message: ''
  });

  // Get featured products (first 3 in-stock products)
  const featuredProducts = products
    .filter(product => product.availability === 'in_stock')
    .slice(0, 3);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    // Handle form submission
    setContactForm({
      fullName: '',
      companyName: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/10"></div>
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Reliable Bulk Refrigerant Distribution
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-200 max-w-4xl mx-auto mb-8 sm:mb-12 leading-relaxed">
            Your trusted source for premium refrigerants and cooling solutions, 
            delivered by the pallet or container across the USA and Canada.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Link to="/products">
              <Button size="lg" className="w-full sm:w-auto bg-white text-blue-700 font-bold hover:bg-gray-100 px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                View Our Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/rfq">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                Request a Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">500+</h3>
              <p className="text-gray-600">Satisfied Customers</p>
            </div>
            <div className="group">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Package className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">10K+</h3>
              <p className="text-gray-600">Pallets Delivered</p>
            </div>
            <div className="group">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">98%</h3>
              <p className="text-gray-600">Customer Satisfaction</p>
            </div>
            <div className="group">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                <Truck className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">24h</h3>
              <p className="text-gray-600">Average Response</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Brands Section */}
      <section className="bg-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
            Trusted by professionals, stocking leading brands
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">Chemours</div>
            <div className="text-3xl sm:text-4xl font-bold text-gray-600">Freon™</div>
            <div className="text-2xl sm:text-3xl font-bold text-orange-600">Honeywell</div>
            <div className="text-2xl sm:text-3xl font-bold text-green-600">Arkema</div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Core Products</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              We supply the most in-demand refrigerants for commercial and industrial use.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
                <Card key={product.id} className="group transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl border-0 shadow-lg overflow-hidden">
                  <CardContent className="p-0">
                    <div className="h-56 sm:h-64 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center relative overflow-hidden">
                      {product.image && product.image !== '/placeholder.svg' ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-4xl sm:text-5xl font-bold text-blue-600 group-hover:scale-110 transition-transform duration-300">
                          {product.name.split(' ')[1] || product.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                        {product.description}
                      </p>
                      <Link to={`/products/${product.id}`}>
                        <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                          View Details & Quote
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Fallback display when no products are available
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 text-lg mb-4">Our product catalog is being updated.</p>
                <Link to="/products">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Browse All Products
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Your Partner in Bulk Refrigerant Supply
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Alper Refrigerants was founded to solve one major problem: providing a reliable, 
                straightforward supply chain for HVAC and refrigeration professionals who buy in bulk.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0 mt-1" />
                  <span className="text-lg">
                    <span className="font-semibold">USA & Canada Distribution:</span> We have a logistics 
                    network covering the entire continent.
                  </span>
                </li>
                <li className="flex items-start">
                  <Truck className="w-6 h-6 text-green-500 mr-4 flex-shrink-0 mt-1" />
                  <span className="text-lg">
                    <span className="font-semibold">Bulk Quantities Only:</span> Specializing in pallets 
                    and containers for maximum value.
                  </span>
                </li>
                <li className="flex items-start">
                  <Shield className="w-6 h-6 text-green-500 mr-4 flex-shrink-0 mt-1" />
                  <span className="text-lg">
                    <span className="font-semibold">Unwavering Quality:</span> Sourcing authentic, 
                    lab-tested refrigerant gases.
                  </span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-900 to-slate-800 rounded-2xl h-96 sm:h-[500px] flex items-center justify-center text-white shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="text-center">
                  <Award className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6" />
                  <div className="text-2xl sm:text-3xl font-bold mb-2">Our Warehouse</div>
                  <div className="text-blue-200 text-lg">Professional Distribution</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact / Quote Form Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Request a Quote</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Fill out the form below and our sales team will contact you within one business day.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-2xl border-0 overflow-hidden">
              <CardContent className="p-6 sm:p-8 lg:p-12">
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Full Name"
                        value={contactForm.fullName}
                        onChange={(e) => setContactForm(prev => ({ ...prev, fullName: e.target.value }))}
                        required
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name *
                      </label>
                      <Input
                        id="companyName"
                        type="text"
                        placeholder="Company Name"
                        value={contactForm.companyName}
                        onChange={(e) => setContactForm(prev => ({ ...prev, companyName: e.target.value }))}
                        required
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Email Address"
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Phone Number"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Please list the products and quantities you are interested in (e.g., 2 pallets of R-410A, 1 container of R-134a)"
                      rows={6}
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-8 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Submit Request
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
