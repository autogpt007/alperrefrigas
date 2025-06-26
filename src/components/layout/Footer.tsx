
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Award, Shield } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">FF</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Frigid Flow</h3>
                <p className="text-sm text-gray-400">Refrigerant Distribution</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              North America's trusted distributor of high-quality refrigerants. 
              EPA-certified and serving HVAC professionals since 2010.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-sm text-gray-300">
                <Award className="h-4 w-4 mr-2 text-blue-400" />
                EPA Certified
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <Shield className="h-4 w-4 mr-2 text-green-400" />
                AHRI Member
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/products" className="text-gray-300 hover:text-white transition-colors">Product Catalog</Link></li>
              <li><Link to="/shipping" className="text-gray-300 hover:text-white transition-colors">Shipping Calculator</Link></li>
              <li><Link to="/account" className="text-gray-300 hover:text-white transition-colors">My Account</Link></li>
              <li><Link to="/support" className="text-gray-300 hover:text-white transition-colors">Customer Support</Link></li>
              <li><Link to="/compliance" className="text-gray-300 hover:text-white transition-colors">EPA Compliance</Link></li>
              <li><Link to="/certifications" className="text-gray-300 hover:text-white transition-colors">Certifications</Link></li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Product Categories</h4>
            <ul className="space-y-3">
              <li><Link to="/products/category/hfc" className="text-gray-300 hover:text-white transition-colors">HFC Refrigerants</Link></li>
              <li><Link to="/products/category/hfo" className="text-gray-300 hover:text-white transition-colors">HFO Refrigerants</Link></li>
              <li><Link to="/products/category/natural" className="text-gray-300 hover:text-white transition-colors">Natural Refrigerants</Link></li>
              <li><Link to="/products/category/automotive" className="text-gray-300 hover:text-white transition-colors">Automotive</Link></li>
              <li><Link to="/products/category/commercial" className="text-gray-300 hover:text-white transition-colors">Commercial HVAC</Link></li>
              <li><Link to="/products/category/industrial" className="text-gray-300 hover:text-white transition-colors">Industrial</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Information</h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-white font-medium">1-800-REFRIGERANT</p>
                  <p className="text-sm text-gray-400">(1-800-734-7443)</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-white">sales@frigidflow.com</p>
                  <p className="text-sm text-gray-400">support@frigidflow.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-white">Distribution Centers:</p>
                  <p className="text-sm text-gray-400">Houston, TX • Atlanta, GA</p>
                  <p className="text-sm text-gray-400">Los Angeles, CA • Toronto, ON</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-white">Business Hours:</p>
                  <p className="text-sm text-gray-400">Mon-Fri: 7:00 AM - 6:00 PM</p>
                  <p className="text-sm text-gray-400">Saturday: 8:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              © {currentYear} Frigid Flow Refrigerant Distribution. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-white transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
