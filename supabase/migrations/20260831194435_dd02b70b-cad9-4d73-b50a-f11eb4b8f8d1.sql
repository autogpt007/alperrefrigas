alter table public.contact_info
  add column if not exists description text null,
  add column if not exists order_index numeric not null default 0;

alter table public.coupons
  add column if not exists title text not null default '',
  add column if not exists description text null,
  add column if not exists minimum_order_amount numeric null default 0,
  add column if not exists current_uses numeric null default 0,
  add column if not exists start_date timestamp with time zone null,
  add column if not exists end_date timestamp with time zone null;

alter table public.coupons alter column discount_type set default 'percentage';

alter table public.exchange_rates
  add column if not exists currency_name text not null default '',
  add column if not exists currency_symbol text not null default '',
  add column if not exists flag_emoji text null,
  add column if not exists country_codes text[] not null default '{}',
  add column if not exists is_active boolean null default true,
  add column if not exists last_updated timestamp with time zone null default now();