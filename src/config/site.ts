/**
 * Single source of truth for the site's public domain.
 *
 * Override at build time with VITE_SITE_URL; the fallback is the primary
 * production domain. scripts/generate-redirects.ts validates that no other
 * absolute URL in the app points at a different domain.
 */

const RAW_SITE_URL =
  (import.meta.env?.VITE_SITE_URL as string | undefined) || 'https://alperrefrigerants.com';

/** Absolute site origin, no trailing slash. e.g. https://alperrefrigerants.com */
export const SITE_URL = RAW_SITE_URL.replace(/\/+$/, '');

/** Bare host, no protocol. e.g. alperrefrigerants.com */
export const SITE_DOMAIN = SITE_URL.replace(/^https?:\/\//, '');

/** Builds an absolute URL from a site-relative path. */
export const absoluteUrl = (path = '/'): string =>
  path.startsWith('http') ? path : `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
