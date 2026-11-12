// Dynamic sitemap generator for enhanced SEO
import { Product } from '@/contexts/ProductsContext';
import { createProductSlug } from '@/lib/slugs';
import { SITE_URL } from '@/config/site';
import { ADDITIONAL_DISCOVERY_PATHS, isPublicDiscoveryPath, renderCrawlerPolicy } from '@/lib/crawlerPolicy';

export interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export const generateSitemap = (products: Product[]): SitemapEntry[] => {
  const baseUrl = SITE_URL;
  
  const staticPages: SitemapEntry[] = [
    // Homepage
    {
      url: `${baseUrl}/`,
      changefreq: 'daily',
      priority: 1.0
    },
    
    // Main Pages
    {
      url: `${baseUrl}/about`,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/products`,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/products/refrigerants`,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/products/accessories`,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/contact`,
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      url: `${baseUrl}/rfq`,
      changefreq: 'weekly',
      priority: 0.8
    },
    
    // Product Categories
    {
      url: `${baseUrl}/products/category/hfc`,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/products/category/hfo`,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/products/category/natural`,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/products/category/automotive`,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/products/category/commercial`,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/products/category/industrial`,
      changefreq: 'weekly',
      priority: 0.8
    },
    
    // Service Pages
    {
      url: `${baseUrl}/certifications`,
      changefreq: 'monthly',
      priority: 0.6
    },
    {
      url: `${baseUrl}/compliance`,
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      url: `${baseUrl}/shipping-policy`,
      changefreq: 'monthly',
      priority: 0.6
    },
    {
      url: `${baseUrl}/support`,
      changefreq: 'weekly',
      priority: 0.7
    },
    {
      url: `${baseUrl}/faq`,
      changefreq: 'monthly',
      priority: 0.6
    },
    
    // Content Pages
    {
      url: `${baseUrl}/blog`,
      changefreq: 'weekly',
      priority: 0.7
    },
    {
      url: `${baseUrl}/testimonials`,
      changefreq: 'weekly',
      priority: 0.6
    },
    
    // Legal Pages
    {
      url: `${baseUrl}/privacy`,
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      url: `${baseUrl}/terms`,
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      url: `${baseUrl}/refund-policy`,
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      url: `${baseUrl}/cookies`,
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      url: `${baseUrl}/sitemap`,
      changefreq: 'monthly',
      priority: 0.3
    }
  ];

  // Generate individual product pages
  const productPages: SitemapEntry[] = products.map(product => ({
    url: `${baseUrl}/products/${createProductSlug(product.name)}`,
    changefreq: 'weekly' as const,
    priority: product.product_type === 'refrigerant' ? 0.7 : 0.6
  }));

  const additionalPages: SitemapEntry[] = ADDITIONAL_DISCOVERY_PATHS.map(path => ({ url: `${baseUrl}${path}`, changefreq: 'weekly', priority: 0.7 }));
  return [...new Map([...staticPages, ...additionalPages, ...productPages]
    .filter(entry => isPublicDiscoveryPath(new URL(entry.url).pathname))
    .map(entry => [entry.url, entry])).values()];
};

export const generateSitemapXML = (entries: SitemapEntry[]): string => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n\n';
  const urlsetClose = '</urlset>';
  
  const urls = entries.map(entry => `  <url>
    <loc>${entry.url}</loc>
${entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>\n` : ''}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n\n');

  return xmlHeader + urlsetOpen + urls + '\n\n' + urlsetClose;
};

// Generate robots.txt content with enhanced AI crawler support
export const generateRobotsTxt = (): string => renderCrawlerPolicy(SITE_URL);
