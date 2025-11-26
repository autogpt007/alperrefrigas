export type BlockType = 'hero' | 'features' | 'cta' | 'text' | 'image' | 'video' | 'testimonials' | 'products';

export interface PageBlock {
  id: string;
  page_slug: string;
  section_key: string;
  block_type: BlockType;
  content: Record<string, any>;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HeroBlockContent {
  title: string;
  subtitle: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
}

export interface FeaturesBlockContent {
  title: string;
  items: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface CtaBlockContent {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface TextBlockContent {
  title?: string;
  content: string;
  alignment?: 'left' | 'center' | 'right';
}

export interface ImageBlockContent {
  url: string;
  alt: string;
  caption?: string;
}

export interface VideoBlockContent {
  url: string;
  thumbnail?: string;
  title?: string;
}

export interface TestimonialsBlockContent {
  title: string;
  testimonialIds?: string[];
}

export interface ProductsBlockContent {
  title: string;
  productIds?: string[];
  featured?: boolean;
}

export const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  hero: 'Hero Section',
  features: 'Features Grid',
  cta: 'Call to Action',
  text: 'Text Content',
  image: 'Image',
  video: 'Video',
  testimonials: 'Testimonials',
  products: 'Products Showcase'
};

export const AVAILABLE_PAGES = [
  { value: 'home', label: 'Home Page' },
  { value: 'about', label: 'About Us' },
  { value: 'products', label: 'Products' },
  { value: 'contact', label: 'Contact Us' },
  { value: 'certifications', label: 'Certifications' },
  { value: 'testimonials', label: 'Testimonials' }
] as const;
