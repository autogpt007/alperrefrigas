import HomePage from '../components/pages/HomePage';
import SEOComponent from '@/components/seo/SEOComponent';

const Index = () => {
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WholesaleStore",
    "@id": "https://alperrefrigas.com/#organization",
    "name": "Alper Refrigerants",
    "description": "Leading EPA-certified distributor of high-quality HFC, HFO, and natural refrigerants including R-410A and R-134a.",
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
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Wholesale R-410A Sales" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "HFO Refrigerant Distribution" } }
      ]
    }
  };

  return (
    <>
      <SEOComponent 
        title="Alper Refrigerants | Wholesale Refrigerant Distributor (R-410A, R-134a, HFO)"
        description="Alper Refrigerants is a premier EPA-certified refrigerant supplier. We provide bulk HFC, HFO, and natural refrigerants with nationwide shipping and competitive wholesale pricing."
        keywords="refrigerant distributor, wholesale freon, R-410A supplier, HFO refrigerants, HVAC supplies, buy refrigerant bulk, Alper Refrigerants"
        canonicalUrl="/"
        structuredData={homeSchema}
      />
      <main>
        <h1 className="sr-only">Alper Refrigerants: Professional Refrigerant Distribution & Wholesale Solutions</h1>
        <HomePage />
      </main>
    </>
  );
};

export default Index;