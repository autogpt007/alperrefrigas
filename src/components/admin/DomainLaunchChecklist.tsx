import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Globe,
  Mail,
  Search,
  ShoppingBag,
  Loader2,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PRIMARY_DOMAIN = 'alperrefrigerants.com';
const SITE_URL = `https://${PRIMARY_DOMAIN}`;
const STORAGE_KEY = 'domain-launch-checklist-v1';

interface ChecklistItem {
  id: string;
  title: string;
  detail: string;
  link?: { label: string; href: string };
}

interface ChecklistGroup {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  items: ChecklistItem[];
}

const GROUPS: ChecklistGroup[] = [
  {
    id: 'domain',
    title: '1. Connect the domains',
    icon: Globe,
    description: 'Point DNS at Lovable and make the new apex the primary domain.',
    items: [
      {
        id: 'domain-apex',
        title: `Add ${PRIMARY_DOMAIN} in Project Settings → Domains`,
        detail: 'Add an A record for @ pointing to 185.158.133.1 plus the _lovable TXT verification record.',
      },
      {
        id: 'domain-www',
        title: `Add www.${PRIMARY_DOMAIN} as a separate entry`,
        detail: 'www is never added automatically. Add an A record for www pointing to 185.158.133.1.',
      },
      {
        id: 'domain-primary',
        title: 'Set the new apex as Primary',
        detail: 'Everything else (www + the old domain) then 301-redirects to the primary domain.',
      },
      {
        id: 'domain-old',
        title: 'Keep the old domain connected',
        detail: 'Leaving alperrefrigas.com attached preserves the 301s so existing rankings and links carry over.',
      },
      {
        id: 'domain-ssl',
        title: 'Wait for status "Active" (SSL issued)',
        detail: 'DNS propagation can take up to 72 hours; SSL is provisioned automatically once verified.',
      },
      {
        id: 'domain-publish',
        title: 'Publish the app after DNS is live',
        detail: 'Frontend changes only go live on the new domain after a publish.',
      },
    ],
  },
  {
    id: 'resend',
    title: '2. Verify Resend',
    icon: Mail,
    description: 'Transactional email must send from the new domain or it will bounce.',
    items: [
      {
        id: 'resend-domain',
        title: `Add notify.${PRIMARY_DOMAIN} in Resend`,
        detail: 'This is the sending subdomain used by the transactional email function.',
        link: { label: 'Resend Domains', href: 'https://resend.com/domains' },
      },
      {
        id: 'resend-dns',
        title: 'Add the Resend DKIM, SPF and MX records',
        detail: 'Add them at the registrar for the new domain, then click Verify in Resend.',
      },
      {
        id: 'resend-check',
        title: 'Run the sender validation below',
        detail: `The check confirms the verified domain and that the sender is noreply@${PRIMARY_DOMAIN}.`,
      },
      {
        id: 'resend-test',
        title: 'Send a live test (order confirmation or KYC email)',
        detail: 'Confirm the From address and that links in the email use the new domain.',
      },
    ],
  },
  {
    id: 'search-console',
    title: '3. Google Search Console',
    icon: Search,
    description: 'Re-verify the property and resubmit the sitemap on the new domain.',
    items: [
      {
        id: 'gsc-property',
        title: `Add ${PRIMARY_DOMAIN} as a new property`,
        detail: 'Use a Domain property so both apex and www are covered.',
        link: { label: 'Search Console', href: 'https://search.google.com/search-console' },
      },
      {
        id: 'gsc-sitemap',
        title: `Submit ${SITE_URL}/sitemap.xml`,
        detail: 'The sitemap is regenerated automatically on every build against the active domain.',
      },
      {
        id: 'gsc-change',
        title: 'Run the Change of Address tool on the old property',
        detail: 'Settings → Change of address on alperrefrigas.com, pointing to the new property.',
      },
      {
        id: 'gsc-inspect',
        title: 'Inspect + request indexing for the homepage and top products',
        detail: 'Speeds up recrawl of the highest-value URLs.',
      },
    ],
  },
  {
    id: 'merchant',
    title: '4. Google Merchant Center',
    icon: ShoppingBag,
    description: 'Claim the new website URL and refresh the product feed.',
    items: [
      {
        id: 'gmc-claim',
        title: `Update the website URL to ${SITE_URL} and re-claim it`,
        detail: 'Business info → Website. Claiming fails while the old URL is still claimed elsewhere.',
        link: { label: 'Merchant Center', href: 'https://merchants.google.com' },
      },
      {
        id: 'gmc-feed',
        title: 'Update the feed URLs and re-fetch the feed',
        detail: 'Every product link and image link must use the new domain, otherwise items are disapproved.',
      },
      {
        id: 'gmc-review',
        title: 'Request review on any domain-mismatch issues',
        detail: 'Diagnostics → Request review once the claim and feed both use the new domain.',
      },
    ],
  },
];

const ALL_IDS = GROUPS.flatMap((g) => g.items.map((i) => i.id));

interface ResendCheck {
  expected: { sender_domain: string; from_domain: string; from_address: string };
  provider_reachable: boolean;
  status: 'verified' | 'pending' | 'missing' | 'error' | 'unknown';
  message: string;
  matched_domain?: { name: string; status: string; region: string | null } | null;
  domains?: Array<{ name: string; status: string }>;
}

const DomainLaunchChecklist: React.FC = () => {
  const { toast } = useToast();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [resend, setResend] = useState<ResendCheck | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [assets, setAssets] = useState<{ sitemap: string | null; robots: string | null }>({
    sitemap: null,
    robots: null,
  });
  const [assetsLoading, setAssetsLoading] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      /* ignore malformed state */
    }
  }, []);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const completed = ALL_IDS.filter((id) => checked[id]).length;

  const runResendCheck = useCallback(async () => {
    setResendLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-email-domain');
      if (error) throw error;
      setResend(data as ResendCheck);
    } catch (error) {
      console.error('Resend domain check failed:', error);
      toast({
        title: 'Sender check failed',
        description: 'Could not reach the validation function. Check the edge function logs.',
        variant: 'destructive',
      });
    } finally {
      setResendLoading(false);
    }
  }, [toast]);

  const checkAssets = useCallback(async () => {
    setAssetsLoading(true);
    try {
      const [sitemap, robots] = await Promise.all([
        fetch('/sitemap.xml').then((r) => (r.ok ? r.text() : null)).catch(() => null),
        fetch('/robots.txt').then((r) => (r.ok ? r.text() : null)).catch(() => null),
      ]);
      setAssets({ sitemap, robots });
    } finally {
      setAssetsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAssets();
  }, [checkAssets]);

  const assetStatus = useMemo(() => {
    const sitemapOk = !!assets.sitemap && assets.sitemap.includes(SITE_URL);
    const robotsOk = !!assets.robots && assets.robots.includes(`${SITE_URL}/sitemap.xml`);
    const urlCount = assets.sitemap ? (assets.sitemap.match(/<loc>/g) || []).length : 0;
    const staleDomain = !!assets.sitemap && assets.sitemap.includes('alperrefrigas.com');
    return { sitemapOk, robotsOk, urlCount, staleDomain };
  }, [assets]);

  const statusBadge = (ok: boolean, okLabel: string, badLabel: string) => (
    <Badge variant={ok ? 'default' : 'destructive'} className={ok ? 'bg-green-600 hover:bg-green-600' : ''}>
      {ok ? okLabel : badLabel}
    </Badge>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Domain Launch Checklist</h1>
        <p className="text-muted-foreground">
          Everything required to finish the move to {PRIMARY_DOMAIN}. Progress is saved in this browser.
        </p>
      </div>

      {/* Automated checks */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="h-4 w-4" /> Resend sender validation
            </CardTitle>
            <CardDescription>
              Confirms the verified sender domain and that transactional mail sends as noreply@{PRIMARY_DOMAIN}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={runResendCheck} disabled={resendLoading} size="sm">
              {resendLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Run check
            </Button>

            {resend && (
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {resend.status === 'verified' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  )}
                  <span className="font-medium capitalize">{resend.status}</span>
                </div>
                <p className="text-muted-foreground">{resend.message}</p>
                <Separator />
                <div className="grid grid-cols-[130px_1fr] gap-y-1">
                  <span className="text-muted-foreground">From address</span>
                  <span className="font-mono">{resend.expected.from_address}</span>
                  <span className="text-muted-foreground">Sending domain</span>
                  <span className="font-mono">{resend.expected.sender_domain}</span>
                </div>
                {!!resend.domains?.length && (
                  <div className="pt-2">
                    <p className="text-muted-foreground mb-1">Domains in Resend</p>
                    <ul className="space-y-1">
                      {resend.domains.map((d) => (
                        <li key={d.name} className="flex items-center justify-between">
                          <span className="font-mono text-xs">{d.name}</span>
                          <Badge variant={d.status === 'verified' ? 'default' : 'secondary'}>{d.status}</Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4" /> Sitemap &amp; robots
            </CardTitle>
            <CardDescription>
              Both files are regenerated automatically on every build against the active domain.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Button onClick={checkAssets} disabled={assetsLoading} size="sm" variant="outline">
              {assetsLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Re-check
            </Button>
            <div className="flex items-center justify-between">
              <span>sitemap.xml uses {PRIMARY_DOMAIN}</span>
              {statusBadge(assetStatus.sitemapOk, `${assetStatus.urlCount} URLs`, 'Not found')}
            </div>
            <div className="flex items-center justify-between">
              <span>robots.txt points at the sitemap</span>
              {statusBadge(assetStatus.robotsOk, 'OK', 'Missing')}
            </div>
            {assetStatus.staleDomain && (
              <p className="text-destructive">
                The sitemap still contains alperrefrigas.com URLs — rebuild/publish to regenerate it.
              </p>
            )}
            <div className="flex gap-3 pt-1">
              <a className="text-primary underline" href="/sitemap.xml" target="_blank" rel="noreferrer">
                View sitemap
              </a>
              <a className="text-primary underline" href="/robots.txt" target="_blank" rel="noreferrer">
                View robots.txt
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manual checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <span>Migration steps</span>
            <Badge variant="secondary">
              {completed} / {ALL_IDS.length} complete
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {GROUPS.map((group) => {
            const Icon = group.icon;
            const groupDone = group.items.every((i) => checked[i.id]);
            return (
              <div key={group.id}>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">{group.title}</h3>
                  {groupDone && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{group.description}</p>
                <ul className="space-y-3">
                  {group.items.map((item) => (
                    <li key={item.id} className="flex gap-3">
                      <Checkbox
                        id={item.id}
                        checked={!!checked[item.id]}
                        onCheckedChange={() => toggle(item.id)}
                        className="mt-1"
                      />
                      <div className="text-sm">
                        <label
                          htmlFor={item.id}
                          className={`font-medium cursor-pointer ${checked[item.id] ? 'line-through text-muted-foreground' : ''}`}
                        >
                          {item.title}
                        </label>
                        <p className="text-muted-foreground">{item.detail}</p>
                        {item.link && (
                          <a
                            href={item.link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-primary underline mt-1"
                          >
                            {item.link.label}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                <Separator className="mt-5" />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default DomainLaunchChecklist;
