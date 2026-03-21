import HomePage from '../components/pages/HomePage';
import SEOComponent from '@/components/seo/SEOComponent';

const Index = () => {
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WholesaleStore",
    "@id": "https://alperrefrigas.com/#organization",
    "name": "Alper Refrigerants",
    "description": "Leading EPA-certified distributor of HFO refrigerants for sale, including R-1234yf and R-454B. Bulk supply for HVAC professionals.",
    "url": "https://alperrefrigas.com",
    "telephone": "+1-XXX-XXX-XXXX",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Contact for Warehouse Locations",
      "addressLocality": "Miami",
      "addressRegion": "FL",
      "postalCode": "33101",
      "addressCountry": "US"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Refrigerant Catalog",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "HFO Refrigerant For Sale - Bulk R-1234yf" } },
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Wholesale R-410A Refrigerant" } },
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Bulk R-134a Refrigerant" } },
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "R-404A Wholesale Supply" } }
      ]
    }
  };

  return (
    <>
      <SEOComponent 
        title="HFO Refrigerant For Sale | Bulk R-1234yf & Low GWP Solutions | Alper"
        description="Looking for HFO refrigerant for sale? Alper Refrigerants offers EPA-certified bulk HFO-1234yf, R-454B, and R-513A. Wholesale pricing and fast nationwide shipping."
        keywords="hfo refrigerant for sale, buy hfo 1234yf, wholesale hfo refrigerants, low gwp refrigerants, bulk r-454b, r-513a supplier, hvac hfo supply"
        canonicalUrl="/"
        structuredData={homeSchema}
      />
      <main>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-center my-8 px-4">HFO Refrigerant For Sale: Bulk Distribution & Wholesale HVAC Solutions</h1>
        <HomePage />
      </main>
    </>
  );
};

export default Index;