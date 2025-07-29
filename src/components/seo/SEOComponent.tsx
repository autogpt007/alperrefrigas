
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: any;
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
  };
}

const SEOComponent: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = '/placeholder.svg',
  ogType = 'website',
  structuredData,
  product
}) => {
  const siteUrl = 'https://alperrefrigas.com';
  const fullTitle = title.includes('Alper') ? title : `${title} | Alper Refrigerant - Professional Refrigerant Distributor`;
  
  // Generate product structured data for Google Merchant Center
  const productStructuredData = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "sku": product.sku,
    "gtin": product.gtin,
    "image": `${siteUrl}${product.image}`,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": product.currency,
      "availability": `https://schema.org/${product.availability === 'in_stock' ? 'InStock' : 'OutOfStock'}`,
      "seller": {
        "@type": "Organization",
        "name": "FrigidFlow"
      }
    }
  } : null;

  // Organization structured data
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Alper Refrigerant",
    "alternateName": "Alper Refrigerants",
    "url": siteUrl,
    "description": "Professional wholesale refrigerant distributor specializing in HFC, HFO, and natural refrigerants for HVAC, automotive, and industrial applications. EPA certified with competitive bulk pricing.",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+1-210-939-1115",
        "contactType": "sales",
        "email": "sales@alperrefrigas.com",
        "availableLanguage": ["English", "Spanish"]
      },
      {
        "@type": "ContactPoint", 
        "telephone": "+1-210-939-1115",
        "contactType": "customer service",
        "email": "support@alperrefrigas.com"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US",
      "addressRegion": ["TX", "FL", "CA"],
      "addressLocality": "Multiple Distribution Centers"
    },
    "sameAs": [
      "https://www.facebook.com/frigidflow",
      "https://www.linkedin.com/company/frigidflow"
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains" />
      
      {/* Preload critical resources */}
      <link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={`${siteUrl}${canonicalUrl || ''}`} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={`${siteUrl}${canonicalUrl || ''}`} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:site_name" content="FrigidFlow" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      
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
      
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOComponent;
