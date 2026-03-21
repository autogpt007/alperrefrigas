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
        title="Alper Refrigerants: Bulk Refrigerant Supplier | R-410A, R-134a, HFOs & More"
        description="Alper Refrigerants is your trusted EPA-certified bulk refrigerant supplier. We offer wholesale pricing on R-410A, R-134a, HFOs, and natural refrigerants with fast, nationwide shipping."
        keywords="bulk refrigerant supplier, wholesale refrigerants, R-410A, R-134a, HFO refrigerants, natural refrigerants, EPA certified, HVAC supply, refrigerant distribution, buy freon"
        canonicalUrl="/"
        structuredData={homeSchema}
      />
      <main>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-center my-8 px-4">Alper Refrigerants: Bulk Refrigerant Distribution & Wholesale HVAC Solutions</h1>
        <HomePage />
      </main>
    </>
  );
};

export default Index;
