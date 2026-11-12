
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Truck, CheckCircle, ArrowRight, Leaf, ThermometerSun, Package, Award, Globe } from 'lucide-react';
import SEOComponent from '@/components/seo/SEOComponent';
import { useProducts } from '@/contexts/ProductsContext';
import ProductCard from '@/components/ProductCard';

const R454BLandingPage = () => {
  const { products } = useProducts();

  const r454bProducts = products.filter(p =>
    p.name?.toLowerCase().includes('r-454b') || p.name?.toLowerCase().includes('454b')
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "R-454B Refrigerant Wholesale",
    "description": "R-454B (Opteon XL41) is the next-generation low-GWP replacement for R-410A in HVAC systems. Wholesale pricing for contractors and distributors.",
    "brand": { "@type": "Brand", "name": "Alper Refrigerants" },
    "category": "Refrigerants > HFO Blends",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": "Alper Refrigerants" }
    }
  };

  const faqData = [
    {
      question: "What is R-454B refrigerant?",
      answer: "R-454B (marketed as Opteon XL41 by Chemours) is a mildly flammable (A2L) HFO blend designed as a direct replacement for R-410A. It has a GWP of 466 — 78% lower than R-410A's GWP of 2,088."
    },
    {
      question: "Why is R-454B replacing R-410A?",
      answer: "The EPA's AIM Act mandates phasing down HFC production by 85% by 2036. R-454B meets the new GWP limits for residential and commercial HVAC systems effective January 2025, making it the industry-standard replacement."
    },
    {
      question: "Is R-454B compatible with existing R-410A equipment?",
      answer: "R-454B is not a drop-in replacement. It requires new equipment specifically designed for A2L refrigerants with updated safety controls, sensors, and charge limits per ASHRAE 15 and UL 60335-2-40."
    },
    {
      question: "What is the minimum order quantity for R-454B?",
      answer: "Our MOQ for R-454B is 40 cylinders per pallet. We offer volume discounts for 20ft container loads (1,140 cylinders) and 40ft container loads (2,280 cylinders)."
    },
    {
      question: "Where can I buy R-454B in bulk?",
      answer: "Alper Refrigerants is a wholesale R-454B supplier shipping from distribution centers in Texas, Florida, and California. We provide EPA-compliant documentation, competitive container-load pricing, and same-day shipping."
    }
  ];

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    { name: "R-454B Refrigerant", url: "/products/r-454b" }
  ];

  return (
    <>
      <SEOComponent
        title="R-454B Wholesale | R-410A Replacement"
        description="Buy R-454B (Opteon XL41) wholesale. The EPA-approved low-GWP replacement for R-410A with 78% lower warming potential. Bulk pricing, container loads, same-day shipping."
        keywords="R-454B wholesale, R-454B refrigerant, Opteon XL41, R-410A replacement, low GWP refrigerant, A2L refrigerant wholesale, R-454B bulk pricing, R-454B supplier, buy R-454B, R-454B container load, AIM Act refrigerant"
        canonicalUrl="/products/r-454b"
        structuredData={structuredData}
        faq={faqData}
        breadcrumbs={breadcrumbs}
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2 text-sm">
                <Leaf className="h-4 w-4 mr-2" />
                78% Lower GWP Than R-410A
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                R-454B Refrigerant Wholesale
              </h1>
              <p className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto">
                The EPA-approved next-generation replacement for R-410A. Bulk pricing for HVAC contractors, distributors, and facility managers. 2025/2026 compliant.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/rfq">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg">
                    Get R-454B Quote
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/bulk-pricing">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg">
                    <Package className="mr-2 h-5 w-5" />
                    Container Load Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Key Specs */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              R-454B Technical Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <ThermometerSun className="h-8 w-8" />, title: "GWP: 466", desc: "78% lower than R-410A (2,088 GWP)" },
                { icon: <Shield className="h-8 w-8" />, title: "A2L Safety Class", desc: "Mildly flammable, manageable safety requirements" },
                { icon: <Award className="h-8 w-8" />, title: "EPA Approved", desc: "Meets AIM Act 2025 requirements" },
                { icon: <Leaf className="h-8 w-8" />, title: "99.9% Purity", desc: "Lab-tested, certificate of analysis included" },
              ].map((spec, i) => (
                <Card key={i} className="text-center">
                  <CardContent className="pt-6 space-y-3">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {spec.icon}
                    </div>
                    <h3 className="font-bold text-lg text-foreground">{spec.title}</h3>
                    <p className="text-muted-foreground text-sm">{spec.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why R-454B Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-foreground">
                Why R-454B Is the Future of HVAC Refrigerants
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  The EPA's AIM Act requires an 85% phase-down of high-GWP HFC refrigerants by 2036. Starting January 2025, new residential and light commercial HVAC equipment must use refrigerants with a GWP below 700. <strong>R-454B (GWP 466)</strong> is the leading replacement selected by major OEMs including Carrier, Trane, Daikin, and Lennox.
                </p>
                <p>
                  As a wholesale R-454B supplier, Alper Refrigerants provides bulk container-load pricing for contractors and distributors preparing for the transition. Our 2025/2026 pricing includes volume discounts on pallet orders (40+ cylinders), 20ft containers (1,140 cylinders), and 40ft containers (2,280 cylinders).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Available Products */}
        {r454bProducts.length > 0 && (
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
                R-454B Products In Stock
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {r454bProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Bulk Pricing Tiers */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              R-454B Bulk Pricing Tiers — 2025/2026
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { tier: "Pallet", qty: "40+ Cylinders", desc: "Ideal for single-job orders", cta: "Request Pallet Quote" },
                { tier: "20ft Container", qty: "1,140 Cylinders", desc: "Best value for regional distributors", cta: "Get Container Price" },
                { tier: "40ft Container", qty: "2,280 Cylinders", desc: "Maximum savings for large operations", cta: "Get Bulk Quote" },
              ].map((tier, i) => (
                <Card key={i} className={i === 1 ? "border-primary shadow-lg scale-105" : ""}>
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{tier.tier}</CardTitle>
                    <p className="text-2xl font-bold text-primary">{tier.qty}</p>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <p className="text-muted-foreground">{tier.desc}</p>
                    <Link to="/rfq">
                      <Button className="w-full">{tier.cta}</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Alper */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              Why Buy R-454B From Alper Refrigerants
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { icon: <Globe className="h-6 w-6" />, title: "Global Shipping", desc: "Distribution centers in TX, FL, CA with international delivery" },
                { icon: <Truck className="h-6 w-6" />, title: "Same-Day Shipping", desc: "In-stock orders ship same day, 1-3 day delivery" },
                { icon: <Shield className="h-6 w-6" />, title: "EPA Compliant", desc: "Full documentation, SDS, and certificates of analysis" },
                { icon: <CheckCircle className="h-6 w-6" />, title: "99.9% Purity", desc: "Lab-verified purity guarantee on every shipment" },
                { icon: <Package className="h-6 w-6" />, title: "Container Loads", desc: "20ft and 40ft container-load pricing available" },
                { icon: <Award className="h-6 w-6" />, title: "13+ Years Experience", desc: "Trusted by 500+ HVAC contractors and distributors" },
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
                <Link to="/products/category/hfo" className="p-4 rounded-lg border hover:border-primary transition-colors">
                  <h3 className="font-semibold text-foreground">HFO Refrigerants</h3>
                  <p className="text-sm text-muted-foreground">Browse all low-GWP HFO refrigerants including R-1234yf, R-1234ze, R-513A</p>
                </Link>
                <Link to="/products" className="p-4 rounded-lg border hover:border-primary transition-colors">
                  <h3 className="font-semibold text-foreground">Full Product Catalog</h3>
                  <p className="text-sm text-muted-foreground">View all refrigerants: HFC, HFO, natural, and specialty blends</p>
                </Link>
                <Link to="/compliance" className="p-4 rounded-lg border hover:border-primary transition-colors">
                  <h3 className="font-semibold text-foreground">EPA Compliance Guide</h3>
                  <p className="text-sm text-muted-foreground">AIM Act requirements, Section 608 certification, and compliance resources</p>
                </Link>
                <Link to="/bulk-pricing" className="p-4 rounded-lg border hover:border-primary transition-colors">
                  <h3 className="font-semibold text-foreground">Bulk Pricing Calculator</h3>
                  <p className="text-sm text-muted-foreground">Calculate savings on pallet, 20ft, and 40ft container orders</p>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-blue-900 to-slate-900 text-white">
          <div className="container mx-auto px-4 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Stock R-454B for 2025/2026?
            </h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Get ahead of the R-410A phase-down. Request your wholesale quote today and lock in competitive pricing.
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

export default R454BLandingPage;
