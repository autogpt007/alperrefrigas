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
  { value: 'about', label: 'About Us Page' },
  { value: 'home', label: 'Home Page' },
  { value: 'contact', label: 'Contact Page' },
  { value: 'products', label: 'Products Page' }
];