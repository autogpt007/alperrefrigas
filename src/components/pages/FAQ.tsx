
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Search, HelpCircle, Truck, Shield, CreditCard, Package, RotateCcw, Snowflake } from 'lucide-react';
import SEOComponent from '../seo/SEOComponent';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const faqCategories = [
    {
      icon: Snowflake,
      title: 'Refrigerant Types',
      color: 'bg-cyan-100 text-cyan-800',
      questions: [
        {
          question: 'What refrigerant types do you carry?',
          answer: 'We stock HFC blends (R-410A, R-134a, R-404A, R-407C, R-507A, R-422B, R-438A), low-GWP HFO and HFO blends (R-454B, R-32, R-1234yf, R-513A, R-452A), and natural refrigerants (R-290 propane, R-600a isobutane, R-744 CO2). All cylinders are factory-sealed and sourced from established manufacturers such as Chemours, Honeywell and Arkema.'
        },
        {
          question: 'What is the difference between HFC, HFO and natural refrigerants?',
          answer: 'HFCs (for example R-410A and R-134a) are non-flammable, widely supported blends that are being phased down under the AIM Act because of their high GWP. HFOs and HFO blends (for example R-454B, R-1234yf and R-513A) have far lower GWP and are the designated replacements in new equipment, though several are mildly flammable (A2L). Natural refrigerants such as R-290, R-600a and CO2 have the lowest GWP and are used in commercial and specialty systems where flammability or high pressure can be engineered for.'
        },
        {
          question: 'Which refrigerant replaces R-410A in new systems?',
          answer: 'R-454B is the primary A2L replacement for R-410A in new residential and light commercial equipment, with R-32 used by some manufacturers. R-410A is still legal to buy and use for servicing existing systems. See our R-454B page for pricing and availability.'
        },
        {
          question: 'Can I substitute one refrigerant for another in an existing system?',
          answer: 'Only with a refrigerant that the equipment manufacturer or an EPA SNAP-approved retrofit procedure lists for that system. Charging an A2L or hydrocarbon refrigerant into equipment not rated for it is unsafe and voids the equipment listing. Contact our technical team with the model number and we will confirm compatible options.'
        },
        {
          question: 'What is the shelf life of refrigerants?',
          answer: 'Stored properly in sealed cylinders at ambient temperature, refrigerants have an indefinite shelf life. Keep cylinders upright, out of direct sunlight, away from heat sources, and in a well-ventilated area.'
        }
      ]
    },
    {
      icon: Package,
      title: 'Orders & Products',
      color: 'bg-blue-100 text-blue-800',
      questions: [
        {
          question: 'What are your minimum order quantities?',
          answer: 'We sell in professional quantities. Refrigerants are priced per cylinder with pallet-level tiers (a full pallet is typically 20-40 cylinders depending on size), and air conditioning units have their own bulk tiers. The price shown on each product page updates as you increase quantity, so you can see the exact tier before checkout.'
        },
        {
          question: 'Do you provide SDS (Safety Data Sheets)?',
          answer: 'Yes. Safety Data Sheets are available for every product and can be requested from each product page or from our support team. Shipping documentation for hazardous materials is included with every order.'
        },
        {
          question: 'Can I get a quote before ordering?',
          answer: 'Yes. Use our RFQ form to request pricing for specific products and quantities, including container-load volumes. Our team responds with formal pricing within one business day.'
        },
        {
          question: 'Who can buy from Alper?',
          answer: 'We sell to HVAC/R contractors, wholesalers, OEMs and other trade buyers only. We do not sell to consumers for household or automotive DIY use.'
        }
      ]
    },
    {
      icon: Shield,
      title: 'EPA Certifications & Compliance',
      color: 'bg-purple-100 text-purple-800',
      questions: [
        {
          question: 'Do I need EPA certification to purchase refrigerants?',
          answer: 'Yes. Under Section 608 of the Clean Air Act, regulated refrigerants may only be sold to certified technicians or to businesses that employ them. You supply your EPA 608 certification details at checkout or during account setup, and we verify them before the order ships.'
        },
        {
          question: 'What EPA 608 certification level do I need?',
          answer: 'Type I covers small appliances, Type II covers high-pressure and very high-pressure systems (most residential and commercial split systems), Type III covers low-pressure chillers, and Universal covers all three. Most contractors hold Universal certification.'
        },
        {
          question: 'How do I submit and verify my EPA certification?',
          answer: 'Upload a clear photo or scan of your EPA 608 card during registration or checkout, or email it to sales@alperrefrigerants.com. Verification is normally completed within one business day, and we keep the record on file so you do not need to resubmit for future orders.'
        },
        {
          question: 'Do air conditioning units require EPA certification?',
          answer: 'No. Complete air conditioning units and non-refrigerant accessories ship without EPA 608 verification or hazmat documentation. Only refrigerant cylinders trigger the certification and DOT hazardous materials requirements.'
        },
        {
          question: 'What about F-Gas certification for orders in Europe?',
          answer: 'EU F-Gas Regulation requires a valid company F-Gas certificate to receive fluorinated refrigerants. If your delivery address is in the EU, checkout asks for your F-Gas certificate number before the refrigerant order can be completed.'
        },
        {
          question: 'What records do I need to keep?',
          answer: 'Keep records of refrigerant purchases, charging, recovery and disposal, along with your EPA certificate and invoices, for at least three years. These records are what inspectors ask for during a compliance audit.'
        }
      ]
    },
    {
      icon: Truck,
      title: 'Shipping Costs & Delivery',
      color: 'bg-green-100 text-green-800',
      questions: [
        {
          question: 'How much does shipping cost?',
          answer: 'Continental US orders are $45 per order plus a $25 HazMat surcharge on refrigerant shipments, and shipping is free on orders over $500. Alaska, Hawaii and Puerto Rico are $89 plus a $45 HazMat surcharge, free over $1,000. Canada is $75 plus $35, free over $750. The United Kingdom and the European Union start at $120 plus a $50 HazMat surcharge, free over $1,000. Exact charges are calculated at checkout from your delivery address.'
        },
        {
          question: 'Do you offer free shipping?',
          answer: 'Yes, above the order thresholds for each zone: $500 in the continental US, $750 for Canada, and $1,000 for Alaska, Hawaii, Puerto Rico and international zones. HazMat surcharges still apply to refrigerant shipments where noted on our shipping policy page.'
        },
        {
          question: 'How long does delivery take?',
          answer: 'Continental US ground freight is 3-5 business days. Alaska, Hawaii, Puerto Rico and Canada take 5-10 business days. The UK, EU and other international zones take 7-14 business days, plus customs clearance time.'
        },
        {
          question: 'Which countries do you ship to?',
          answer: 'We ship to 54 countries across North America, Latin America, Europe, the Middle East, Asia-Pacific and Africa. Refrigerants move as Class 2.2 non-flammable gas (or the applicable class for A2L and hydrocarbon products) with full DOT and IATA/IMDG documentation.'
        },
        {
          question: 'Who pays import duties and taxes?',
          answer: 'International refrigerant orders ship DDU (Delivered Duty Unpaid) by default, which means import duties, VAT or GST are collected by the carrier or customs authority on arrival. Where a DDP option is available for your destination, you can select it at checkout and we prepay those charges.'
        },
        {
          question: 'Can refrigerants be delivered to a residential address?',
          answer: 'No. Hazardous materials shipments require a commercial delivery address with someone available to sign for and receive the freight.'
        }
      ]
    },
    {
      icon: RotateCcw,
      title: 'Returns & Refunds',
      color: 'bg-amber-100 text-amber-800',
      questions: [
        {
          question: 'What is your return policy?',
          answer: 'Returns must be initiated within 30 calendar days of delivery. Cylinders must be unopened, undamaged and in original packaging with all documentation. After 30 days we only accept returns for defective or damaged product. Contact support to open a return authorization before shipping anything back.'
        },
        {
          question: 'Who pays for return shipping?',
          answer: 'Alper Chemical Group pays return shipping when a product is defective, arrives damaged, or the wrong item was shipped: we email a prepaid DOT-compliant hazmat return label and no restocking fee applies. The customer pays return shipping for change-of-mind returns, ordering errors or no-longer-needed product.'
        },
        {
          question: 'Is there a restocking fee?',
          answer: 'A 15% restocking fee applies only to customer-initiated returns where the original packaging has been opened. There is no restocking fee on defective, damaged or incorrectly shipped orders.'
        },
        {
          question: 'How long do refunds take?',
          answer: 'Once the returned shipment is received and inspected, refunds are issued to the original payment method. Card refunds typically post within 5-10 business days; bank wire and Zelle refunds are returned to the originating account. Return shipping costs are deducted from the refund on customer-initiated returns.'
        },
        {
          question: 'What if my shipment arrives damaged?',
          answer: 'Note the damage on the carrier delivery receipt, photograph the pallet and cylinders before moving them, and contact us within 48 hours. We file the freight claim and ship a replacement or issue a full refund at no cost to you.'
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
          answer: 'Pricing is per cylinder and depends on the refrigerant, current market conditions and the quantity tier you order. Larger pallet and container-load quantities move you into lower per-cylinder pricing automatically on the product page.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept major credit cards, bank wire transfer, Zelle and ACH. Net terms are available for qualified business accounts after credit review. Orders ship once payment clears unless terms are already established.'
        },
        {
          question: 'Do you offer a discount for bank wire or Zelle?',
          answer: 'Yes. Orders paid by bank wire or Zelle receive a 15% discount, applied automatically at checkout when you select either method.'
        },
        {
          question: 'Do you offer volume discounts?',
          answer: 'Yes. Pricing is tiered by quantity, and contract pricing is available for recurring buyers. Submit an RFQ with your annual volume and we will quote accordingly.'
        }
      ]
    }
  ];


  const totalQuestions = faqCategories.reduce((sum, c) => sum + c.questions.length, 0);

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
        title="Refrigerant FAQ: EPA, Shipping & Returns | Alper"
        description="Answers on EPA 608 certification, refrigerant types, shipping costs and free-shipping thresholds, and who pays return shipping. Trade-only refrigerant supply."
        keywords="refrigerant FAQ, EPA 608 certification, refrigerant types HFC HFO, refrigerant shipping cost, hazmat surcharge, refrigerant return policy, restocking fee, bulk refrigerant pricing"
        canonicalUrl="/faq"
        structuredData={faqStructuredData}
        breadcrumbs={[{ name: "Home", url: "/" }, { name: "FAQ", url: "/faq" }]}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <HelpCircle className="h-16 w-16 mx-auto mb-6 text-blue-400" />
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto mb-8">
            Straight answers on EPA 608 certification, refrigerant types, shipping
            costs and our return policy.
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
              <div className="text-3xl font-bold text-blue-600 mb-2">{totalQuestions}</div>
              <p className="text-gray-600">Answered Questions</p>
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
              <div className="text-3xl font-bold text-orange-600 mb-2">30-Day</div>
              <p className="text-gray-600">Return Window</p>
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
                href="tel:+16822152974"
                className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center justify-center"
              >
                Call 1-682-215-2974
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQ;
