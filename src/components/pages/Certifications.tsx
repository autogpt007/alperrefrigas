import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Shield, CheckCircle, Download, FileText, Package, ExternalLink, AlertTriangle, Building2, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useProducts } from '@/contexts/ProductsContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import SEOComponent from '@/components/seo/SEOComponent';

interface Certificate {
  id: string;
  name: string;
  type: string;
  description: string;
  pdf_url: string;
  image_url?: string;
  is_active: boolean;
  order_index: number;
}

interface ProductCertificate {
  name: string;
  type: string;
  description: string;
  pdf_url: string;
  productName: string;
  productSku: string;
}

const Certifications = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [productCertificates, setProductCertificates] = useState<ProductCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const { products } = useProducts();

  useEffect(() => {
    fetchCertificates();
    extractProductCertificates();
  }, [products]);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('is_active', true)
        .order('type', { ascending: true })
        .order('order_index', { ascending: true });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const extractProductCertificates = () => {
    const productCerts: ProductCertificate[] = [];
    
    products.forEach(product => {
      const certificateUrls = (product as any).certificate_urls;
      if (certificateUrls && Array.isArray(certificateUrls) && certificateUrls.length > 0) {
        certificateUrls.forEach((cert: any) => {
          productCerts.push({
            ...cert,
            productName: product.name,
            productSku: product.sku || 'N/A'
          });
        });
      }
    });
    
    setProductCertificates(productCerts);
  };

  const openPDFSecurely = (pdfUrl: string, certificateName: string) => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>${certificateName} - Certificate</title>
            <style>
              body { margin: 0; padding: 0; }
              iframe { width: 100%; height: 100vh; border: none; }
            </style>
          </head>
          <body>
            <iframe src="${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0" type="application/pdf"></iframe>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  const getCertificatesByType = (type: string) => {
    return certificates.filter(cert => cert.type === type);
  };

  const getProductCertificatesByType = (type: string) => {
    return productCertificates.filter(cert => cert.type === type);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'epa': return <Shield className="h-6 w-6 text-blue-600" />;
      case 'distributor': return <Award className="h-6 w-6 text-purple-600" />;
      case 'quality': case 'iso': return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'safety': return <Shield className="h-6 w-6 text-yellow-600" />;
      case 'product': return <Package className="h-6 w-6 text-cyan-600" />;
      default: return <Award className="h-6 w-6 text-gray-600" />;
    }
  };

  const getTypeTitle = (type: string) => {
    switch (type) {
      case 'epa': return 'EPA Certifications';
      case 'distributor': return 'Authorized Distributor Agreements';
      case 'quality': return 'Quality Assurance Certifications';
      case 'safety': return 'Safety & Training Certifications';
      case 'iso': return 'ISO Certifications';
      case 'product': return 'Product Specific Certificates';
      default: return 'Certifications';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'epa': return 'blue';
      case 'distributor': return 'purple';
      case 'quality': case 'iso': return 'green';
      case 'safety': return 'yellow';
      case 'product': return 'cyan';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading certificates...</div>
      </div>
    );
  }

  return (
    <>
    <SEOComponent
      title="EPA Certifications & Compliance | Alper"
      description="View our EPA Section 608 certifications, ISO accreditations, and authorized distributor agreements. Independently verifiable compliance documentation for HVAC professionals."
      keywords="EPA certification, refrigerant compliance, ISO certified, AHRI membership, authorized distributor, HVAC certification, Section 608"
      canonicalUrl="/certifications"
      breadcrumbs={[{ name: "Home", url: "/" }, { name: "Certifications", url: "/certifications" }]}
    />
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Business Identity Banner */}
        <div className="bg-blue-900 text-white p-6 rounded-lg mb-8">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="flex items-start gap-4">
              <Building2 className="h-8 w-8 text-blue-300 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold mb-2">Alper Chemical Group</h2>
                <div className="flex items-start gap-2 text-blue-200 mb-1">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-1" />
                  <span>382 NE 191st St, Miami, FL 33179, United States</span>
                </div>
                <div className="flex items-center gap-2 text-blue-200 mb-1">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <a href="tel:+17879658975" className="hover:text-white transition-colors">+1-787-965-8975</a>
                </div>
                <div className="flex items-center gap-2 text-blue-200">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <a href="mailto:certifications@alperrefrigerants.com" className="hover:text-white transition-colors">certifications@alperrefrigerants.com</a>
                </div>
              </div>
            </div>
            <div className="bg-amber-500 text-amber-950 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm uppercase tracking-wide mb-1">B2B Professional Supplier</p>
                  <p className="text-sm">
                    Sales restricted to EPA Section 608 certified HVAC professionals and licensed contractors only.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Certifications & Accreditations</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our comprehensive certification portfolio demonstrates our unwavering commitment to quality, safety, and regulatory compliance. 
            Every certificate represents our dedication to meeting the highest industry standards and providing you with trusted, reliable refrigerant solutions.
          </p>
        </div>

        {/* Verification Disclaimer */}
        <Alert className="mb-8 border-amber-300 bg-amber-50">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Certification Verification Notice:</strong> All certifications listed below can be independently verified through official regulatory bodies. 
            Copies of current certificates are available upon request. Contact us at{' '}
            <a href="mailto:certifications@alperrefrigerants.com" className="underline font-semibold">certifications@alperrefrigerants.com</a> for verification documentation.
          </AlertDescription>
        </Alert>

        {/* Official Verification Links */}
        <Card className="mb-8 border-2 border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center">
              <ExternalLink className="h-6 w-6 text-blue-600 mr-2" />
              Official Verification Resources
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Verify our certifications and memberships through these official regulatory and industry organization portals.
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">EPA Section 608</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Verify refrigerant handling certifications through the U.S. Environmental Protection Agency.
                </p>
                <a 
                  href="https://www.epa.gov/section608" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  EPA Section 608 Portal <ExternalLink className="h-3 w-3" />
                </a>
                <p className="text-xs text-gray-500 mt-2">
                  Contact EPA at 1-800-296-1996 for certification verification.
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="h-5 w-5 text-purple-600" />
                  <h4 className="font-semibold text-gray-900">AHRI Membership</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Verify membership status through the Air-Conditioning, Heating & Refrigeration Institute.
                </p>
                <a 
                  href="https://www.ahrinet.org/certification/directory" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 font-medium"
                >
                  AHRI Directory <ExternalLink className="h-3 w-3" />
                </a>
                <p className="text-xs text-gray-500 mt-2">
                  AHRI contact: certification@ahrinet.org
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-gray-900">ISO Certification</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Verify ISO certifications through the International Organization for Standardization database.
                </p>
                <a 
                  href="https://www.iso.org/certification.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-800 font-medium"
                >
                  ISO Certification Portal <ExternalLink className="h-3 w-3" />
                </a>
                <p className="text-xs text-gray-500 mt-2">
                  Certificate copies available upon request.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Certificates Section */}
        {productCertificates.length > 0 && (
          <div className="mb-8">
            <Card className="border-2 border-cyan-200">
              <CardHeader className="bg-cyan-50">
                <CardTitle className="flex items-center">
                  <Package className="h-6 w-6 text-cyan-600 mr-2" />
                  Product Specific Certificates
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Individual certificates and compliance documentation for our refrigerant products, ensuring quality and regulatory adherence.
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {productCertificates.map((cert, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Product: {cert.productName} (SKU: {cert.productSku})
                        </p>
                        {cert.description && (
                          <p className="text-sm text-gray-500 mt-1">{cert.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-cyan-100 text-cyan-800 capitalize">{cert.type}</Badge>
                        <Badge className="bg-green-100 text-green-800">Certified</Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openPDFSecurely(cert.pdf_url, cert.name)}
                          className="flex items-center gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          View Certificate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Company Certificates by Type */}
        {['epa', 'iso', 'distributor', 'quality', 'safety'].map(type => {
          const typeCertificates = getCertificatesByType(type);
          const color = getTypeColor(type);
          
          if (typeCertificates.length === 0) return null;

          return (
            <div key={type} className="mb-8">
              <Card className={`border-2 border-${color}-200`}>
                <CardHeader className={`bg-${color}-50`}>
                  <CardTitle className="flex items-center">
                    {getTypeIcon(type)}
                    <span className="ml-2">{getTypeTitle(type)}</span>
                  </CardTitle>
                  <p className="text-gray-600 mt-2">
                    {type === 'epa' && "Environmental Protection Agency certifications ensuring compliance with federal refrigerant regulations and handling requirements."}
                    {type === 'iso' && "International Organization for Standardization certifications demonstrating our commitment to quality management and environmental responsibility."}
                    {type === 'distributor' && "Official distributor agreements and authorizations from leading refrigerant manufacturers, guaranteeing authentic products."}
                    {type === 'quality' && "Quality assurance certifications validating our rigorous testing procedures and product integrity standards."}
                    {type === 'safety' && "Safety and training certifications ensuring our team maintains the highest standards of workplace safety and professional competence."}
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {typeCertificates.map((cert) => (
                      <div key={cert.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold">{cert.name}</h4>
                          {cert.description && (
                            <p className="text-sm text-gray-600 mt-1">{cert.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openPDFSecurely(cert.pdf_url, cert.name)}
                            className="flex items-center gap-2"
                          >
                            <FileText className="h-4 w-4" />
                            View Certificate
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}

        {/* Fallback Content if no certificates */}
        {certificates.length === 0 && productCertificates.length === 0 && (
          <>
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <Card className="border-2 border-blue-200">
                <CardHeader className="bg-blue-50">
                  <CardTitle className="flex items-center">
                    <Shield className="h-6 w-6 mr-2 text-blue-600" />
                    EPA Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">EPA Section 608 Universal Certification</h4>
                        <p className="text-sm text-gray-600">All refrigerant handling and distribution</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">EPA Refrigerant Distributor License</h4>
                        <p className="text-sm text-gray-600">Authorized wholesale distribution</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200">
                <CardHeader className="bg-purple-50">
                  <CardTitle className="flex items-center">
                    <Award className="h-6 w-6 mr-2 text-purple-600" />
                    Industry Memberships
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">AHRI Membership</h4>
                        <p className="text-sm text-gray-600">Air-Conditioning, Heating & Refrigeration Institute</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Member</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">ARCA Membership</h4>
                        <p className="text-sm text-gray-600">Appliance Recycling Centers of America</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Member</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    Quality Assurance Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Award className="h-8 w-8 text-blue-600" />
                      </div>
                      <h4 className="font-semibold mb-2">ISO 9001:2015</h4>
                      <p className="text-sm text-gray-600">Quality Management System</p>
                      <Badge variant="outline" className="mt-2">Certified</Badge>
                    </div>
                    
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Shield className="h-8 w-8 text-green-600" />
                      </div>
                      <h4 className="font-semibold mb-2">ISO 14001:2015</h4>
                      <p className="text-sm text-gray-600">Environmental Management</p>
                      <Badge variant="outline" className="mt-2">Certified</Badge>
                    </div>
                    
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="h-8 w-8 text-purple-600" />
                      </div>
                      <h4 className="font-semibold mb-2">OHSAS 18001</h4>
                      <p className="text-sm text-gray-600">Occupational Health & Safety</p>
                      <Badge variant="outline" className="mt-2">Certified</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Verification Section with enhanced content */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-lg border border-green-200 mt-12">
          <div className="max-w-4xl mx-auto">
            <h3 className="font-bold text-green-900 mb-4 text-xl">Certificate Verification & Compliance Assurance</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-green-800 mb-4 leading-relaxed">
                  All certifications displayed are subject to regular third-party audits and renewals to ensure continued compliance with evolving industry standards. 
                  We maintain current documentation and welcome verification requests from customers and regulatory bodies.
                </p>
                <p className="text-green-800 font-semibold">
                  For certificate verification or audit requests:
                </p>
                <ul className="text-green-800 mt-2 space-y-1">
                  <li>📧 Email: certifications@alperrefrigerants.com</li>
                  <li>📞 Phone: +1-787-965-8975</li>
                  <li>🕒 Available: Monday-Friday, 8AM-6PM EST</li>
                </ul>
              </div>
              <div className="bg-white/50 p-6 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-3">Why Our Certifications Matter</h4>
                <ul className="text-green-800 space-y-2 text-sm">
                  <li>• Ensures product authenticity and quality</li>
                  <li>• Guarantees regulatory compliance</li>
                  <li>• Provides legal protection for your business</li>
                  <li>• Validates proper handling and storage</li>
                  <li>• Supports insurance and warranty claims</li>
                  <li>• Demonstrates environmental responsibility</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-8 p-6 bg-gray-100 rounded-lg border border-gray-300">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-gray-600" />
            Important Compliance Disclaimer
          </h4>
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              <strong>EPA Certification Claims:</strong> Our EPA Section 608 certifications are issued by EPA-approved certifying organizations 
              and can be verified through the EPA's official channels. Certification numbers and documentation are available upon request 
              for customer verification and regulatory compliance purposes.
            </p>
            <p>
              <strong>ISO Certification Claims:</strong> ISO certifications displayed are issued by accredited third-party certification bodies. 
              Certificate validity and scope can be verified through the issuing certification body or the IAF CertSearch database.
            </p>
            <p>
              <strong>AHRI Membership:</strong> AHRI membership status can be verified directly through the Air-Conditioning, Heating & Refrigeration Institute 
              member directory at <a href="https://www.ahrinet.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">ahrinet.org</a>.
            </p>
            <p>
              <strong>Documentation Availability:</strong> Physical or digital copies of all certificates are maintained on file and will be provided 
              within 2 business days upon written request to <a href="mailto:certifications@alperrefrigerants.com" className="text-blue-600 underline">certifications@alperrefrigerants.com</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Certifications;
