import HomePage from '../components/pages/HomePage';
import SEOComponent from '@/components/seo/SEOComponent';

const Index = () => {
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WholesaleStore",
    "@id": "https://alperrefrigas.com/#organization",
    "name": "Alper Refrigerants",
    "description": "Leading EPA-certified distributor of high-quality HFC, HFO, and natural refrigerants including R-410A, R-134a, and R-404A. Bulk supply for HVAC professionals.",
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
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Wholesale R-410A Refrigerant" } },
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Bulk R-134a Refrigerant" } },
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "HFO-1234yf Distribution" } },
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "R-404A Wholesale Supply" } }
      ]
    }
  };

  return (
    <>
      <SEOComponent 
        title="Wholesale Refrigerant Distributor | R-410A, R-134a, R-404A | Alper Refrigerants"
        description="Alper Refrigerants is a leading EPA-certified supplier of bulk HFC, HFO, and natural refrigerants. Competitive wholesale pricing on R-410A, R-134a, and more with nationwide shipping."
        keywords="refrigerant distributor, wholesale freon, R-410A supplier, R-134a bulk, R-404A wholesale, HFO refrigerants, HVAC supplies, buy refrigerant online, EPA certified refrigerant supplier"
        canonicalUrl="/"
        structuredData={homeSchema}
      />
      <main>
        <h1 className="sr-only">Alper Refrigerants: Bulk Refrigerant Distribution & Wholesale HVAC Solutions</h1>
        <HomePage />
      </main>
    </>
  );
};

export default Index;