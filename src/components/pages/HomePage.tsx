
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShieldCheck, 
  Truck, 
  Award, 
  Users,
  ArrowRight,
  CheckCircle,
  Phone,
  Mail
} from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: "EPA Certified",
      description: "All our refrigerants meet EPA standards and regulations"
    },
    {
      icon: Truck,
      title: "Fast Shipping",
      description: "Quick delivery across the United States"
    },
    {
      icon: Award,
      title: "Quality Guaranteed",
      description: "Premium quality refrigerants from trusted manufacturers"
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Technical support from refrigeration experts"
    }
  ];

  const productCategories = [
    { name: "HFC Refrigerants", count: "25+ Products", description: "Hydrofluorocarbon refrigerants for various applications" },
    { name: "HFO Refrigerants", count: "15+ Products", description: "Next-generation low-GWP refrigerants" },
    { name: "Natural Refrigerants", count: "10+ Products", description: "Environmentally friendly options" },
    { name: "Specialty Blends", count: "20+ Products", description: "Custom refrigerant solutions" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-green-500 text-white px-4 py-2 text-sm font-semibold">
                  EPA CERTIFIED SUPPLIER
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Premium 
                  <span className="block text-cyan-300">Refrigerant</span>
                  Solutions
                </h1>
                <p className="text-xl text-blue-100 max-w-lg">
                  Your trusted partner for high-quality refrigerants. EPA-certified products with fast, reliable delivery across the United States.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/rfq">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900 px-8 py-3 text-lg font-semibold">
                    Get Bulk Quote
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-300">500+</div>
                  <div className="text-blue-200">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-300">24/7</div>
                  <div className="text-blue-200">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-300">99%</div>
                  <div className="text-blue-200">Satisfaction</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                    <span className="text-lg">EPA Approved Products</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                    <span className="text-lg">Same-Day Processing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                    <span className="text-lg">Technical Support Included</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                    <span className="text-lg">Competitive Pricing</span>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/20">
                  <h3 className="text-xl font-semibold mb-4">Contact Us Today</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-cyan-300" />
                      <span>1-800-REFRIGERANT</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-cyan-300" />
                      <span>info@frigidflow.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose FrigidFlow?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing the highest quality refrigerants with unmatched service and support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Product Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our comprehensive range of refrigerants designed for various applications and industries.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {productCategories.map((category, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {category.count}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-6">{category.description}</p>
                  <Link to="/products">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                      View Products
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-cyan-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Contact our experts today for personalized refrigerant solutions and competitive bulk pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                  Contact Us
                </Button>
              </Link>
              <Link to="/rfq">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900 px-8 py-3 text-lg font-semibold">
                  Request Quote
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
