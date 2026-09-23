import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { AlertTriangle, ArrowRight, Droplets, Gauge, Wrench } from 'lucide-react';
import SEOComponent from '@/components/seo/SEOComponent';
import { useProducts } from '@/contexts/ProductsContext';
import ProductCard from '@/components/ProductCard';
import { createProductSlug } from '@/lib/slugs';

type Retrofit = {
  gas: string;
  match: string[];
  oil: string;
  note: string;
};

const RETROFITS: Retrofit[] = [
  {
    gas: 'R-407C',
    match: ['r-407c', 'r407c'],
    oil: 'POE oil change required',
    note: 'Long-standing R-22 alternative for direct-expansion air conditioning and heat pumps. Zeotropic blend, so charge as a liquid and expect a temperature glide across the coil.',
  },
  {
    gas: 'R-422D (MO29)',
    match: ['422d', 'mo29'],
    oil: 'Works with existing mineral oil',
    note: 'Service blend designed to drop into R-22 direct-expansion systems without changing the compressor oil, which keeps retrofit labour short.',
  },
  {
    gas: 'R-422B (NU-22)',
    match: ['422b', 'nu-22', 'nu22'],
    oil: 'Works with existing mineral oil',
    note: 'Closer capacity match to R-22 in air conditioning than R-422D, again without an oil change on most systems.',
  },
  {
    gas: 'R-438A (MO99)',
    match: ['438a', 'mo99'],
    oil: 'Works with existing mineral oil',
    note: 'Broad-application retrofit blend used across air conditioning and medium-temperature refrigeration where an oil change is impractical.',
  },
  {
    gas: 'R-427A',
    match: ['427a'],
    oil: 'Mineral oil tolerant',
    note: 'Retrofit blend intended to keep capacity and discharge temperature close to R-22 in split and packaged systems.',
  },
  {
    gas: 'R-453A (RS-44B)',
    match: ['453a', 'rs-44b', 'rs44b'],
    oil: 'Works with existing mineral oil',
    note: 'Non-flammable A1 retrofit blend for R-22 air conditioning and medium-temperature refrigeration.',
  },
];

const FAQS = [
  {
    question: 'Is R-22 still legal to buy in the United States?',
    answer:
      'Production and import of new R-22 ended on 1 January 2020 under the Clean Air Act phase-out. Existing systems may still be serviced with reclaimed or previously produced stock, which is why supply is limited and prices are volatile. Retrofitting to a replacement blend removes that supply risk.',
  },
  {
    question: 'Which R-22 replacement needs no oil change?',
    answer:
      'R-422D (MO29), R-422B (NU-22), R-438A (MO99) and R-453A (RS-44B) are formulated to work with the mineral oil already in most R-22 systems, so the retrofit is usually a recover, charge and commission job. R-407C normally requires a change to POE oil.',
  },
  {
    question: 'Can I just add a replacement blend on top of the R-22 charge?',
    answer:
      'No. Mixing refrigerants is not permitted and will give unpredictable pressures and capacity. Recover the existing charge fully with a recovery machine and DOT-rated cylinder, then weigh in the new blend to the manufacturer figure and relabel the system.',
  },
  {
    question: 'Why must blends be charged as a liquid?',
    answer:
      'These are zeotropic blends, meaning their components boil at slightly different temperatures. Charging as a vapour removes the lighter components first and shifts the composition, so always charge liquid from the cylinder.',
  },
  {
    question: 'Will a retrofit change system capacity?',
    answer:
      'Expect a small change in capacity and discharge temperature, and check superheat and subcooling after commissioning. Metering devices sometimes need adjustment, and every retrofit should be verified against the equipment manufacturer guidance.',
  },
  {
    question: 'Do I need EPA certification to buy these refrigerants?',
    answer:
      'Yes. All refrigerant purchases require EPA Section 608 certification and a commercial delivery address, and shipments move under DOT hazardous materials rules.',
  },
  {
    question: 'What is the minimum order quantity?',
    answer:
      'Refrigerants are sold by the pallet, with per-cylinder pricing improving as pallet count rises up to full truck and container loads. If you need less than a pallet, request a quote and our team will price it for you.',
  },
];

const R22ReplacementsPage: React.FC = () => {
  const { products } = useProducts();

  const findProduct = (match: string[]) =>
    products.find((p) => {
      const haystack = `${p.name ?? ''} ${p.sku ?? ''}`.toLowerCase();
      return match.some((m) => haystack.includes(m));
    });

  const matchedProducts = RETROFITS.map((r) => ({ retrofit: r, product: findProduct(r.match) }));
  const availableProducts = matchedProducts
    .map((m) => m.product)
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <SEOComponent
        title="R-22 Replacement Refrigerants | Drop-In Guide"
        description="R-22 drop-in replacement guide for HVAC contractors: R-422D, R-422B, R-438A, R-427A, R-453A and R-407C compared by oil compatibility and application, with wholesale pallet pricing."
        keywords="r-22 replacement refrigerant, r22 drop in replacement, mo99 wholesale, nu-22 r-22 retrofit, r-407c replacement for r-22, r-453a rs-44b supplier"
        canonicalUrl="/products/r-22-replacements"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' },
          { name: 'R-22 Replacements', url: '/products/r-22-replacements' },
        ]}
        faq={FAQS}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4">R-22 phase-out</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                R-22 Replacement Refrigerants
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                New R-22 has not been produced or imported in the United States since January 2020.
                These retrofit blends keep existing air conditioning and refrigeration systems running,
                and most of them work with the mineral oil already in the system.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/products/refrigerants">
                  <Button size="lg">Shop Refrigerants</Button>
                </Link>
                <Link to="/rfq">
                  <Button size="lg" variant="outline">
                    Request Bulk Quote
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-card border-y">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
              <div className="flex gap-3">
                <Droplets className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h2 className="font-semibold text-foreground mb-1">Recover, do not top up</h2>
                  <p className="text-sm text-muted-foreground">
                    Recover the full R-22 charge into a DOT-rated cylinder before charging the new blend.
                    Refrigerants must never be mixed.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Gauge className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h2 className="font-semibold text-foreground mb-1">Charge as a liquid</h2>
                  <p className="text-sm text-muted-foreground">
                    These are zeotropic blends with a temperature glide, so charge liquid from the
                    cylinder and weigh the charge in.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Wrench className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h2 className="font-semibold text-foreground mb-1">Recheck and relabel</h2>
                  <p className="text-sm text-muted-foreground">
                    Verify superheat and subcooling after commissioning, then relabel the system with the
                    new refrigerant and oil type.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground text-center mb-4">
                Compare R-22 Retrofit Blends
              </h2>
              <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
                Always confirm the retrofit against the equipment manufacturer guidance before changing
                the refrigerant in a system.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {matchedProducts.map(({ retrofit, product }) => (
                  <Card key={retrofit.gas} className="h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between gap-3">
                        <CardTitle className="text-xl">{retrofit.gas}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {retrofit.oil}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{retrofit.note}</p>
                      {product ? (
                        <Link
                          to={`/products/${createProductSlug(product)}`}
                          className="inline-flex items-center text-primary font-medium hover:underline"
                        >
                          View {retrofit.gas} pricing
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      ) : (
                        <Link
                          to="/rfq"
                          className="inline-flex items-center text-primary font-medium hover:underline"
                        >
                          Request availability
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {availableProducts.length > 0 && (
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-foreground text-center mb-10">
                R-22 Retrofit Refrigerants in Stock
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {availableProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-foreground text-center mb-8">
                R-22 Retrofit Questions
              </h2>
              <Accordion type="single" collapsible className="bg-card rounded-xl border px-4">
                {FAQS.map((item, idx) => (
                  <AccordionItem key={idx} value={`r22-faq-${idx}`}>
                    <AccordionTrigger className="text-left text-base font-semibold">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        <section className="py-16 bg-card border-t">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Professional use only
            </h2>
            <p className="text-muted-foreground mb-8">
              All refrigerant sales require EPA Section 608 certification and a commercial delivery
              address. For the tools needed to complete a retrofit, see{' '}
              <Link to="/products/hvac-tools" className="text-primary hover:underline">
                HVAC tools and gauges
              </Link>
              , and for low-GWP equipment options see{' '}
              <Link to="/products/heating-heat-pumps" className="text-primary hover:underline">
                heat pumps
              </Link>{' '}
              or the{' '}
              <Link to="/products/r-454b" className="text-primary hover:underline">
                R-454B guide
              </Link>
              .
            </p>
            <Link to="/rfq">
              <Button size="lg">Request a Retrofit Quote</Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default R22ReplacementsPage;
