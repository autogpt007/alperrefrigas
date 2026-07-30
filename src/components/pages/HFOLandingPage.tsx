
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Truck, Leaf, ArrowRight, Package, Award, Globe, CheckCircle } from 'lucide-react';
import SEOComponent from '@/components/seo/SEOComponent';
import { useProducts } from '@/contexts/ProductsContext';
import ProductCard from '@/components/ProductCard';

const HFOLandingPage = () => {
  const { products } = useProducts();

  const hfoProducts = products.filter(p =>
    p.category?.toLowerCase().includes('hfo') ||
    p.name?.toLowerCase().includes('1234yf') ||
    p.name?.toLowerCase().includes('1234ze') ||
    p.name?.toLowerCase().includes('r-513') ||
    p.name?.toLowerCase().includes('454b')
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "HFO & Low-GWP Refrigerants Wholesale",
    "description": "Complete range of HFO and low-GWP refrigerants for environmental compliance. R-1234yf, R-1234ze, R-454B, R-513A at wholesale pricing.",
    "url": "https://alperrefrigerants.com/products/hfo-refrigerants",
    "mainEntity": {
      "@type": "ItemList",
      "name": "HFO Refrigerant Products",
      "numberOfItems": hfoProducts.length
    }
  };

  const faqData = [
    {
      question: "What are HFO refrigerants?",
      answer: "HFO (hydrofluoroolefin) refrigerants are fourth-generation synthetic refrigerants with ultra-low global warming potential (GWP). They include R-1234yf (GWP 4), R-1234ze (GWP 7), and HFO blends like R-454B (GWP 466) and R-513A (GWP 631)."
    },
    {
      question: "Why switch to HFO refrigerants?",
      answer: "The EPA AIM Act mandates 85% phase-down of HFC production by 2036. HFO refrigerants comply with current and future GWP limits. New HVAC equipment manufactured after January 2025 must use low-GWP alternatives like HFOs."
    },
    {
      question: "What is the price difference between HFC and HFO refrigerants?",
      answer: "HFO refrigerants currently cost more per pound than traditional HFCs due to newer manufacturing processes. However, bulk pricing through wholesale distributors like Alper Refrigerants significantly reduces per-unit costs, especially at container-load volumes."
    },
    {
      question: "Which HFO refrigerant replaces R-410A?",
      answer: "R-454B (Opteon XL41) is the primary HFO-blend replacement for R-410A in residential and light commercial HVAC. R-32 is also used in some applications. Both have significantly lower GWP than R-410A."
    },
    {
      question: "Do you offer bulk HFO pricing?",
      answer: "Yes, we offer pallet pricing (40+ cylinders), 20ft container loads (1,140 cylinders), and 40ft container loads (2,280 cylinders) for all HFO refrigerants. Contact us for current 2025/2026 wholesale quotes."
    }
  ];

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    { name: "HFO Refrigerants", url: "/products/hfo-refrigerants" }
  ];

  return (
    <>
      <SEOComponent
        title="HFO Refrigerants Wholesale | Low-GWP"
        description="Buy HFO refrigerants wholesale: R-1234yf, R-1234ze, R-454B, R-513A. Ultra-low GWP, EPA AIM Act compliant. Bulk container pricing, same-day shipping from TX, FL, CA."
        keywords="HFO refrigerants wholesale, low GWP refrigerant supplier, R-1234yf wholesale, R-1234ze bulk, R-454B supplier, R-513A distributor, hydrofluoroolefin refrigerants, AIM Act compliant refrigerants, environmental refrigerants, buy HFO refrigerant"
        canonicalUrl="/products/hfo-refrigerants"
        structuredData={structuredData}
        faq={faqData}
        breadcrumbs={breadcrumbs}
      />

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-gradient-to-br from-green-900 via-emerald-900 to-slate-900 text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2 text-sm">
                <Leaf className="h-4 w-4 mr-2" />
                EPA AIM Act Compliant — 2025/2026
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                HFO & Low-GWP Refrigerants
              </h1>
              <p className="text-xl md:text-2xl text-green-200 max-w-3xl mx-auto">
                Next-generation refrigerants with up to 99.9% lower global warming potential. Wholesale pricing for contractors, distributors, and OEMs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/rfq">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg">
                    Get HFO Wholesale Quote
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/products/r-454b">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg">
                    R-454B Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Product Comparison Table */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              HFO Refrigerant Comparison — 2025/2026
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full max-w-4xl mx-auto border-collapse">
                <thead>
                  <tr className="border-b-2 border-primary">
                    <th className="text-left p-4 text-foreground">Refrigerant</th>
                    <th className="text-center p-4 text-foreground">GWP</th>
                    <th className="text-center p-4 text-foreground">Safety Class</th>
                    <th className="text-center p-4 text-foreground">Replaces</th>
                    <th className="text-center p-4 text-foreground">Application</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "R-1234yf", gwp: "4", safety: "A2L", replaces: "R-134a", app: "Automotive A/C" },
                    { name: "R-1234ze", gwp: "7", safety: "A2L", replaces: "R-134a", app: "Chillers, Heat Pumps" },
                    { name: "R-454B", gwp: "466", safety: "A2L", replaces: "R-410A", app: "Residential HVAC" },
                    { name: "R-513A", gwp: "631", safety: "A1", replaces: "R-134a", app: "Commercial Chillers" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-border hover:bg-muted/50">
                      <td className="p-4 font-semibold text-foreground">{row.name}</td>
                      <td className="p-4 text-center">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">{row.gwp}</Badge>
                      </td>
                      <td className="p-4 text-center text-muted-foreground">{row.safety}</td>
                      <td className="p-4 text-center text-muted-foreground">{row.replaces}</td>
                      <td className="p-4 text-center text-muted-foreground">{row.app}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Available HFO Products */}
        {hfoProducts.length > 0 && (
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
                HFO Products In Stock
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hfoProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Content Section for SEO */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-3xl font-bold text-foreground">
                Understanding the HFO Refrigerant Transition
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  The global HVAC industry is undergoing a major refrigerant transition driven by environmental regulations. The <strong>EPA AIM Act</strong>, the <strong>Kigali Amendment</strong> to the Montreal Protocol, and <strong>EU F-Gas Regulation</strong> all mandate significant reductions in high-GWP HFC refrigerant use.
                </p>
                <p>
                  <strong>HFO (hydrofluoroolefin) refrigerants</strong> are engineered to deliver comparable cooling performance with dramatically lower environmental impact. R-1234yf has a GWP of just 4, compared to R-134a's GWP of 1,430 — a 99.7% reduction.
                </p>
                <p>
                  As a wholesale HFO refrigerant distributor, Alper Refrigerants provides contractors and facility managers with competitive bulk pricing and expert guidance on refrigerant selection, handling requirements, and regulatory compliance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Signals */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { icon: <Globe className="h-6 w-6" />, title: "International Shipping", desc: "Worldwide delivery from US distribution centers" },
                { icon: <Truck className="h-6 w-6" />, title: "Same-Day Dispatch", desc: "In-stock HFO orders ship same business day" },
                { icon: <Shield className="h-6 w-6" />, title: "Full Documentation", desc: "SDS, certificates of analysis, EPA compliance docs" },
                { icon: <CheckCircle className="h-6 w-6" />, title: "99.9% Purity", desc: "Every batch lab-tested and certified" },
                { icon: <Package className="h-6 w-6" />, title: "Flexible Quantities", desc: "From pallets to full container loads" },
                { icon: <Award className="h-6 w-6" />, title: "Expert Support", desc: "Technical guidance on HFO selection and handling" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4">
                  <div className="text-primary mt-1">{item.icon}</div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Internal Links */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Related Products & Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/products/r-454b" className="p-4 rounded-lg border hover:border-primary transition-colors">
                  <h3 className="font-semibold text-foreground">R-454B Wholesale</h3>
                  <p className="text-sm text-muted-foreground">The R-410A replacement — bulk pricing, specs, and ordering</p>
                </Link>
                <Link to="/products/category/hfc" className="p-4 rounded-lg border hover:border-primary transition-colors">
                  <h3 className="font-semibold text-foreground">HFC Refrigerants</h3>
                  <p className="text-sm text-muted-foreground">R-410A, R-134a, R-404A still available at wholesale prices</p>
                </Link>
                <Link to="/compliance" className="p-4 rounded-lg border hover:border-primary transition-colors">
                  <h3 className="font-semibold text-foreground">EPA Compliance Guide</h3>
                  <p className="text-sm text-muted-foreground">AIM Act requirements and transition timelines</p>
                </Link>
                <Link to="/certifications" className="p-4 rounded-lg border hover:border-primary transition-colors">
                  <h3 className="font-semibold text-foreground">Our Certifications</h3>
                  <p className="text-sm text-muted-foreground">EPA, DOT, and industry certifications</p>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-green-900 to-slate-900 text-white">
          <div className="container mx-auto px-4 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Transition to Low-GWP Refrigerants Today
            </h2>
            <p className="text-xl text-green-200 max-w-2xl mx-auto">
              Stay ahead of EPA regulations with competitive wholesale pricing on HFO refrigerants. Request your 2025/2026 quote now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/rfq">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 px-8 py-6 text-lg">
                  Request Wholesale Quote
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg">
                  Talk to a Specialist
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HFOLandingPage;
