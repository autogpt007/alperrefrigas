
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Search, HelpCircle, Truck, Shield, CreditCard, Package } from 'lucide-react';
import SEOComponent from '../seo/SEOComponent';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const faqCategories = [
    {
      icon: Package,
      title: 'Orders & Products',
      color: 'bg-blue-100 text-blue-800',
      questions: [
        {
          question: 'What refrigerants do you carry?',
          answer: 'We carry a comprehensive selection of HFC, HFO, and natural refrigerants including R-410A, R-134a, R-404A, R-407C, R-507A, R-32, R-1234yf, R-290, and R-600a. All products are EPA-approved and sourced from leading manufacturers like Chemours, Honeywell, and Arkema.'
        },
        {
          question: 'What are your minimum order quantities?',
          answer: 'We specialize in bulk quantities. Minimum orders are typically one pallet (20-30 cylinders) or 500+ lbs depending on the refrigerant type. Contact our sales team for specific quantity requirements for your needed products.'
        },
        {
          question: 'Do you provide SDS (Safety Data Sheets)?',
          answer: 'Yes, Safety Data Sheets are available for all products. You can download them directly from each product page or request them from our customer service team. We also maintain a comprehensive SDS library on our website.'
        },
        {
          question: 'What is the shelf life of refrigerants?',
          answer: 'When stored properly in sealed containers at appropriate temperatures, refrigerants have an indefinite shelf life. Containers should be stored upright, away from heat sources, and in a well-ventilated area.'
        }
      ]
    },
    {
      icon: Truck,
      title: 'Shipping & Delivery',
      color: 'bg-green-100 text-green-800',
      questions: [
        {
          question: 'What are your shipping options?',
          answer: 'We offer ground shipping via UPS, FedEx, and specialized freight carriers for bulk orders. All refrigerants ship as hazardous materials with proper documentation. Expedited shipping is available for urgent orders.'
        },
        {
          question: 'How long does shipping take?',
          answer: 'Standard ground shipping takes 3-5 business days. Expedited options include next-day and 2-day delivery. Bulk freight shipments typically take 5-7 business days depending on destination.'
        },
        {
          question: 'Do you ship to Canada?',
          answer: 'Yes, we ship throughout Canada. Additional customs documentation and longer transit times apply. Canadian customers must provide import permits and comply with Environment Canada regulations.'
        },
        {
          question: 'What are your hazmat shipping requirements?',
          answer: 'All refrigerants ship as Class 2.2 non-flammable gases. Packages must be properly labeled, documented, and handled by certified personnel. Signature confirmation is required upon delivery.'
        }
      ]
    },
    {
      icon: Shield,
      title: 'EPA Compliance',
      color: 'bg-purple-100 text-purple-800',
      questions: [
        {
          question: 'Do I need EPA certification to purchase refrigerants?',
          answer: 'Yes, valid EPA 608 certification is required to purchase regulated refrigerants. You must provide certification details during account setup. We verify all certifications before processing orders.'
        },
        {
          question: 'What EPA 608 certification level do I need?',
          answer: 'The required certification level depends on your application: Type I for small appliances, Type II for high-pressure systems, Type III for low-pressure systems, or Universal for all types. Most professionals choose Universal certification.'
        },
        {
          question: 'How do I verify my EPA certification?',
          answer: 'Upload a clear photo or scan of your EPA 608 certificate during account registration, or email it to compliance@alperrefrigerants.com. Certification verification is typically completed within 24 hours.'
        },
        {
          question: 'What records do I need to keep?',
          answer: 'Maintain records of refrigerant purchases, usage, recovery, and disposal. Keep EPA certificates, purchase receipts, and service logs for at least 3 years. Documentation helps ensure compliance during inspections.'
        }
      ]
    },
    {
      icon: CreditCard,
      title: 'Pricing & Payment',
      color: 'bg-orange-100 text-orange-800',
      questions: [
        {
          question: 'How is refrigerant pricing determined?',
          answer: 'Pricing is based on current market conditions, quantity ordered, and refrigerant type. We offer volume discounts for large orders and contract pricing for regular customers. Request a quote for current pricing.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept major credit cards, ACH bank transfers, wire transfers, and net-30 terms for qualified businesses. Payment is required before shipment unless credit terms have been established.'
        },
        {
          question: 'Do you offer volume discounts?',
          answer: 'Yes, we offer tiered pricing based on quantity. Larger orders receive better per-unit pricing. Contact our sales team to discuss volume pricing for your specific needs.'
        },
        {
          question: 'Can I get a quote before ordering?',
          answer: 'Absolutely! Use our RFQ system to request quotes for specific products and quantities. Our sales team will provide detailed pricing within 24 hours during business days.'
        }
      ]
    }
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  // Create FAQ structured data for better SEO
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqCategories.flatMap(category =>
      category.questions.map(qa => ({
        "@type": "Question",
        "name": qa.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": qa.answer
        }
      }))
    )
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <SEOComponent
        title="Refrigerant FAQ | HVAC Questions | Alper"
        description="Find answers to common refrigerant questions about EPA certification, HFC/HFO refrigerants, bulk pricing, shipping, and compliance. Expert guidance for HVAC contractors and technicians."
        keywords="refrigerant FAQ, EPA 608 certification, HFC refrigerants, HFO refrigerants, HVAC contractor questions, refrigerant compliance, bulk refrigerant pricing, hazmat shipping"
        canonicalUrl="/faq"
        structuredData={faqStructuredData}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <HelpCircle className="h-16 w-16 mx-auto mb-6 text-blue-400" />
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto mb-8">
            Find answers to common questions about our refrigerants, EPA compliance, 
            shipping, and ordering process.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
            <Input
              type="text"
              placeholder="Search FAQ topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg bg-white border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <p className="text-gray-600">Common Questions</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600 mb-2">24h</div>
              <p className="text-gray-600">Response Time</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">EPA</div>
              <p className="text-gray-600">Compliant</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">100%</div>
              <p className="text-gray-600">Satisfaction</p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredFAQs.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  {category.title}
                  <Badge variant="secondary">{category.questions.length}</Badge>
                </CardTitle>
                <CardDescription>
                  Common questions about {category.title.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem 
                      key={faqIndex} 
                      value={`${categoryIndex}-${faqIndex}`}
                      className="border rounded-lg px-4"
                    >
                      <AccordionTrigger className="text-left hover:no-underline">
                        <span className="font-medium">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredFAQs.length === 0 && searchTerm && (
          <Card className="text-center py-12">
            <CardContent>
              <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any questions matching "{searchTerm}". Try different keywords or browse our categories above.
              </p>
              <div className="space-x-4">
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                  Clear Search
                </button>
                <a
                  href="/support"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg inline-block"
                >
                  Contact Support
                </a>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact Support Section */}
        <Card className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our expert team is ready to help with any questions about refrigerants, 
              EPA compliance, or your specific HVAC needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/support"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center justify-center"
              >
                Contact Support
              </a>
              <a
                href="tel:1-800-734-7443"
                className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center justify-center"
              >
                Call 1-800-REFRIGERANT
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQ;
