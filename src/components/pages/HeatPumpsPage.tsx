import React from 'react';
import { Link } from 'react-router-dom';
import SEOComponent from '../seo/SEOComponent';
import { Wind, Home, Building2, ArrowRight, Thermometer, Snowflake } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const subcategories = [
  {
    id: 'single-zone',
    title: 'Single-Zone Heat Pumps',
    description:
      'Ductless inverter heat pumps that heat and cool one room from a single outdoor condenser. 9,000 to 36,000 BTU, wall-mounted and ceiling cassette indoor units.',
    icon: Home,
    href: '/products/heating-heat-pumps/single-zone',
    features: ['Heats down to -15F', 'Inverter compressor', 'R-410A pre-charged'],
  },
  {
    id: 'multi-zone',
    title: 'Multi-Zone Heat Pumps',
    description:
      'Dual, tri and quad-zone condensers that heat and cool several rooms independently. Ideal for whole-home retrofits and light commercial fit-outs.',
    icon: Wind,
    href: '/products/heating-heat-pumps/multi-zone',
    features: ['2-4 indoor zones', 'Independent room control', '18,000 to 36,000 BTU'],
  },
  {
    id: 'ptac',
    title: 'PTAC Heat Pumps',
    description:
      'Packaged terminal heat pumps with electric backup heat for hotels, apartments, care homes and student housing. Standard 42 in. wall sleeve fit.',
    icon: Building2,
    href: '/products/heating-heat-pumps/ptac',
    features: ['Hospitality grade', 'Electric backup heat', '208/230V'],
  },
];

const HeatPumpsPage: React.FC = () => {
  return (
    <>
      <SEOComponent
        title="Wholesale Heat Pumps | Mini-Split & PTAC"
        description="Buy heat pumps wholesale: single-zone and multi-zone ductless mini-splits and PTAC heat pumps with electric backup heat. Trade pricing from one unit to a full container."
        keywords="wholesale heat pumps, mini split heat pump bulk, multi zone heat pump wholesale, ptac heat pump supplier, ductless heat pump distributor"
        canonicalUrl="/products/heating-heat-pumps"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' },
          { name: 'Heating & Heat Pumps', url: '/products/heating-heat-pumps' },
        ]}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Heating &amp; Heat Pumps
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Inverter heat pumps that both heat and cool, supplied to contractors, distributors and
                property developers. Order a single unit or a full container, with better unit pricing as
                quantity grows.
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

        <section className="py-8 bg-primary/5 border-y border-primary/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-8 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Minimum Order</p>
                <p className="text-2xl font-bold text-primary">1 Unit</p>
              </div>
              <div className="hidden md:block h-12 w-px bg-border" />
              <div>
                <p className="text-sm text-muted-foreground">Capacity Range</p>
                <p className="text-2xl font-bold text-primary">9K - 36K BTU</p>
              </div>
              <div className="hidden md:block h-12 w-px bg-border" />
              <div>
                <p className="text-sm text-muted-foreground">Refrigerant</p>
                <p className="text-2xl font-bold text-primary">R-410A</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Browse Heat Pump Types</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Every unit reverses to heating in winter and cooling in summer, so one system covers the
                whole year.
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
                How to Specify a Heat Pump
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-card rounded-xl p-6 shadow-lg border">
                  <div className="flex items-center gap-3 mb-3">
                    <Thermometer className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Size by room, not by price</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Allow roughly 20 BTU per square foot of conditioned floor area, then add capacity for
                    high ceilings, large glazed areas or a top floor under an uninsulated roof. A 12,000
                    BTU unit suits about 550 sq ft; 24,000 BTU covers about 1,100 sq ft.
                  </p>
                </div>
                <div className="bg-card rounded-xl p-6 shadow-lg border">
                  <div className="flex items-center gap-3 mb-3">
                    <Snowflake className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Check the heating range</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Inverter heat pumps keep producing heat well below freezing, but output falls as the
                    outdoor temperature drops. In cold climates specify a low-ambient model or keep a
                    backup heat source for the coldest weeks.
                  </p>
                </div>
                <div className="bg-card rounded-xl p-6 shadow-lg border">
                  <div className="flex items-center gap-3 mb-3">
                    <Wind className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Single zone or multi zone</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    One indoor head per outdoor unit is cheaper per room and simpler to service. Multi-zone
                    condensers save wall space and refrigerant line runs when three or four rooms are
                    treated at once.
                  </p>
                </div>
                <div className="bg-card rounded-xl p-6 shadow-lg border">
                  <div className="flex items-center gap-3 mb-3">
                    <Building2 className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Electrical and installation</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Smaller units run on 115V or 208/230V single phase; larger and PTAC models need a
                    dedicated 208/230V circuit. Refrigerant connection and commissioning must be carried
                    out by a qualified technician.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Need a Project Quote?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Send us your unit schedule and we will price the full package, including{' '}
              <Link to="/products/refrigerants" className="text-primary hover:underline">
                refrigerant
              </Link>{' '}
              and{' '}
              <Link to="/products/hvac-tools" className="text-primary hover:underline">
                installation tools
              </Link>
              .
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

export default HeatPumpsPage;
