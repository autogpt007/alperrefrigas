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
    value: 'about', 
    label: 'About Us Page',
    description: 'Hero image shown at the top of the About Us page',
    recommendedSize: '1920x1080px (16:9)',
    usage: 'Full-width background behind company introduction'
  },
  { 
    value: 'home', 
    label: 'Home Page',
    description: 'Main hero image for the homepage',
    recommendedSize: '1920x1080px (16:9)',
    usage: 'Primary hero section background'
  },
  { 
    value: 'contact', 
    label: 'Contact Page',
    description: 'Background image for contact section',
    recommendedSize: '1920x1080px (16:9)',
    usage: 'Contact page hero background'
  },
  { 
    value: 'products', 
    label: 'Products Page',
    description: 'Hero image for product catalog',
    recommendedSize: '1920x1080px (16:9)',
    usage: 'Product page header background'
  }
];

export interface PageOption {
  value: string;
  label: string;
  description: string;
  recommendedSize: string;
  usage: string;
}