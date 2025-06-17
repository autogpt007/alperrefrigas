
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Package, Phone, User, Shield, FileText } from 'lucide-react';

const Sitemap = () => {
  const siteStructure = [
    {
      category: 'Main Pages',
      icon: Home,
      links: [
        { name: 'Home', path: '/' },
        { name: 'Product Catalog', path: '/products' },
        { name: 'Request for Quote', path: '/rfq' },
        { name: 'Customer Portal', path: '/portal' },
        { name: 'Shipping Calculator', path: '/shipping' }
      ]
    },
    {
      category: 'Product Categories',
      icon: Package,
      links: [
        { name: 'HFC Refrigerants', path: '/products?category=hfc' },
        { name: 'HFO Refrigerants', path: '/products?category=hfo' },
        { name: 'Natural Refrigerants', path: '/products?category=natural' },
        { name: 'Automotive', path: '/products?category=automotive' },
        { name: 'Commercial HVAC', path: '/products?category=commercial' },
        { name: 'Industrial', path: '/products?category=industrial' }
      ]
    },
    {
      category: 'Support & Information',
      icon: Phone,
      links: [
        { name: 'Customer Support', path: '/support' },
        { name: 'EPA Compliance', path: '/compliance' },
        { name: 'Certifications', path: '/certifications' },
        { name: 'Account Management', path: '/account' }
      ]
    },
    {
      category: 'Account & Admin',
      icon: User,
      links: [
        { name: 'My Account', path: '/account' },
        { name: 'Admin Dashboard', path: '/admin' }
      ]
    },
    {
      category: 'Legal & Policies',
      icon: Shield,
      links: [
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' },
        { name: 'Cookie Policy', path: '/cookies' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Site Map</h1>
          <p className="text-gray-600">Complete overview of all pages and sections on our website</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {siteStructure.map((section, index) => (
            <Card key={index} className="h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center">
                  <section.icon className="h-5 w-5 mr-2 text-blue-600" />
                  {section.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        to={link.path}
                        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-green-600" />
              Additional Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Documentation</h4>
                <ul className="space-y-1 text-sm">
                  <li><Link to="/docs/sds" className="text-blue-600 hover:underline">Safety Data Sheets</Link></li>
                  <li><Link to="/docs/installation" className="text-blue-600 hover:underline">Installation Guides</Link></li>
                  <li><Link to="/docs/handling" className="text-blue-600 hover:underline">Handling Procedures</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Tools & Calculators</h4>
                <ul className="space-y-1 text-sm">
                  <li><Link to="/tools/shipping" className="text-blue-600 hover:underline">Shipping Calculator</Link></li>
                  <li><Link to="/tools/conversion" className="text-blue-600 hover:underline">Unit Converter</Link></li>
                  <li><Link to="/tools/compatibility" className="text-blue-600 hover:underline">Compatibility Checker</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Quick Links</h4>
                <ul className="space-y-1 text-sm">
                  <li><Link to="/contact" className="text-blue-600 hover:underline">Contact Information</Link></li>
                  <li><Link to="/locations" className="text-blue-600 hover:underline">Distribution Centers</Link></li>
                  <li><Link to="/news" className="text-blue-600 hover:underline">News & Updates</Link></li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Can't Find What You're Looking For?</h3>
          <p className="text-blue-800">
            If you can't find a specific page or need assistance navigating our website, please contact our support team:
            <br />
            Email: support@frigidflow.com
            <br />
            Phone: 1-800-734-7443
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
