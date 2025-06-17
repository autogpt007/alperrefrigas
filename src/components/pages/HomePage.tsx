
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Truck, Shield, Award } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="container mx-auto px-6 py-24 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Reliable Bulk Refrigerant Distribution
          </h1>
          <p className="text-lg md:text-xl text-blue-200 max-w-3xl mx-auto mb-8">
            Your trusted source for Freon™ and other leading refrigerant brands, 
            delivered by the pallet or container across the USA and Canada.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/products">
              <Button size="lg" className="bg-white text-blue-700 font-bold hover:bg-gray-100">
                View Our Products
              </Button>
            </Link>
            <Link to="/rfq">
              <Button size="lg" className="bg-blue-600 text-white font-bold hover:bg-blue-700">
                Request a Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trusted Brands Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
            Trusted by professionals, stocking leading brands
          </h3>
          <div className="flex justify-center items-center space-x-8 md:space-x-12">
            <div className="text-2xl font-bold text-blue-600">Chemours</div>
            <div className="text-3xl font-bold text-gray-600">Freon™</div>
            <div className="text-2xl font-bold text-orange-600">Honeywell</div>
            <div className="text-2xl font-bold text-green-600">Arkema</div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Core Products</h2>
            <p className="text-gray-600 mt-2">
              We supply the most in-demand refrigerants for commercial and industrial use.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Product Card 1 */}
            <Card className="group transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-0">
                <div className="h-56 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <div className="text-4xl font-bold text-blue-600">R-410A</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Refrigerant R-410A</h3>
                  <p className="text-gray-600 mb-4">
                    A high-efficiency, non-ozone-depleting HFC refrigerant for modern air-conditioning systems.
                  </p>
                  <Link to="/products/r410a">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      View Details & Quote
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Product Card 2 */}
            <Card className="group transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-0">
                <div className="h-56 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <div className="text-4xl font-bold text-green-600">R-134a</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Refrigerant R-134a</h3>
                  <p className="text-gray-600 mb-4">
                    A widely used HFC for automotive air-conditioning and medium-temperature refrigeration.
                  </p>
                  <Link to="/products/r134a">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      View Details & Quote
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Product Card 3 */}
            <Card className="group transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-0">
                <div className="h-56 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                  <div className="text-4xl font-bold text-purple-600">R-404A</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Refrigerant R-404A</h3>
                  <p className="text-gray-600 mb-4">
                    An HFC blend for low and medium-temperature commercial refrigeration applications.
                  </p>
                  <Link to="/products/r404a">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      View Details & Quote
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Your Partner in Bulk Refrigerant Supply
              </h2>
              <p className="text-gray-600 mb-6">
                North American Refrigerants was founded to solve one major problem: providing a reliable, 
                straightforward supply chain for HVAC and refrigeration professionals who buy in bulk.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span>
                    <span className="font-semibold">USA & Canada Distribution:</span> We have a logistics 
                    network covering the entire continent.
                  </span>
                </li>
                <li className="flex items-start">
                  <Truck className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span>
                    <span className="font-semibold">Bulk Quantities Only:</span> Specializing in pallets 
                    and containers for maximum value.
                  </span>
                </li>
                <li className="flex items-start">
                  <Shield className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span>
                    <span className="font-semibold">Unwavering Quality:</span> Sourcing authentic, 
                    lab-tested refrigerant gases.
                  </span>
                </li>
              </ul>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <div className="h-96 bg-gradient-to-br from-blue-900 to-slate-800 rounded-lg flex items-center justify-center text-white">
                <div className="text-center">
                  <Award className="w-16 h-16 mx-auto mb-4" />
                  <div className="text-2xl font-bold">Our Warehouse</div>
                  <div className="text-blue-200">Professional Distribution</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact / Quote Form Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Request a Quote</h2>
            <p className="text-gray-600 mt-2">
              Fill out the form below and our sales team will contact you within one business day.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Company Name"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <textarea
                    placeholder="Please list the products and quantities you are interested in (e.g., 2 pallets of R-410A, 1 container of R-134a)"
                    rows={6}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                    Submit Request
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
