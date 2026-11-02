import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SEOComponent from '@/components/seo/SEOComponent';
import { GUIDE_PAGES } from './seoPages';

const GuidesIndex: React.FC = () => (
  <>
    <SEOComponent
      title="HVAC Refrigerant Guides | Alper Refrigerants"
      description="Practical guides for HVAC technicians: R-454B vs R-32, R-454B handling, R-22 replacements and EPA 608 rules for buying refrigerant."
      canonicalUrl="/guides"
      breadcrumbs={[{ name: 'Home', url: '/' }, { name: 'Guides', url: '/guides' }]}
    />
    <div className="min-h-screen bg-background py-14">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Refrigerant guides</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {[...GUIDE_PAGES.map((g) => ({ to: g.path, title: g.h1, text: g.seoDescription })),
            { to: '/products/r-22-replacements', title: 'R-22 Replacement Refrigerants', text: 'Retrofit blends compared by oil compatibility and application.' }].map((g) => (
            <Link key={g.to} to={g.to}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader><CardTitle className="text-xl">{g.title}</CardTitle></CardHeader>
                <CardContent className="text-muted-foreground">{g.text}</CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  </>
);

export default GuidesIndex;
