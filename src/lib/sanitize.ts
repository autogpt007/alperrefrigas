import DOMPurify from 'isomorphic-dompurify';

// Configure DOMPurify with safe defaults
const defaultConfig = {
  ALLOWED_TAGS: [
    'a', 'b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code',
    'span', 'div', 'img', 'figure', 'figcaption', 'table', 'thead', 
    'tbody', 'tr', 'th', 'td', 'hr', 'sup', 'sub', 'mark'
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel', 'class', 'id', 'style', 'src', 'alt', 
    'title', 'width', 'height', 'loading'
  ],
  ALLOW_DATA_ATTR: true,
  ADD_ATTR: ['target', 'rel'],
};

// Extended config that allows iframes (for embedded content)
const extendedConfig = {
  ...defaultConfig,
  ALLOWED_TAGS: [...defaultConfig.ALLOWED_TAGS, 'iframe'],
  ALLOWED_ATTR: [...defaultConfig.ALLOWED_ATTR, 'frameborder', 'allowfullscreen', 'allow'],
  ADD_TAGS: ['iframe'],
};

// Simple config for inline text (banners, etc.)
const inlineConfig = {
  ALLOWED_TAGS: ['strong', 'em', 'b', 'i', 'br', 'span', 'a'],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
};

/**
 * Sanitize HTML content with default safe config
 */
export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, defaultConfig) as string;
};

/**
 * Sanitize HTML content with extended config (allows iframes)
 */
export const sanitizeHTMLExtended = (html: string): string => {
  return DOMPurify.sanitize(html, extendedConfig) as string;
};

/**
 * Sanitize inline HTML (for banners, simple text)
 */
export const sanitizeInlineHTML = (html: string): string => {
  return DOMPurify.sanitize(html, inlineConfig) as string;
};

/**
 * Sanitize HTML with custom options
 */
export const sanitizeHTMLCustom = (html: string, options: Record<string, unknown>): string => {
  return DOMPurify.sanitize(html, { ...defaultConfig, ...options }) as string;
};

export default DOMPurify;
