import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Shield, CheckCircle, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const SUPABASE_URL = "https://ohfkcxwwvksrjymkgloo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oZmtjeHd3dmtzcmp5bWtnbG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMDk2MjgsImV4cCI6MjA2NTY4NTYyOH0.c-kSgAyWyiqbJ1m-binRf23l7P-cAT7AEP_sxGYHMpY";

interface Certificate {
  id: string;
  name: string;
  type: 'epa' | 'distributor' | 'quality' | 'safety';
  description: string;
  pdf_url: string;
  image_url?: string;
  is_active: boolean;
  order_index: number;
}

const Certifications = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/certificates?is_active=eq.true&order=type.asc,order_index.asc`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCertificates(data || []);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const openPDFSecurely = (pdfUrl: string, certificateName: string) => {
    // Open PDF in new tab with no-download attributes
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'epa': return <Shield className="h-6 w-6 text-blue-600" />;
      case 'distributor': return <Award className="h-6 w-6 text-purple-600" />;
      case 'quality': return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'safety': return <Shield className="h-6 w-6 text-yellow-600" />;
      default: return <Award className="h-6 w-6 text-gray-600" />;
    }
  };

  const getTypeTitle = (type: string) => {
    switch (type) {
      case 'epa': return 'EPA Certifications';
      case 'distributor': return 'Authorized Distributor Agreements';
      case 'quality': return 'Quality Assurance Certifications';
      case 'safety': return 'Safety & Training Certifications';
      default: return 'Certifications';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'epa': return 'blue';
      case 'distributor': return 'purple';
      case 'quality': return 'green';
      case 'safety': return 'yellow';
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Certifications & Accreditations</h1>
          <p className="text-gray-600">Our commitment to quality, safety, and regulatory compliance</p>
        </div>

        {/* Dynamic Certificate Sections */}
        {['epa', 'distributor', 'quality', 'safety'].map(type => {
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

        {/* Fallback Static Content if no certificates */}
        {certificates.length === 0 && (
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

        <div className="bg-green-50 p-6 rounded-lg border border-green-200 mt-8">
          <h3 className="font-semibold text-green-900 mb-2">Verification & Audit Information</h3>
          <p className="text-green-800 mb-4">
            All certifications are subject to regular audits and renewals. We maintain current documentation and welcome verification requests.
          </p>
          <p className="text-green-800">
            For certification verification or audit requests:
            <br />
            Email: certifications@frigidflow.com
            <br />
            Phone: 1-800-734-7443 ext. 3
          </p>
        </div>
      </div>
    </div>
  );
};

export default Certifications;
