create table public.contact_submissions (
  company_name text null,
  created_at timestamp with time zone not null default now(),
  email text not null,
  id uuid not null default gen_random_uuid() primary key,
  message text not null,
  name text not null,
  status text null default 'pending',
  subject text null,
  whatsapp_phone text null
);

create table public.security_audit (
  action text not null,
  created_at timestamp with time zone null default now(),
  details jsonb null,
  id uuid not null default gen_random_uuid() primary key,
  ip_address text not null default 'unknown',
  target_user_id uuid null references auth.users(id) on delete set null,
  user_agent text null,
  user_id uuid null references auth.users(id) on delete set null
);

create table public.security_audit_log (
  created_at timestamp with time zone not null default now(),
  details jsonb null,
  event_type text not null,
  id uuid not null default gen_random_uuid() primary key,
  ip_address text null,
  risk_level text not null default 'low',
  user_agent text null,
  user_email text null,
  user_id uuid null references auth.users(id) on delete set null
);

create table public.ad_campaigns (
  brief_json jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone not null default now(),
  created_by uuid null,
  goal text null,
  id uuid not null default gen_random_uuid() primary key,
  name text not null,
  product_type text null,
  status text not null default 'pending',
  updated_at timestamp with time zone not null default now()
);

create table public.ad_generations (
  ai_response jsonb not null default '{}'::jsonb,
  campaign_id uuid not null references public.ad_campaigns(id) on delete cascade,
  compliance_report jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone not null default now(),
  id uuid not null default gen_random_uuid() primary key,
  model text null,
  prompt_payload jsonb not null default '{}'::jsonb
);

create table public.ad_assets (
  ad_group text null,
  asset_type text not null,
  campaign_id uuid not null references public.ad_campaigns(id) on delete cascade,
  compliance_status text not null default 'pending',
  created_at timestamp with time zone not null default now(),
  id uuid not null default gen_random_uuid() primary key,
  payload_json jsonb not null default '{}'::jsonb
);

create table public.asic_miners (
  available_units numeric not null default 0,
  brand text not null,
  created_at timestamp with time zone not null default now(),
  daily_earnings_btc numeric not null default 0,
  efficiency numeric not null default 0,
  hashrate_th numeric not null default 0,
  id uuid not null default gen_random_uuid() primary key,
  image_url text null,
  location text not null default '',
  min_purchase_fraction numeric not null default 1,
  model text not null default '',
  power_watts numeric not null default 0,
  price_per_unit numeric not null default 0,
  status text not null default 'active',
  total_units numeric not null default 0,
  updated_at timestamp with time zone not null default now()
);

create table public.miner_ownerships (
  created_at timestamp with time zone not null default now(),
  fraction_owned numeric not null default 0,
  id uuid not null default gen_random_uuid() primary key,
  miner_id uuid not null references public.asic_miners(id) on delete cascade,
  purchase_price numeric not null default 0,
  status text not null default 'active',
  updated_at timestamp with time zone not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade
);

create table public.mining_payouts (
  amount_btc numeric not null default 0,
  created_at timestamp with time zone not null default now(),
  id uuid not null default gen_random_uuid() primary key,
  ownership_id uuid null references public.miner_ownerships(id) on delete set null,
  payout_date timestamp with time zone not null default now(),
  status text not null default 'pending',
  user_id uuid not null references auth.users(id) on delete cascade
);

create table public.mining_stats (
  created_at timestamp with time zone not null default now(),
  hashrate_th numeric not null default 0,
  id uuid not null default gen_random_uuid() primary key,
  miner_id uuid null references public.asic_miners(id) on delete cascade,
  recorded_at timestamp with time zone not null default now(),
  uptime_percent numeric not null default 0
);

create table public.user_wallets (
  created_at timestamp with time zone not null default now(),
  id uuid not null default gen_random_uuid() primary key,
  is_primary boolean not null default false,
  updated_at timestamp with time zone not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  verified boolean not null default false,
  wallet_address text not null,
  wallet_type text not null
);

grant all on public.contact_submissions to service_role;
grant select, insert, update, delete on public.contact_submissions to authenticated;
grant insert on public.contact_submissions to anon;
alter table public.contact_submissions enable row level security;
create policy "contact_submissions_public_insert" on public.contact_submissions for insert to anon, authenticated with check (true);
create policy "contact_submissions_admin_all" on public.contact_submissions for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant all on public.security_audit to service_role;
grant select on public.security_audit to authenticated;
alter table public.security_audit enable row level security;
create policy "security_audit_admin_read" on public.security_audit for select to authenticated using (public.is_admin());

grant all on public.security_audit_log to service_role;
grant select on public.security_audit_log to authenticated;
alter table public.security_audit_log enable row level security;
create policy "security_audit_log_admin_read" on public.security_audit_log for select to authenticated using (public.is_admin());

grant all on public.ad_campaigns to service_role;
grant select, insert, update, delete on public.ad_campaigns to authenticated;
alter table public.ad_campaigns enable row level security;
create policy "ad_campaigns_admin_all" on public.ad_campaigns for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger set_ad_campaigns_updated_at before update on public.ad_campaigns for each row execute function public.update_updated_at_column();

grant all on public.ad_generations to service_role;
grant select, insert, update, delete on public.ad_generations to authenticated;
alter table public.ad_generations enable row level security;
create policy "ad_generations_admin_all" on public.ad_generations for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant all on public.ad_assets to service_role;
grant select, insert, update, delete on public.ad_assets to authenticated;
alter table public.ad_assets enable row level security;
create policy "ad_assets_admin_all" on public.ad_assets for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant all on public.asic_miners to service_role;
grant select on public.asic_miners to anon, authenticated;
grant insert, update, delete on public.asic_miners to authenticated;
alter table public.asic_miners enable row level security;
create policy "asic_miners_public_read" on public.asic_miners for select using (true);
create policy "asic_miners_admin_all" on public.asic_miners for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger set_asic_miners_updated_at before update on public.asic_miners for each row execute function public.update_updated_at_column();

grant all on public.miner_ownerships to service_role;
grant select, insert, update, delete on public.miner_ownerships to authenticated;
alter table public.miner_ownerships enable row level security;
create policy "miner_ownerships_owner_select" on public.miner_ownerships for select to authenticated using (auth.uid() = user_id);
create policy "miner_ownerships_owner_insert" on public.miner_ownerships for insert to authenticated with check (auth.uid() = user_id);
create policy "miner_ownerships_admin_all" on public.miner_ownerships for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger set_miner_ownerships_updated_at before update on public.miner_ownerships for each row execute function public.update_updated_at_column();

grant all on public.mining_payouts to service_role;
grant select, insert, update, delete on public.mining_payouts to authenticated;
alter table public.mining_payouts enable row level security;
create policy "mining_payouts_owner_select" on public.mining_payouts for select to authenticated using (auth.uid() = user_id);
create policy "mining_payouts_admin_all" on public.mining_payouts for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant all on public.mining_stats to service_role;
grant select on public.mining_stats to anon, authenticated;
grant insert, update, delete on public.mining_stats to authenticated;
alter table public.mining_stats enable row level security;
create policy "mining_stats_public_read" on public.mining_stats for select using (true);
create policy "mining_stats_admin_all" on public.mining_stats for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant all on public.user_wallets to service_role;
grant select, insert, update, delete on public.user_wallets to authenticated;
alter table public.user_wallets enable row level security;
create policy "user_wallets_owner_all" on public.user_wallets for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user_wallets_admin_all" on public.user_wallets for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger set_user_wallets_updated_at before update on public.user_wallets for each row execute function public.update_updated_at_column();