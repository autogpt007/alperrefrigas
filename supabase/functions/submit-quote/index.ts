import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@4';

const schema = z.object({
  customer_name: z.string().trim().min(1).max(100), customer_email: z.string().trim().email().max(255),
  company_name: z.string().trim().min(1).max(200), phone: z.string().trim().max(40).optional(),
  shipping_address: z.string().trim().max(500).optional(), notes: z.string().trim().max(2000).optional(),
  items: z.array(z.object({ product_id: z.string().uuid().nullable().optional(), product_name: z.string().trim().min(1).max(300), quantity: z.number().int().min(1).max(100000), packaging: z.string().max(120).optional() })).min(1).max(100),
  formToken: z.string().max(500), website: z.string().max(200).default(''),
});
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
const hex = (buffer: ArrayBuffer) => Array.from(new Uint8Array(buffer)).map(n => n.toString(16).padStart(2, '0')).join('');

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return reply({ error: 'Method not allowed' }, 405);
  try {
    const url = Deno.env.get('SUPABASE_URL'); const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !key) return reply({ error: 'Service unavailable' }, 503);
    const origin = req.headers.get('origin') || '';
    if (origin && !/^https:\/\/([a-z0-9-]+\.)?(alperrefrigerants\.com|alperrefrigas\.com|lovable\.app)$/.test(origin) && origin !== 'http://localhost:8080') return reply({ error: 'Invalid origin' }, 403);
    const signingKey = await crypto.subtle.importKey('raw', new TextEncoder().encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const sign = async (value: string) => hex(await crypto.subtle.sign('HMAC', signingKey, new TextEncoder().encode(value)));
    const body = await req.json();
    if (body.action === 'challenge') {
      const value = `${Date.now()}.${crypto.randomUUID()}`;
      return reply({ formToken: `${value}.${await sign(`${value}|${origin}`)}` });
    }
    const parsed = schema.safeParse(body);
    if (!parsed.success) return reply({ error: 'Please check your contact information and quantities.' }, 400);
    const { formToken, website, ...payload } = parsed.data;
    const parts = formToken.split('.'); const value = parts.slice(0, 2).join('.'); const age = Date.now() - Number(parts[0]);
    if (website || parts.length !== 3 || age < 1500 || age > 3600000 || parts[2] !== await sign(`${value}|${origin}`)) return reply({ error: 'Please reopen the form and try again.' }, 400);
    const admin = createClient(url, key, { auth: { persistSession: false } });
    let requester: string | null = null;
    const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
    if (token) { const { data } = await admin.auth.getUser(token); requester = data.user?.id ?? null; }
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
    const ipHash = await sign(`quote-ip:${ip}`);
    const { data, error } = await admin.rpc('submit_buyer_quote', { payload, requester, ip_hash_value: ipHash });
    if (error) throw error;
    if (data?.rate_limited) return reply({ error: 'Too many requests. Please wait five minutes.' }, 429);
    const results = await Promise.all([
      admin.functions.invoke('send-transactional-email', { body: { templateName: 'quote-confirmation', recipientEmail: payload.customer_email, idempotencyKey: `quote-confirm-${data.id}`, templateData: { customerName: payload.customer_name, quoteNumber: data.quote_number } } }),
      admin.functions.invoke('send-transactional-email', { body: { templateName: 'quote-owner-notification', idempotencyKey: `quote-owner-${data.id}`, templateData: { quoteNumber: data.quote_number, companyName: payload.company_name, reviewUrl: 'https://alperrefrigerants.com/admin/quotes' } } }),
    ]);
    const notificationsQueued = results.every(result => !result.error && result.data?.success === true);
    if (!notificationsQueued) console.error('Quote saved; email notification not queued', { quoteId: data.id });
    return reply({ success: true, id: data.id, quote_number: data.quote_number, notificationsQueued });
  } catch { return reply({ error: 'Unable to submit your request. Please try again.' }, 500); }
});