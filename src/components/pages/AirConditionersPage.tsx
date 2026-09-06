import React from 'react';
import { Link } from 'react-router-dom';
import SEOComponent from '../seo/SEOComponent';
import { Wind, Thermometer, Zap, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const subcategories = [
  {
    id: 'mini-splits',
    title: 'Ductless Mini-Splits',
    description: 'High-efficiency split systems for residential and commercial applications. Available in single and multi-zone configurations.',
    icon: Wind,
    href: '/products/air-conditioners/mini-splits',
    features: ['Inverter Technology', 'Energy Star Rated', 'Quiet Operation'],
  },
  {
    id: 'window-ac',
    title: 'Window AC Units',
    description: 'Compact window-mounted air conditioners ideal for single rooms. Easy installation with no ductwork required.',
    icon: Thermometer,
    href: '/products/air-conditioners/window-ac',
    features: ['Self-Contained', 'Easy Install', 'Multiple BTU Options'],
  },
  {
    id: 'portable-ac',
    title: 'Portable AC Units',
    description: 'Mobile cooling solutions that can be moved from room to room. No permanent installation needed.',
    icon: Zap,
    href: '/products/air-conditioners/portable-ac',
    features: ['Mobility', 'No Install Required', 'Dual Hose Options'],
  },
  {
    id: 'multi-zone',
    title: 'Multi-Zone Mini-Split Systems',
    description: 'Dual, tri and quad-zone condensers that cool multiple rooms from one outdoor unit. Ideal for whole-home and light commercial projects.',
    icon: Wind,
    href: '/products/air-conditioners/multi-zone',
    features: ['2-4 Indoor Zones', 'Inverter Compressor', 'Heat Pump Ready'],
  },
  {
    id: 'ptac-commercial',
    title: 'PTAC & Commercial Units',
    description: 'Packaged terminal air conditioners and ceiling cassettes for hotels, apartments and light commercial buildings.',
    icon: Thermometer,
    href: '/products/air-conditioners/ptac-commercial',
    features: ['Hospitality Grade', 'Electric Heat Option', '208/230V'],
  },
];

const AirConditionersPage: React.FC = () => {
  return (
    <>
      <SEOComponent
        title="Wholesale Air Conditioners | Bulk AC"
        description="Buy wholesale air conditioners in bulk. Mini-splits, window units, and portable AC systems at competitive container pricing. Single units available."
        keywords="wholesale air conditioners, bulk AC units, mini splits wholesale, window AC bulk, portable air conditioner wholesale"
        canonicalUrl="/products/air-conditioners"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' },
          { name: 'Air Conditioners', url: '/products/air-conditioners' }
        ]}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Wholesale Air Conditioners
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Premium air conditioning units for distributors and contractors. Order a single unit or
                a full container, with better unit pricing as quantity grows.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/contact">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Request Bulk Quote
                  </Button>
                </Link>
                <Link to="/bulk-pricing">
                  <Button size="lg" variant="outline">
                    View Pricing Tiers
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Bulk Pricing Info Banner */}
        <section className="py-8 bg-primary/5 border-y border-primary/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-8 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Minimum Order</p>
                <p className="text-2xl font-bold text-primary">1 Unit</p>
              </div>
              <div className="hidden md:block h-12 w-px bg-border" />
              <div>
                <p className="text-sm text-muted-foreground">Best Price At</p>
                <p className="text-2xl font-bold text-primary">Full Container</p>
              </div>
              <div className="hidden md:block h-12 w-px bg-border" />
              <div>
                <p className="text-sm text-muted-foreground">Shipping</p>
                <p className="text-2xl font-bold text-primary">Worldwide</p>
              </div>
            </div>
          </div>
        </section>

        {/* Subcategories Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Browse AC Categories
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Select a category to view available products and bulk pricing options.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {subcategories.map((category) => (
                <Link key={category.id} to={category.href} className="block group">
                  <Card className="h-full transition-all duration-300 hover:shadow-xl hover:border-primary/50 hover:-translate-y-1">
                    <CardHeader>
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <category.icon className="w-7 h-7 text-primary" />
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {category.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {category.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-6">
                        {category.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center text-primary font-medium group-hover:underline">
                        View Products
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why Buy Bulk Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground text-center mb-12">
                Bulk AC Pricing Structure
              </h2>
              <div className="bg-card rounded-xl p-8 shadow-lg border">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Full Container (Best Price)</h3>
                      <p className="text-muted-foreground">
                        Order a full 20ft or 40ft container load and receive our best unit pricing with 0% markup.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Mid Bulk (Half Container+)</h3>
                      <p className="text-muted-foreground">
                        Orders at 50% or more of container capacity receive competitive mid-bulk pricing.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Custom Bulk (5+ Units)</h3>
                      <p className="text-muted-foreground">
                        Flexible ordering from a single unit up, with tiered pricing based on quantity.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to Order?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Contact our team for a custom quote based on your specific requirements and volume.
            </p>
            <Link to="/contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Get Custom Quote
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default AirConditionersPage;
