import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { CRAWLER_AGENTS, isPublicDiscoveryPath, pageLastmod, renderCrawlerPolicy } from '../lib/crawlerPolicy';

describe('public search and AI discovery boundary', () => {
  it.each(['OAI-SearchBot', 'ChatGPT-User', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Googlebot', 'Bingbot'])('includes the current %s agent in the shared rule group', agent => {
    const groups = renderCrawlerPolicy('https://alperrefrigerants.com').split('\n\n');
    const group = groups.find(value => value.includes(`User-agent: ${agent}\n`));
    expect(group).toContain('Allow: /\n');
    expect(group).toContain('Disallow: /admin\n');
    expect(group).toContain('Disallow: /kyc\n');
    expect(group).toContain('Disallow: /checkout\n');
  });

  it.each(['/admin/orders', '/admin-auth', '/kyc/private-token', '/account', '/checkout', '/quote-confirmation?quote=123', '/rfq', '/auth/callback', '/webhooks/order'])('excludes private or utility URL %s', path => {
    expect(isPublicDiscoveryPath(path)).toBe(false);
  });

  it.each(['/products/r-134a-refrigerant-gas-30lb', '/guides/r-454b-handling', '/blog/ptac-units-buying-guide', '/shipping-policy'])('permits public URL %s', path => {
    expect(isPublicDiscoveryPath(path)).toBe(true);
  });

  it('keeps every explicit crawler in the same policy group', () => {
    const policy = renderCrawlerPolicy('https://alperrefrigerants.com');
    const ruleStart = policy.indexOf('Allow: /');
    for (const agent of CRAWLER_AGENTS) {
      expect(policy.indexOf(`User-agent: ${agent}\n`)).toBeLessThan(ruleStart);
    }
  });

  it('lists only public canonical destinations in the AI directory', () => {
    const directory = readFileSync('public/llms.txt', 'utf8');
    const urls = [...directory.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(match => new URL(match[1]));
    expect(urls.length).toBeGreaterThan(20);
    for (const url of urls) {
      expect(url.origin).toBe('https://alperrefrigerants.com');
      expect(isPublicDiscoveryPath(url.pathname)).toBe(true);
    }
  });
});

describe('sitemap modification dates', () => {
  it('does not fabricate a date when the page timestamp is absent', () => {
    expect(pageLastmod()).toBeUndefined();
    expect(pageLastmod(null)).toBeUndefined();
    expect(pageLastmod('invalid')).toBeUndefined();
  });

  it('preserves a page-specific update date', () => {
    expect(pageLastmod('2026-11-02T08:30:00Z')).toBe('2026-11-02');
  });
});