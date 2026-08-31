
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '@/config/site';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: any;
  robotsContent?: string;
  themeColor?: string;
  author?: string;
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
  breadcrumbData?: Array<{
    name: string;
    url: string;
  }>;
  product?: {
    name: string;
    price: number;
    currency: string;
    availability: string;
    brand: string;
    sku: string;
    gtin?: string;
    description: string;
    image: string;
    moq?: number;
    category?: string;
    specifications?: Record<string, any>;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
  };
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  faqData?: Array<{
    question: string;
    answer: string;
  }>;
  productData?: Array<{
    "@type": string;
    name: string;
    description: string;
    category?: string;
    brand?: string;
    offers?: any;
  }>;
}

const SEOComponent: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = '/logo.svg',
  ogType = 'website',
  structuredData,
  robotsContent,
  themeColor,
  author,
  breadcrumbs,
  breadcrumbData,
  product,
  faq,
  faqData,
  productData,
  aggregateRating
}) => {
  const siteUrl = SITE_URL;
  const businessName = 'Alper Refrigerants';
  const legalName = 'Alper Chemical Group';
  const mainPhone = '+1-682-215-2974';
  const salesEmail = 'sales@alperrefrigerants.com';
  const supportEmail = 'support@alperrefrigerants.com';
  
  const fullTitle = title.includes('Alper') ? title : `${title} | ${businessName}`;
  
  // Calculate price valid until (30 days from now for Shopping ads)
  const priceValidUntil = new Date();
  priceValidUntil.setDate(priceValidUntil.getDate() + 30);
  const priceValidUntilStr = priceValidUntil.toISOString().split('T')[0];
  
  // Single primary storefront offer (USD) so structured data matches the one price
  // and one availability state shown on the product page and sent in the product feed.
  const normalizeAvailability = (value?: string) => {
    if (!value) return 'https://schema.org/InStock';
    return value.startsWith('http') ? value : `https://schema.org/${value}`;
  };

  const generatePrimaryOffer = (
    basePrice: number,
    sku: string,
    availability?: string,
    offerUrl?: string
  ) => ({
    "@type": "Offer",
    "price": basePrice,
    "priceCurrency": "USD",
    "priceValidUntil": priceValidUntilStr,
    "availability": normalizeAvailability(availability),
    "itemCondition": "https://schema.org/NewCondition",
    "url": offerUrl || `${siteUrl}/products/${sku?.toLowerCase() || ''}`,
    "seller": { "@type": "Organization", "name": businessName }
  });


  // Generate product structured data for Google Merchant Center with multi-currency
  const productStructuredData = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": product.brand || businessName
    },
    "sku": product.sku,
    ...(product.gtin && { "gtin": product.gtin }),
    "image": product.image.startsWith('http') ? product.image : `${siteUrl}${product.image}`,
    "category": product.category || "Refrigerants",
    "offers": generateMultiCurrencyOffers(product.price, product.sku),
    "audience": {
      "@type": "BusinessAudience",
      "audienceType": "B2B HVAC Professionals"
    },
    ...(product.moq && {
      "additionalProperty": {
        "@type": "PropertyValue",
        "name": "Minimum Order Quantity",
        "value": `${product.moq} cylinders`
      }
    }),
    ...(aggregateRating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": aggregateRating.ratingValue,
        "reviewCount": aggregateRating.reviewCount,
        "bestRating": aggregateRating.bestRating || 5
      }
    })
  } : null;

  // Breadcrumb structured data
  const breadcrumbStructuredData = (breadcrumbs || breadcrumbData) && (breadcrumbs || breadcrumbData)!.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": (breadcrumbs || breadcrumbData)!.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${siteUrl}${crumb.url}`
    }))
  } : null;

  // FAQ structured data
  const faqStructuredData = (faq || faqData) && (faq || faqData)!.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": (faq || faqData)!.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  } : null;

  // Enhanced Organization structured data
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": businessName,
    "legalName": legalName,
    "alternateName": ["Alper Refrigerant", "Alper Chemical Group"],
    "url": siteUrl,
    "logo": `${siteUrl}/logo.svg`,
    "description": "Professional wholesale refrigerant distributor specializing in HFC, HFO, and natural refrigerants for HVAC, automotive, and industrial applications. EPA certified with competitive bulk pricing.",
    "foundingDate": "2020",
    "serviceArea": [
      { "@type": "Country", "name": "United States" },
      { "@type": "Country", "name": "United Kingdom" },
      { "@type": "Country", "name": "Canada" },
      { "@type": "Country", "name": "Australia" },
      { "@type": "AdministrativeArea", "name": "European Union" }
    ],
    "areaServed": [
      { "@type": "Country", "name": "United States" },
      { "@type": "Country", "name": "United Kingdom" },
      { "@type": "Country", "name": "Canada" },
      { "@type": "Country", "name": "Australia" },
      { "@type": "AdministrativeArea", "name": "European Union" }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Refrigerant Products",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "HFC Refrigerants",
          "description": "High-performance HFC refrigerants for commercial and industrial applications"
        },
        {
          "@type": "OfferCatalog", 
          "name": "HFO Refrigerants",
          "description": "Next-generation low-GWP HFO refrigerants for environmental compliance"
        },
        {
          "@type": "OfferCatalog",
          "name": "Natural Refrigerants",
          "description": "Eco-friendly natural refrigerant solutions"
        }
      ]
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": mainPhone,
        "contactType": "sales",
        "email": salesEmail,
        "availableLanguage": ["English", "Spanish"],
        "hoursAvailable": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "08:00",
          "closes": "17:00"
        }
      },
      {
        "@type": "ContactPoint", 
        "telephone": mainPhone,
        "contactType": "customer service",
        "email": supportEmail,
        "hoursAvailable": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "08:00",
          "closes": "17:00"
        }
      }
    ],
    "address": [
      {
        "@type": "PostalAddress",
        "addressCountry": "US",
        "addressRegion": "TX",
        "addressLocality": "Houston",
        "postalCode": "77001"
      },
      {
        "@type": "PostalAddress",
        "addressCountry": "US",
        "addressRegion": "FL", 
        "addressLocality": "Miami"
      },
      {
        "@type": "PostalAddress",
        "addressCountry": "US",
        "addressRegion": "CA",
        "addressLocality": "Los Angeles"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/alperrefrigerants",
      "https://www.linkedin.com/company/alperrefrigerants"
    ],
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteUrl}/products?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robotsContent || "index, follow"} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {themeColor && <meta name="theme-color" content={themeColor} />}
      {author && <meta name="author" content={author} />}
      <meta httpEquiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains" />
      
      {/* Preload critical resources */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={`${siteUrl}${canonicalUrl || ''}`} />
      
      {/* Hreflang Tag - Single language site, x-default only */}
      <link rel="alternate" hrefLang="x-default" href={`${siteUrl}${canonicalUrl || ''}`} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={`${siteUrl}${canonicalUrl || ''}`} />
      <meta property="og:image" content={ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`} />
      <meta property="og:site_name" content={businessName} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`} />
      
      {/* Business Information */}
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      
      {/* Structured Data */}
      {productStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(productStructuredData)}
        </script>
      )}
      
      <script type="application/ld+json">
        {JSON.stringify(organizationData)}
      </script>
      
      {breadcrumbStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbStructuredData)}
        </script>
      )}
      
      {faqStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(faqStructuredData)}
        </script>
      )}
      
      {/* Product Data */}
      {productData && productData.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": productData
          })}
        </script>
      )}
      
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOComponent;
