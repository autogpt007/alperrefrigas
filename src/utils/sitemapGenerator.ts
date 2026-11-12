// Dynamic sitemap generator for enhanced SEO
import { Product } from '@/contexts/ProductsContext';
import { createProductSlug } from '@/lib/slugs';
import { SITE_URL } from '@/config/site';

export interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export const generateSitemap = (products: Product[]): SitemapEntry[] => {
  const baseUrl = SITE_URL;
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  const staticPages: SitemapEntry[] = [
    // Homepage
    {
      url: `${baseUrl}/`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 1.0
    },
    
    // Main Pages
    {
      url: `${baseUrl}/about`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/products`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/products/refrigerants`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/products/accessories`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/contact`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      url: `${baseUrl}/rfq`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    },
    
    // Product Categories
    {
      url: `${baseUrl}/products/category/hfc`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/products/category/hfo`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/products/category/natural`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/products/category/automotive`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/products/category/commercial`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/products/category/industrial`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    },
    
    // Service Pages
    {
      url: `${baseUrl}/certifications`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.6
    },
    {
      url: `${baseUrl}/compliance`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      url: `${baseUrl}/shipping-policy`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.6
    },
    {
      url: `${baseUrl}/support`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.7
    },
    {
      url: `${baseUrl}/faq`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.6
    },
    
    // Content Pages
    {
      url: `${baseUrl}/blog`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.7
    },
    {
      url: `${baseUrl}/testimonials`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.6
    },
    
    // Legal Pages
    {
      url: `${baseUrl}/privacy`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      url: `${baseUrl}/terms`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      url: `${baseUrl}/cookies`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      url: `${baseUrl}/sitemap`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.3
    }
  ];

  // Generate individual product pages
  const productPages: SitemapEntry[] = products.map(product => ({
    url: `${baseUrl}/products/${createProductSlug(product.name)}`,
    lastmod: currentDate, // Use current date since we don't track product update timestamps
    changefreq: 'weekly' as const,
    priority: product.product_type === 'refrigerant' ? 0.7 : 0.6
  }));

  return [...staticPages, ...productPages];
};

export const generateSitemapXML = (entries: SitemapEntry[]): string => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n\n';
  const urlsetClose = '</urlset>';
  
  const urls = entries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n\n');

  return xmlHeader + urlsetOpen + urls + '\n\n' + urlsetClose;
};

// Generate robots.txt content with enhanced AI crawler support
export const generateRobotsTxt = (): string => {
  return `User-agent: *
Allow: /

# Allow search engine crawlers
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

# Allow AI crawlers for better discoverability
User-agent: GPTBot
Allow: /

User-agent: OpenAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: CCBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-Web
Allow: /

# Disallow admin areas
Disallow: /admin
Disallow: /admin/*

# Disallow authentication pages
Disallow: /auth
Disallow: /admin-auth

# Sitemap location
Sitemap: ${SITE_URL}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1`;
};