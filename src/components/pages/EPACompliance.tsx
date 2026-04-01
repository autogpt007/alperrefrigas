
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Shield, AlertTriangle, FileText, CheckCircle, Award, BookOpen } from 'lucide-react';
import SEOComponent from '../seo/SEOComponent';

const EPACompliance = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <SEOComponent
        title="EPA Compliance & Certification | Alper"
        description="Learn about EPA 608 certification requirements, Clean Air Act compliance, and proper refrigerant handling procedures. Stay compliant with federal regulations."
        keywords="EPA 608, Clean Air Act, refrigerant certification, HVAC certification, ozone depletion, GWP regulations"
        canonicalUrl="/compliance"
        breadcrumbs={[{ name: "Home", url: "/" }, { name: "EPA Compliance", url: "/compliance" }]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Shield className="h-16 w-16 mx-auto mb-6 text-blue-400" />
          <h1 className="text-4xl font-bold mb-4">EPA Compliance & Certification</h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Stay compliant with federal regulations and protect the environment through proper 
            refrigerant handling and certification requirements.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Key Requirements */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Key Compliance Requirements</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-blue-600">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-6 w-6 text-blue-600 mr-2" />
                  EPA 608 Certification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Required for anyone who maintains, services, repairs, or disposes of appliances 
                  containing ozone-depleting refrigerants.
                </p>
                <Badge variant="secondary">Mandatory for Purchase</Badge>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-600">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                  Clean Air Act
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Federal law that regulates air emissions, including the production, import, 
                  and use of ozone-depleting substances.
                </p>
                <Badge variant="secondary">Federal Law</Badge>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-600">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-6 w-6 text-orange-600 mr-2" />
                  Proper Handling
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Strict protocols for storage, transport, and disposal of refrigerants 
                  to prevent environmental harm.
                </p>
                <Badge variant="secondary">Best Practices</Badge>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* EPA 608 Certification Details */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">EPA 608 Certification Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Certification Types</h3>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-green-700">Type I - Small Appliances</h4>
                      <p className="text-sm text-gray-600">Appliances containing 5 lbs or less of refrigerant</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-blue-700">Type II - High-Pressure Appliances</h4>
                      <p className="text-sm text-gray-600">Commercial refrigeration, A/C systems</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-purple-700">Type III - Low-Pressure Appliances</h4>
                      <p className="text-sm text-gray-600">Centrifugal chillers, some industrial equipment</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-orange-700">Universal Certification</h4>
                      <p className="text-sm text-gray-600">All types - most comprehensive certification</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Certification Process</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Study EPA Materials</p>
                        <p className="text-sm text-gray-600">Review official EPA study guides and regulations</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Take Proctored Exam</p>
                        <p className="text-sm text-gray-600">Pass written examination at authorized testing center</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Receive Certificate</p>
                        <p className="text-sm text-gray-600">Lifetime certification (no renewal required)</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Purchase Refrigerants</p>
                        <p className="text-sm text-gray-600">Use certificate to buy regulated refrigerants</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Refrigerant Classifications */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Refrigerant Environmental Classifications</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ozone Depletion Potential (ODP)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="font-medium">CFCs (R-12, R-11)</span>
                    <Badge variant="destructive">High ODP</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="font-medium">HCFCs (R-22, R-123)</span>
                    <Badge className="bg-yellow-600">Medium ODP</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">HFCs (R-410A, R-134a)</span>
                    <Badge className="bg-green-600">Zero ODP</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Global Warming Potential (GWP)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Natural (R-290, R-600a)</span>
                    <Badge className="bg-green-600">Low GWP (&lt;4)</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">HFOs (R-1234yf)</span>
                    <Badge className="bg-blue-600">Low GWP (&lt;4)</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="font-medium">HFCs (R-410A)</span>
                    <Badge className="bg-orange-600">High GWP (2000+)</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Compliance Timeline */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Key Regulatory Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-20 text-center mr-6">
                    <div className="bg-blue-600 text-white rounded-full px-3 py-1 text-sm font-bold">1990</div>
                  </div>
                  <div>
                    <h4 className="font-semibold">Clean Air Act Amendments</h4>
                    <p className="text-gray-600">Established regulations for ozone-depleting substances</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-20 text-center mr-6">
                    <div className="bg-green-600 text-white rounded-full px-3 py-1 text-sm font-bold">2020</div>
                  </div>
                  <div>
                    <h4 className="font-semibold">HFC Phase-Down Begins</h4>
                    <p className="text-gray-600">American Innovation and Manufacturing (AIM) Act implementation</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-20 text-center mr-6">
                    <div className="bg-purple-600 text-white rounded-full px-3 py-1 text-sm font-bold">2036</div>
                  </div>
                  <div>
                    <h4 className="font-semibold">85% HFC Reduction Target</h4>
                    <p className="text-gray-600">Final phase-down target compared to 2011-2013 baseline</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Best Practices */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Compliance Best Practices</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
                  Documentation Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                  <span>Maintain EPA certification records</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                  <span>Keep purchase receipts and invoices</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                  <span>Document refrigerant recovery and recycling</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                  <span>Log refrigerant usage and inventory</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-6 w-6 text-green-600 mr-2" />
                  Safety & Handling
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                  <span>Use proper recovery equipment</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                  <span>Follow storage temperature requirements</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                  <span>Prevent refrigerant leaks and venting</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                  <span>Dispose of cylinders properly</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Resources */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <FileText className="h-6 w-6 text-blue-600 mr-2" />
                Compliance Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">EPA Resources</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>EPA 608 Study Guide</span>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Clean Air Act Text</span>
                      <Button variant="outline" size="sm">View Online</Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Refrigerant Management</span>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Testing Centers</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Find Test Centers</span>
                      <Button variant="outline" size="sm">Locate</Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Online Testing Options</span>
                      <Button variant="outline" size="sm">Learn More</Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Certification Verification</span>
                      <Button variant="outline" size="sm">Verify</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default EPACompliance;
