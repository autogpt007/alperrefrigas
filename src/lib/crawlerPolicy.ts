// Search access is separate from model-training access. Existing training
// crawler permissions are retained; every agent gets the same public boundary.
export const CRAWLER_AGENTS = [
  '*', 'Googlebot', 'Bingbot', 'facebookexternalhit', 'Twitterbot',
  'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Perplexity-User',
  'Claude-SearchBot', 'Claude-User', 'GPTBot', 'CCBot', 'anthropic-ai', 'ClaudeBot',
] as const;

export const PRIVATE_PATH_PREFIXES = [
  '/admin', '/account', '/checkout', '/cart', '/order-confirmation',
  '/quote-confirmation', '/rfq', '/kyc', '/crypto-payment', '/unsubscribe', '/health',
  '/auth', '/login', '/signup', '/logout', '/reset-password', '/verify',
  '/oauth', '/callback', '/customer-portal', '/api', '/webhooks',
  '/staff', '/internal', '/ops', '/console', '/manage', '/dashboard',
  '/lovable', '/not-found',
] as const;

export function isPublicDiscoveryPath(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('//') &&
    !PRIVATE_PATH_PREFIXES.some(prefix => path.toLowerCase().startsWith(prefix));
}

export function renderCrawlerPolicy(siteUrl: string): string {
  return [
    '# Public search and AI access; robots.txt is not access control.',
    ...CRAWLER_AGENTS.map(agent => `User-agent: ${agent}`),
    'Allow: /',
    ...PRIVATE_PATH_PREFIXES.map(prefix => `Disallow: ${prefix}`),
    'Crawl-delay: 1',
    '',
    `Sitemap: ${siteUrl.replace(/\/+$/, '')}/sitemap.xml`,
    '',
  ].join('\n');
}

// Existing public routes omitted by older sitemap generators.
export const ADDITIONAL_DISCOVERY_PATHS = [
  '/products/air-conditioners', '/products/heating-heat-pumps', '/products/hvac-tools',
  '/products/r-410a', '/products/r-32', '/products/ptac-units',
  '/brands/mrcool', '/brands/senville', '/guides',
  '/guides/r-454b-vs-r-32', '/guides/who-can-buy-refrigerant', '/guides/r-454b-handling',
] as const;

// Never substitute a generation/build date for a page's actual change date.
export function pageLastmod(timestamp?: string | null): string | undefined {
  if (!timestamp || !/^\d{4}-\d{2}-\d{2}(?:T|$)/.test(timestamp)) return undefined;
  const parsed = new Date(timestamp);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString().split('T')[0];
}