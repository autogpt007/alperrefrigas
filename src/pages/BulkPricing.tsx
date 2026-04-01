import React from 'react';
import BulkQuoteForm from '@/components/ui/BulkQuoteForm';
import SEOComponent from '@/components/seo/SEOComponent';

const BulkPricing = () => {
  // Structured data for bulk pricing page
  const bulkPricingStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Bulk Refrigerant Pricing - Container & Wholesale Quotes",
    "description": "Get competitive bulk pricing on refrigerant containers and large volume orders. Volume discounts available for HVAC contractors and distributors.",
    "url": "https://alperrefrigas.com/bulk-pricing",
    "mainEntity": {
      "@type": "Service",
      "name": "Bulk Refrigerant Pricing",
      "description": "Wholesale refrigerant pricing for container loads and bulk orders",
      "provider": {
        "@type": "Organization",
        "name": "Alper Refrigerants"
      }
    }
  };

  return (
    <>
      <SEOComponent
        title="Bulk Refrigerant Pricing 2025/2026 | Alper"
        description="Get competitive bulk pricing on 20ft/40ft container loads of R-410A, R-134a, R-454B refrigerants. Volume discounts up to 25% for HVAC contractors. Request wholesale quote today."
        keywords="bulk refrigerant pricing 2025, container load refrigerant, wholesale refrigerant quotes, volume discounts refrigerant, HVAC contractor pricing, bulk R-410A, bulk R-134a, R-454B bulk pricing, refrigerant container pricing 2026"
        canonicalUrl="/bulk-pricing"
        structuredData={bulkPricingStructuredData}
      />
      <BulkQuoteForm />
    </>
  );
};

export default BulkPricing;