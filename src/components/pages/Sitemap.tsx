
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Package, Phone, User, Shield, FileText, Truck, Award, Settings, BarChart } from 'lucide-react';
import SEOComponent from '../seo/SEOComponent';

const Sitemap = () => {
  const siteStructure = [
    {
      category: 'Main Pages',
      icon: Home,
      links: [
        { name: 'Home', path: '/', description: 'Professional refrigerant distribution homepage' },
        { name: 'Product Catalog', path: '/products', description: 'Complete refrigerant product catalog' },
        { name: 'Request for Quote', path: '/rfq', description: 'Get custom refrigerant pricing quotes' },
        { name: 'Shopping Cart', path: '/cart', description: 'Review and manage your refrigerant orders' },
        { name: 'Checkout', path: '/checkout', description: 'Complete your refrigerant purchase' }
      ]
    },
    {
      category: 'Product Categories',
      icon: Package,
      links: [
        { name: 'HFC Refrigerants', path: '/products?category=hfc', description: 'R-410A, R-134a, R-404A and other HFC refrigerants' },
        { name: 'HFO Refrigerants', path: '/products?category=hfo', description: 'R-1234yf, R-1234ze and next-generation refrigerants' },
        { name: 'Natural Refrigerants', path: '/products?category=natural', description: 'R-290, R-600a, R-744 natural refrigerant solutions' },
        { name: 'Automotive Refrigerants', path: '/products?category=automotive', description: 'Mobile A/C and automotive cooling solutions' },
        { name: 'Commercial HVAC', path: '/products?category=commercial', description: 'Commercial air conditioning and heat pump refrigerants' },
        { name: 'Industrial Applications', path: '/products?category=industrial', description: 'Process cooling and industrial refrigeration' }
      ]
    },
    {
      category: 'Information & Resources',
      icon: FileText,
      links: [
        { name: 'About Us', path: '/about', description: 'Learn about FrigidFlow refrigerant distribution' },
        { name: 'Contact Us', path: '/contact', description: 'Get in touch with our refrigerant experts' },
        { name: 'News & Updates', path: '/news', description: 'Industry news and regulatory updates' },
        { name: 'EPA Compliance', path: '/compliance', description: 'Section 608 certification and regulatory information' },
        { name: 'Technical Support', path: '/support', description: 'Refrigerant handling and technical assistance' }
      ]
    },
    {
      category: 'Account & Services',
      icon: User,
      links: [
        { name: 'Customer Login', path: '/auth', description: 'Access your refrigerant distributor account' },
        { name: 'Account Dashboard', path: '/portal', description: 'Manage orders and certification information' },
        { name: 'Order History', path: '/orders', description: 'Track refrigerant purchases and shipments' },
        { name: 'Certification Management', path: '/certifications', description: 'EPA Section 608 certification tracking' }
      ]
    },
    {
      category: 'Tools & Calculators',
      icon: Settings,
      links: [
        { name: 'Shipping Calculator', path: '/shipping', description: 'Calculate hazmat shipping costs for refrigerants' },
        { name: 'Refrigerant Converter', path: '/converter', description: 'Convert between refrigerant units and measurements' },
        { name: 'Compatibility Checker', path: '/compatibility', description: 'Check refrigerant compatibility and alternatives' },
        { name: 'Pressure-Temperature Chart', path: '/pt-chart', description: 'Refrigerant pressure-temperature reference charts' }
      ]
    },
    {
      category: 'Legal & Compliance',
      icon: Shield,
      links: [
        { name: 'Privacy Policy', path: '/privacy', description: 'Data protection and privacy practices' },
        { name: 'Terms of Service', path: '/terms', description: 'Refrigerant sales terms and EPA compliance' },
        { name: 'Cookie Policy', path: '/cookies', description: 'Website cookie usage and preferences' },
        { name: 'Site Map', path: '/sitemap', description: 'Complete website navigation guide' }
      ]
    }
  ];

  return (
    <>
      <SEOComponent
        title="Site Map | Alper Refrigerants"
        description="Complete navigation guide for FrigidFlow refrigerant distributor website. Find all pages, products, resources, and tools for HVAC professionals."
        keywords="sitemap, website navigation, refrigerant distributor pages, HVAC resources, EPA compliance tools"
        canonicalUrl="/sitemap"
      />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Site Map</h1>
            <p className="text-gray-600 mb-2">Complete overview of all pages and sections on our website</p>
            <p className="text-sm text-gray-500">
              Professional refrigerant distribution resources for HVAC contractors and technicians
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {siteStructure.map((section, index) => (
              <Card key={index} className="h-fit hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center">
                    <section.icon className="h-5 w-5 mr-2 text-blue-600" />
                    {section.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex} className="border-b border-gray-100 pb-2 last:border-b-0">
                        <Link 
                          to={link.path}
                          className="block group"
                        >
                          <div className="text-blue-600 hover:text-blue-800 font-medium transition-colors group-hover:underline">
                            {link.name}
                          </div>
                          {link.description && (
                            <div className="text-sm text-gray-600 mt-1">
                              {link.description}
                            </div>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Resources Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-green-600" />
                Additional Resources & Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-gray-800">Safety & Compliance</h4>
                  <ul className="space-y-2 text-sm">
                    <li><Link to="/sds" className="text-blue-600 hover:underline">Safety Data Sheets (SDS)</Link></li>
                    <li><Link to="/msds" className="text-blue-600 hover:underline">Material Safety Data Sheets</Link></li>
                    <li><Link to="/epa-guidelines" className="text-blue-600 hover:underline">EPA Section 608 Guidelines</Link></li>
                    <li><Link to="/handling-procedures" className="text-blue-600 hover:underline">Safe Handling Procedures</Link></li>
                    <li><Link to="/emergency-procedures" className="text-blue-600 hover:underline">Emergency Response Procedures</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-gray-800">Technical Resources</h4>
                  <ul className="space-y-2 text-sm">
                    <li><Link to="/installation-guides" className="text-blue-600 hover:underline">Installation Guides</Link></li>
                    <li><Link to="/technical-specs" className="text-blue-600 hover:underline">Technical Specifications</Link></li>
                    <li><Link to="/compatibility-charts" className="text-blue-600 hover:underline">Refrigerant Compatibility Charts</Link></li>
                    <li><Link to="/conversion-tables" className="text-blue-600 hover:underline">Unit Conversion Tables</Link></li>
                    <li><Link to="/troubleshooting" className="text-blue-600 hover:underline">Troubleshooting Guides</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-gray-800">Industry Information</h4>
                  <ul className="space-y-2 text-sm">
                    <li><Link to="/industry-news" className="text-blue-600 hover:underline">Industry News & Updates</Link></li>
                    <li><Link to="/regulatory-changes" className="text-blue-600 hover:underline">Regulatory Changes</Link></li>
                    <li><Link to="/case-studies" className="text-blue-600 hover:underline">Application Case Studies</Link></li>
                    <li><Link to="/webinars" className="text-blue-600 hover:underline">Educational Webinars</Link></li>
                    <li><Link to="/distributor-network" className="text-blue-600 hover:underline">Distribution Network</Link></li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Access Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="h-5 w-5 mr-2 text-orange-600" />
                Quick Access & Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-3 text-gray-800">Emergency & Support</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Emergency Hotline:</span>
                      <strong className="text-red-600">1-682-215-2974</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Technical Support:</span>
                      <strong>1-682-215-2974</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>EPA Compliance:</span>
                      <strong>compliance@alperrefrigerants.com</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Hazmat Transportation:</span>
                      <strong>hazmat@alperrefrigerants.com</strong>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-gray-800">Distribution Centers</h4>
                  <ul className="space-y-2 text-sm">
                    <li>Houston, TX - Central Distribution Hub</li>
                    <li>Atlanta, GA - Southeast Distribution</li>
                    <li>Los Angeles, CA - West Coast Distribution</li>
                    <li>Toronto, ON - Canadian Distribution</li>
                    <li>Chicago, IL - Midwest Distribution</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search and Navigation Help */}
          <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <BarChart className="h-5 w-5 mr-2" />
              Can't Find What You're Looking For?
            </h3>
            <p className="text-blue-800 mb-4">
              If you can't find a specific page, product, or need assistance navigating our website, our support team is here to help:
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <strong>General Support:</strong><br />
                Email: support@alperrefrigerants.com<br />
                Phone: 1-682-215-2974
              </div>
              <div>
                <strong>Technical Questions:</strong><br />
                Email: technical@alperrefrigerants.com<br />
                Live Chat: Available 8 AM - 6 PM EST
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sitemap;
