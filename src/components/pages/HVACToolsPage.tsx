import React from 'react';
import { Link } from 'react-router-dom';
import SEOComponent from '../seo/SEOComponent';
import { Gauge, Wrench, Recycle, Link2, HardHat, Settings, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const subcategories = [
  {
    id: 'gauges',
    title: 'Manifold Gauges & Meters',
    description:
      'Analogue and digital manifold gauge sets, vacuum micron gauges and clamp meters for charging, evacuation and electrical checks.',
    icon: Gauge,
    href: '/products/hvac-tools?category=gauges',
    features: ['R-410A and R-134a scales', 'Digital and analogue', 'Hoses included'],
  },
  {
    id: 'tools',
    title: 'Vacuum Pumps & Instruments',
    description:
      'Two-stage vacuum pumps, charging scales, leak detectors and copper tubing tool kits for daily service work.',
    icon: Wrench,
    href: '/products/hvac-tools?category=tools',
    features: ['5 and 8 CFM pumps', '220 lb charging scales', 'Heated-diode leak detection'],
  },
  {
    id: 'recovery',
    title: 'Recovery Equipment',
    description:
      'Recovery machines and DOT-rated recovery cylinders for compliant refrigerant removal and storage.',
    icon: Recycle,
    href: '/products/hvac-tools?category=recovery',
    features: ['Oil-less compressor', '50 lb recovery cylinders', 'EPA 608 workflow'],
  },
  {
    id: 'fittings',
    title: 'Fittings & Adapters',
    description:
      'Brass flare adapters, couplers, tees and caps that connect gauges, hoses and service ports across refrigerant types.',
    icon: Link2,
    href: '/products/hvac-tools?category=fittings',
    features: ['Brass construction', 'Common flare sizes', 'Sold as organised sets'],
  },
  {
    id: 'safety',
    title: 'Safety Equipment',
    description:
      'Goggles, face shields and insulated gloves sized for refrigerant handling and cylinder work.',
    icon: HardHat,
    href: '/products/hvac-tools?category=safety',
    features: ['Cryogenic gloves', 'Splash goggles', 'Site-ready kits'],
  },
  {
    id: 'valves',
    title: 'Valves & Cores',
    description:
      'Valve core removal tools and spare Schrader cores for service without recovering the full charge.',
    icon: Settings,
    href: '/products/hvac-tools?category=valves',
    features: ['Core removal under pressure', 'Spare cores included', 'Brass and chrome'],
  },
];

const HVACToolsPage: React.FC = () => {
  return (
    <>
      <SEOComponent
        title="HVAC Tools & Gauges Wholesale | Alper"
        description="Professional HVAC tools at trade prices: manifold gauge sets, vacuum pumps, recovery machines, charging scales, leak detectors, fittings and safety gear. Bulk discounts on 5 and 10 packs."
        keywords="hvac tools wholesale, manifold gauge set bulk, vacuum pump hvac supplier, refrigerant recovery machine, hvac leak detector wholesale"
        canonicalUrl="/products/hvac-tools"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' },
          { name: 'HVAC Tools & Gauges', url: '/products/hvac-tools' },
        ]}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                HVAC Tools &amp; Gauges
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Service equipment for refrigeration and air conditioning technicians, priced for trade
                buyers. Single tools ship from stock, and 5 or 10 packs carry volume discounts.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/products/accessories">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Shop All Tools
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline">
                    Request Trade Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 bg-primary/5 border-y border-primary/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-8 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Minimum Order</p>
                <p className="text-2xl font-bold text-primary">1 Tool</p>
              </div>
              <div className="hidden md:block h-12 w-px bg-border" />
              <div>
                <p className="text-sm text-muted-foreground">5-Pack Saving</p>
                <p className="text-2xl font-bold text-primary">5%</p>
              </div>
              <div className="hidden md:block h-12 w-px bg-border" />
              <div>
                <p className="text-sm text-muted-foreground">10-Pack Saving</p>
                <p className="text-2xl font-bold text-primary">15%</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Browse Tool Categories</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Every product page lists full specifications, what is in the box and per-unit trade
                pricing.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                      <CardDescription className="text-base">{category.description}</CardDescription>
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

        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground text-center mb-12">
                Building a Service Kit
              </h2>
              <div className="bg-card rounded-xl p-8 shadow-lg border space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Start with measurement</h3>
                  <p className="text-muted-foreground text-sm">
                    A four-valve manifold set, a vacuum micron gauge and a charging scale cover almost
                    every diagnosis and charge. Digital manifolds add superheat and subcooling readings
                    without separate calculations.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Then evacuation and recovery</h3>
                  <p className="text-muted-foreground text-sm">
                    Match pump capacity to the systems you service: 5 CFM is ample for residential
                    mini-splits, while 8 CFM shortens pull-down on light commercial work. Pair a recovery
                    machine with DOT-rated cylinders so removed refrigerant is stored legally.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Finish with consumables and safety</h3>
                  <p className="text-muted-foreground text-sm">
                    Keep spare valve cores, brass adapters, goggles and insulated gloves on every van.
                    These are the items that stop a job, and the 10-pack price makes them cheap to stock.
                  </p>
                </div>
                <div className="pt-2 text-sm text-muted-foreground">
                  Buying for a install programme? See{' '}
                  <Link to="/products/heating-heat-pumps" className="text-primary hover:underline">
                    heat pumps
                  </Link>
                  ,{' '}
                  <Link to="/products/air-conditioners" className="text-primary hover:underline">
                    air conditioners
                  </Link>{' '}
                  and{' '}
                  <Link to="/products/refrigerants" className="text-primary hover:underline">
                    bulk refrigerants
                  </Link>
                  .
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Need a Volume Price?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Tell us how many kits you are fitting out and we will quote the full list in one go.
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

export default HVACToolsPage;
