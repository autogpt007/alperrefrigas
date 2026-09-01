import React from 'react';
import { Helmet } from 'react-helmet-async';

interface BlogPost {
  id: string;
  title: string;
  body: string;
  slug: string;
  excerpt: string;
  banner_image_url?: string;
  featured_image_url?: string;
  created_at: string;
  updated_at: string;
  reading_time?: number;
  tags?: string[];
}

interface BlogSEOProps {
  post: BlogPost;
  canonical?: string;
}

const BlogSEO: React.FC<BlogSEOProps> = ({ post, canonical }) => {
  // Extract keywords from content and tags
  const extractKeywords = (): string => {
    const keywords = new Set<string>();
    
    // Add tags as keywords
    if (post.tags) {
      post.tags.forEach(tag => keywords.add(tag.toLowerCase()));
    }

    // Extract refrigerant-related keywords from content
    const refrigerantTerms = [
      'refrigerant', 'r-410a', 'r-134a', 'r-22', 'hvac', 'cooling', 
      'air conditioning', 'epa', 'certification', 'freon', 'coolant'
    ];
    
    const contentLower = (post.title + ' ' + post.excerpt + ' ' + post.body).toLowerCase();
    refrigerantTerms.forEach(term => {
      if (contentLower.includes(term)) {
        keywords.add(term);
      }
    });

    return Array.from(keywords).slice(0, 10).join(', ');
  };

  // Create structured data for article
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt || post.body.substring(0, 160).replace(/<[^>]*>/g, ''),
    "image": post.banner_image_url || post.featured_image_url || "https://alperrefrigerants.com/logo.png",
    "author": {
      "@type": "Organization",
      "name": "North American Refrigerants",
      "url": "https://alperrefrigerants.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "North American Refrigerants",
      "logo": {
        "@type": "ImageObject",
        "url": "https://alperrefrigerants.com/logo.png"
      }
    },
    "datePublished": post.created_at,
    "dateModified": post.updated_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonical || `https://alperrefrigerants.com/blog/${post.slug}`
    },
    "articleSection": "Refrigerant Industry",
    "keywords": extractKeywords(),
    "wordCount": post.body.replace(/<[^>]*>/g, '').split(' ').length,
    "timeRequired": `PT${post.reading_time || 5}M`,
    "about": {
      "@type": "Thing",
      "name": "Refrigerants",
      "description": "Industrial refrigerants and HVAC solutions"
    }
  };

  // Create breadcrumb structured data
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://alperrefrigerants.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "News",
        "item": "https://alperrefrigerants.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": canonical || `https://alperrefrigerants.com/blog/${post.slug}`
      }
    ]
  };

  const cleanExcerpt = post.excerpt || post.body.substring(0, 160).replace(/<[^>]*>/g, '');
  const currentUrl = canonical || `https://alperrefrigerants.com/blog/${post.slug}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{post.title} | North American Refrigerants - Expert Refrigerant Solutions</title>
      <meta name="description" content={cleanExcerpt} />
      <meta name="keywords" content={extractKeywords()} />
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={cleanExcerpt} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="North American Refrigerants" />
      <meta property="og:locale" content="en_US" />
      {(post.banner_image_url || post.featured_image_url) && (
        <>
          <meta property="og:image" content={post.banner_image_url || post.featured_image_url} />
          <meta property="og:image:alt" content={post.title} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </>
      )}

      {/* Article Meta Tags */}
      <meta property="article:published_time" content={post.created_at} />
      <meta property="article:modified_time" content={post.updated_at} />
      <meta property="article:author" content="North American Refrigerants" />
      <meta property="article:section" content="Refrigerant Industry" />
      {post.tags && post.tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={post.title} />
      <meta name="twitter:description" content={cleanExcerpt} />
      {(post.banner_image_url || post.featured_image_url) && (
        <meta name="twitter:image" content={post.banner_image_url || post.featured_image_url} />
      )}

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="author" content="North American Refrigerants" />
      <meta name="article:opinion" content="false" />
      <meta name="news_keywords" content={extractKeywords()} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(articleStructuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbStructuredData)}
      </script>
    </Helmet>
  );
};

export default BlogSEO;