
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
  ogImage = '/placeholder.svg',
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
  productData
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

  // Enhanced Organization structured data with LocalBusiness
  const organizationData = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "name": "Alper Refrigerant",
    "alternateName": "Alper Refrigerants",
    "url": siteUrl,
    "description": "Professional wholesale refrigerant distributor specializing in HFC, HFO, and natural refrigerants for HVAC, automotive, and industrial applications. EPA certified with competitive bulk pricing.",
    "foundingDate": "2020",
    "serviceArea": {
      "@type": "Country",
      "name": "United States"
    },
    "areaServed": ["Texas", "Florida", "California", "United States"],
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
        "telephone": "+1-210-939-1115",
        "contactType": "sales",
        "email": "sales@alperrefrigas.com",
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
        "telephone": "+1-210-939-1115",
        "contactType": "customer service",
        "email": "support@alperrefrigas.com",
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
        "addressLocality": "Texas Distribution Center"
      },
      {
        "@type": "PostalAddress",
        "addressCountry": "US",
        "addressRegion": "FL", 
        "addressLocality": "Florida Distribution Center"
      },
      {
        "@type": "PostalAddress",
        "addressCountry": "US",
        "addressRegion": "CA",
        "addressLocality": "California Distribution Center"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/frigidflow",
      "https://www.linkedin.com/company/frigidflow"
    ],
    "keywords": "refrigerant, wholesale, EPA approved, HVAC, R134a, R410A, R404A, R22, bulk refrigerant, industrial refrigerant, commercial refrigerant",
    "slogan": "Professional Refrigerant Solutions with Bulk Pricing and Fast Shipping"
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
