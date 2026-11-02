import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import SEOComponent from '@/components/seo/SEOComponent';
import { useProducts } from '@/contexts/ProductsContext';
import ProductCard from '@/components/ProductCard';
import type { SeoPageConfig } from './seoPages';

const SeoContentPage: React.FC<{ config: SeoPageConfig }> = ({ config }) => {
  const { products } = useProducts();

  const matched = config.productMatch
    ? products
        .filter((p: any) => {
          const hay = `${p.name ?? ''} ${p.brand ?? ''}`.toLowerCase();
          return (
            config.productMatch!.some((m) => hay.includes(m)) &&
            !(config.productExclude ?? []).some((m) => hay.includes(m))
          );
        })
        .slice(0, 12)
    : [];

  const parent = config.kind === 'guide'
    ? { name: 'Guides', url: '/guides' }
    : { name: 'Products', url: '/products' };

  return (
    <>
      <SEOComponent
        title={config.seoTitle}
        description={config.seoDescription}
        keywords={config.keywords}
        canonicalUrl={config.path}
        ogType={config.kind === 'guide' ? 'article' : 'website'}
        breadcrumbs={[{ name: 'Home', url: '/' }, parent, { name: config.h1, url: config.path }]}
        faq={config.faqs}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <section className="py-14 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-4">{config.badge}</Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">{config.h1}</h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">{config.intro}</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to={config.primaryCta?.to ?? '/products'}>
                  <Button size="lg">{config.primaryCta?.label ?? 'Shop products'}</Button>
                </Link>
                <Link to="/rfq">
                  <Button size="lg" variant="outline">Request a quote</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {config.table && (
          <section className="py-12 bg-card border-y">
            <div className="container mx-auto px-4 max-w-5xl">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">{config.table.title}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      {config.table.headers.map((h) => (
                        <th key={h} className="text-left p-3 border-b font-semibold text-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {config.table.rows.map((row, i) => (
                      <tr key={i} className="border-b last:border-0">
                        {row.map((cell, j) => (
                          <td key={j} className={`p-3 align-top ${j === 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {config.table.note && <p className="text-xs text-muted-foreground mt-4">{config.table.note}</p>}
            </div>
          </section>
        )}

        <section className="py-14">
          <div className="container mx-auto px-4 max-w-3xl space-y-10">
            {config.sections.map((s) => (
              <article key={s.heading}>
                <h2 className="text-2xl font-bold text-foreground mb-3">{s.heading}</h2>
                {s.paragraphs.map((p, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed mb-3">{p}</p>
                ))}
                {s.bullets && (
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    {s.bullets.map((b) => <li key={b}>{b}</li>)}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </section>

        {matched.length > 0 && (
          <section className="py-14 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">{config.productsHeading ?? 'Available products'}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {matched.map((product: any) => <ProductCard key={product.id} product={product} />)}
              </div>
            </div>
          </section>
        )}

        <section className="py-14">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Frequently asked questions</h2>
            <Accordion type="single" collapsible>
              {config.faqs.map((f, i) => (
                <AccordionItem key={f.question} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left">{f.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="py-12 bg-card border-t">
          <div className="container mx-auto px-4 max-w-5xl grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader><CardTitle className="text-lg">Related pages</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {config.related.map((r) => (
                  <Link key={r.to} to={r.to} className="flex items-center text-primary hover:underline">
                    {r.label} <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                ))}
              </CardContent>
            </Card>
            {config.sources && config.sources.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-lg">Sources</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {config.sources.map((s) => (
                    <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-primary hover:underline text-sm">
                      {s.label} <ExternalLink className="w-3 h-3 ml-2" />
                    </a>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default SeoContentPage;
