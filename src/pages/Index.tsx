import HomePage from '../components/pages/HomePage';
import SEOComponent from '@/components/seo/SEOComponent';

const Index = () => {
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WholesaleStore",
    "name": "Alper Refrigerants",
    "description": "Leading distributor of high-quality HFC, HFO, and natural refrigerants across North America.",
    "url": "https://alperrefrigas.com",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    }
  };

  return (
    <>
      <SEOComponent 
        title="Alper Refrigerants | Wholesale Refrigerant Distribution & HVAC Solutions"
        description="Professional EPA-certified refrigerant supplier. We distribute HFC, HFO, and natural refrigerants including R-410A, R-134a, and R-22. Bulk pricing and nationwide shipping available."
        keywords="refrigerant distributor, wholesale freon, R-410A supplier, HFO refrigerants, HVAC supplies, Alper Refrigerants"
        canonicalUrl="/"
        structuredData={homeSchema}
      />
      <HomePage />
    </>
  );
};

export default Index;