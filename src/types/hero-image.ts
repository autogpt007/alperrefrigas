export interface HeroImage {
  id: string;
  page_name: string;
  image_url: string;
  alt_text: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HeroImageFormData {
  page_name: string;
  image_url: string;
  alt_text: string;
  is_active: boolean;
}

export const PAGE_OPTIONS = [
  { 
    value: 'home', 
    label: 'Homepage - Main Hero Carousel',
    description: 'Primary rotating hero banners (supports multiple images with 8-second timing)',
    recommendedSize: '1920x1080px (EXACT SIZE REQUIRED)',
    usage: 'Main hero section at top of homepage. Multiple images rotate automatically. Upload multiple images for this section and they will cycle through.'
  },
  { 
    value: 'home-gallery', 
    label: 'Homepage - Product Gallery Section',
    description: 'Product showcase gallery grid (supports multiple images)',
    recommendedSize: '600x400px (EXACT SIZE REQUIRED)',
    usage: 'Grid display below hero section showing featured products/services in a 3-column layout'
  },
  { 
    value: 'about', 
    label: 'About Us Page - Header Banner',
    description: 'Single large header image for About Us page',
    recommendedSize: '1920x600px (EXACT SIZE REQUIRED)',
    usage: 'Full-width background banner displayed immediately at the top of About Us page behind the page title'
  },
  { 
    value: 'about-team', 
    label: 'About Us Page - Team Section Background',
    description: 'Background image behind team member cards',
    recommendedSize: '1920x800px (EXACT SIZE REQUIRED)',
    usage: 'Background image that appears behind the team member grid section on About Us page'
  },
  { 
    value: 'contact', 
    label: 'Contact Page - Header Banner',
    description: 'Header background for contact page',
    recommendedSize: '1920x600px (EXACT SIZE REQUIRED)',
    usage: 'Header section background on contact page, appears behind contact form and information'
  },
  { 
    value: 'products', 
    label: 'Product Catalog - Main Header',
    description: 'Header banner for main product catalog page',
    recommendedSize: '1920x600px (EXACT SIZE REQUIRED)',
    usage: 'Header background for the main product catalog page listing all products'
  },
  { 
    value: 'products-category', 
    label: 'Product Categories - Individual Headers',
    description: 'Category-specific banners (supports multiple images for different categories)',
    recommendedSize: '1920x400px (EXACT SIZE REQUIRED)',
    usage: 'Header banners for specific product category pages (R-410A, R-134a, etc.). Upload separate images for each category.'
  },
  { 
    value: 'blog', 
    label: 'Blog/News Page - Header Banner',
    description: 'Header background for blog/news main page',
    recommendedSize: '1920x600px (EXACT SIZE REQUIRED)',
    usage: 'Header section background for the main blog/news listing page'
  },
  { 
    value: 'blog-featured', 
    label: 'Blog Posts - Featured Images',
    description: 'Individual blog post featured images (supports multiple images)',
    recommendedSize: '1200x630px (EXACT SIZE REQUIRED)',
    usage: 'Featured images that appear at the top of individual blog posts and in social media sharing'
  }
];

export interface PageOption {
  value: string;
  label: string;
  description: string;
  recommendedSize: string;
  usage: string;
}