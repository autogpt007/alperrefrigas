// Centralized slug generation function for consistent URL creation
export const createProductSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading and trailing hyphens
    .trim();
};

// Function to match product by slug
export const findProductBySlug = (products: any[], slug: string) => {
  return products.find(product => createProductSlug(product.name) === slug);
};