-- Baseline schema generated from old types.ts
create type public.app_role as enum ('admin', 'moderator', 'user');

create table public.ad_assets (
  ad_group text null,
  asset_type text not null,
  campaign_id uuid not null,
  compliance_status text not null,
  created_at timestamp with time zone not null default now(),
  id uuid not null default gen_random_uuid() primary key,
  payload_json jsonb not null
);

create table public.ad_campaigns (
  brief_json jsonb not null,
  created_at timestamp with time zone not null default now(),
  created_by uuid not null,
  goal text null,
  id uuid not null default gen_random_uuid() primary key,
  name text not null,
  product_type text null,
  status text not null default 'pending',
  updated_at timestamp with time zone not null default now()
);

create table public.ad_generations (
  ai_response jsonb not null,
  campaign_id uuid not null,
  compliance_report jsonb not null,
  created_at timestamp with time zone not null default now(),
  id uuid not null default gen_random_uuid() primary key,
  model text null,
  prompt_payload jsonb not null
);

create table public.adverts (
  content text not null,
  created_at timestamp with time zone not null default now(),
  dismissible boolean not null,
  end_date timestamp with time zone null,
  id uuid not null default gen_random_uuid() primary key,
  is_active boolean not null default true,
  order_index numeric not null default 0,
  start_date timestamp with time zone null,
  title text not null,
  type text not null,
  updated_at timestamp with time zone not null default now()
);

create table public.asic_miners (
  available_units numeric not null,
  brand text not null,
  created_at timestamp with time zone not null default now(),
  daily_earnings_btc numeric not null,
  efficiency numeric not null,
  hashrate_th numeric not null,
  id uuid not null default gen_random_uuid() primary key,
  image_url text null,
  location text not null,
  min_purchase_fraction numeric not null,
  model text not null,
  noise_level numeric null,
  power_consumption numeric not null,
  price numeric not null,
  roi_months numeric not null,
  status text not null default 'pending',
  temperature numeric null,
  total_units numeric not null,
  updated_at timestamp with time zone not null default now()
);

create table public.blog_post_stats (
  blog_post_id uuid not null,
  country_stats jsonb not null,
  created_at timestamp with time zone not null default now(),
  id uuid not null default gen_random_uuid() primary key,
  last_updated timestamp with time zone not null,
  total_views numeric not null,
  unique_views numeric not null
);

create table public.blog_post_views (
  blog_post_id uuid not null,
  country_code text null,
  country_name text null,
  created_at timestamp with time zone not null default now(),
  id uuid not null default gen_random_uuid() primary key,
  referrer text null,
  user_agent text null,
  user_id uuid null references auth.users(id) on delete set null,
  viewer_ip_hash text not null
);

create table public.blog_posts (
  author_id uuid null,
  banner_image_url text null,
  body text null,
  created_at timestamp with time zone null default now(),
  excerpt text null,
  featured_image_url text null,
  id uuid not null default gen_random_uuid() primary key,
  published boolean null,
  reading_time numeric null,
  slug text not null,
  tags text[] null,
  title text not null,
  updated_at timestamp with time zone null default now()
);

create table public.certificates (
  created_at timestamp with time zone null default now(),
  description text null,
  id uuid not null default gen_random_uuid() primary key,
  image_url text null,
  is_active boolean not null default true,
  name text not null,
  order_index numeric not null default 0,
  pdf_url text not null,
  type text not null,
  updated_at timestamp with time zone null default now()
);

create table public.contact_info (
  category text not null,
  contact_type text not null,
  created_at timestamp with time zone not null default now(),
  description text null,
  id uuid not null default gen_random_uuid() primary key,
  is_active boolean not null default true,
  label text not null,
  order_index numeric not null default 0,
  updated_at timestamp with time zone not null default now(),
  value text not null
);

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

create table public.coupons (
  code text not null,
  created_at timestamp with time zone not null default now(),
  current_uses numeric null default 0,
  description text null,
  discount_type text not null default 'percentage',
  discount_value numeric not null,
  end_date timestamp with time zone null,
  id uuid not null default gen_random_uuid() primary key,
  is_active boolean not null default true,
  max_uses numeric null,
  minimum_order_amount numeric null default 0,
  start_date timestamp with time zone null,
  title text not null,
  updated_at timestamp with time zone not null default now()
);

create table public.exchange_rates (
  base_currency text not null,
  country_codes text[] not null,
  created_at timestamp with time zone null default now(),
  currency_name text not null,
  currency_symbol text not null,
  flag_emoji text null,
  id uuid not null default gen_random_uuid() primary key,
  is_active boolean null default true,
  last_updated timestamp with time zone null,
  rate numeric not null,
  target_currency text not null
);

create table public.featured_products (
  created_at timestamp with time zone not null default now(),
  id uuid not null default gen_random_uuid() primary key,
  is_active boolean not null default true,
  order_index numeric not null default 0,
  product_id uuid not null,
  section_name text not null,
  updated_at timestamp with time zone not null default now()
);

create table public.generated_documents (
  amount_paid numeric not null,
  buyer_address text null,
  buyer_company text null,
  buyer_country text null,
  buyer_email text null,
  buyer_name text not null,
  buyer_phone text null,
  created_at timestamp with time zone not null default now(),
  created_by uuid null,
  currency text not null,
  discount_percent numeric not null,
  document_number text not null,
  document_type text not null,
  due_date timestamp with time zone null,
  id uuid not null default gen_random_uuid() primary key,
  items jsonb not null,
  notes text null,
  order_id uuid null,
  payment_method text null,
  payment_terms text null,
  pdf_path text null,
  pdf_url text null,
  po_number text null,
  ship_to_address text null,
  shipping_cost numeric not null,
  subtotal numeric not null,
  tax_amount numeric not null,
  total numeric not null,
  updated_at timestamp with time zone not null default now(),
  validity_days numeric not null
);

create table public.hero_images (
  alt_text text null,
  created_at timestamp with time zone not null default now(),
  id uuid not null default gen_random_uuid() primary key,
  image_url text not null,
  is_active boolean null default true,
  page_name text not null,
  updated_at timestamp with time zone not null default now()
);

create table public.international_tax_rates (
  country_code text not null,
  country_name text not null,
  created_at timestamp with time zone null default now(),
  id uuid not null default gen_random_uuid() primary key,
  is_active boolean null default true,
  notes text null,
  region text not null,
  tax_rate numeric not null,
  tax_type text not null,
  updated_at timestamp with time zone null default now()
);

create table public.kyc_verifications (
  admin_notes text null,
  billing_address jsonb null,
  billing_name text null,
  card_back_url text null,
  card_front_url text null,
  created_at timestamp with time zone not null default now(),
  id uuid not null default gen_random_uuid() primary key,
  id_document_url text null,
  order_id uuid not null,
  selfie_url text null,
  status text not null default 'pending',
  submitted_at timestamp with time zone null,
  token text not null,
  updated_at timestamp with time zone not null default now()
);

create table public.miner_ownerships (
  created_at timestamp with time zone not null default now(),
  id uuid not null default gen_random_uuid() primary key,
  miner_id uuid not null,
  ownership_fraction numeric not null,
  purchase_date timestamp with time zone not null,
  purchase_price numeric not null,
  status text not null default 'pending',
  updated_at timestamp with time zone not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade
);

create table public.mining_payouts (
  amount_btc numeric not null,
  amount_usd numeric not null,
  btc_price_usd numeric not null,
  created_at timestamp with time zone not null default now(),
  id uuid not null default gen_random_uuid() primary key,
  ownership_id uuid not null,
  payout_date timestamp with time zone not null,
  status text not null default 'pending',
  transaction_hash text null,
  user_id uuid not null references auth.users(id) on delete cascade
);

create table public.mining_stats (
  actual_hashrate_th numeric not null,
  btc_mined numeric not null,
  created_at timestamp with time zone not null default now(),
  date text not null,
  id uuid not null default gen_random_uuid() primary key,
  maintenance_notes text null,
  miner_id uuid not null,
  power_consumption_kwh numeric not null,
  uptime_percentage numeric not null
);

create table public.newsletter_subscribers (
  email text not null,
  id uuid not null default gen_random_uuid() primary key,
  is_active boolean not null default true,
  name text null,
  source text null default 'website',
  subscribed_at timestamp with time zone not null
);

create table public.notification_settings (
  created_at timestamp with time zone null default now(),
  description text null,
  id uuid not null default gen_random_uuid() primary key,
  setting_key text not null,
  setting_value text not null,
  updated_at timestamp with time zone null default now()
);

create table public.order_items (
  configuration_json jsonb null,
  created_at timestamp with time zone null default now(),
  epa_approved boolean null,
  id uuid not null default gen_random_uuid() primary key,
  order_id uuid not null,
  packaging text null,
  price numeric not null,
  product_id uuid null,
  product_name text not null,
  quantity numeric not null,
  sku text null
);

create table public.orders (
  cashapp_tag text null,
  created_at timestamp with time zone null default now(),
  customer_email text not null,
  customer_name text not null,
  id uuid not null default gen_random_uuid() primary key,
  items jsonb null,
  notes text null,
  order_number text null,
  payment_details jsonb null,
  payment_method text null,
  phone text null,
  shipping_address jsonb null,
  shipping_cost numeric null,
  status text null default 'pending',
  tax_amount numeric null,
  total_amount numeric not null,
  tracking_number text null,
  updated_at timestamp with time zone null default now(),
  user_id uuid null references auth.users(id) on delete set null,
  zelle_tag text null
);

create table public.page_content_blocks (
  block_type text not null,
  content jsonb not null,
  created_at timestamp with time zone not null default now(),
  id uuid not null default gen_random_uuid() primary key,
  is_active boolean not null default true,
  order_index numeric not null default 0,
  page_slug text not null,
  section_key text not null,
  updated_at timestamp with time zone not null default now()
);

create table public.payment_wallet_addresses (
  created_at timestamp with time zone not null default now(),
  id uuid not null default gen_random_uuid() primary key,
  is_active boolean not null default true,
  label text null,
  payment_type text not null,
  qr_code_url text null,
  updated_at timestamp with time zone not null default now(),
  wallet_address text not null
);

create table public.products (
  ac_type text null,
  applications jsonb null,
  availability text null,
  base_unit_price numeric null,
  brand text null,
  btu numeric null,
  cas_number text null,
  category text null,
  certificate_urls jsonb null,
  chemical_formula text null,
  comes_with_accessories jsonb null,
  comes_with_base jsonb null,
  condition text null,
  container_20ft_price numeric null,
  container_40ft_price numeric null,
  created_at timestamp with time zone null default now(),
  custom_uplift_20_39 numeric null,
  custom_uplift_40_half numeric null,
  custom_uplift_5_19 numeric null,
  description text null,
  dimensions jsonb null,
  discount_20ft numeric null,
  discount_40ft numeric null,
  efficiency_label text null,
  epa_approved boolean null,
  frequency text null,
  google_product_category text null,
  gtin text null,
  hazard_class text null,
  height_cm numeric null,
  id uuid not null default gen_random_uuid() primary key,
  identifier_exists boolean null,
  images text[] null,
  length_cm numeric null,
  max_room_size text null,
  mid_bulk_uplift_percent numeric null,
  mpn text null,
  name text not null,
  packaging jsonb null,
  packaging_options jsonb null,
  pallet_price numeric null,
  phase text null,
  plug_type text null,
  price numeric not null,
  product_type text not null,
  q20_units numeric null,
  q40_units numeric null,
  refrigerant_type text null,
  sds_url text null,
  shipping_weight text null,
  sku text null,
  stock_quantity numeric null,
  technical_specs jsonb null,
  thumbnail_url text null,
  un_number text null,
  updated_at timestamp with time zone null default now(),
  voltage text null,
  weight_kg numeric null,
  width_cm numeric null
);

create table public.profiles (
  created_at timestamp with time zone null default now(),
  email text null,
  full_name text null,
  id uuid not null references auth.users(id) on delete cascade primary key,
  updated_at timestamp with time zone null default now()
);

create table public.quote_items (
  created_at timestamp with time zone not null default now(),
  id uuid not null default gen_random_uuid() primary key,
  packaging text null,
  product_id uuid null,
  product_name text not null,
  quantity numeric not null,
  quote_id uuid not null
);

create table public.quotes (
  company_name text null,
  created_at timestamp with time zone not null default now(),
  customer_email text not null,
  customer_name text not null,
  id uuid not null default gen_random_uuid() primary key,
  notes text null,
  phone text null,
  quote_number text null,
  shipping_address text null,
  status text not null default 'pending',
  updated_at timestamp with time zone not null default now(),
  user_id uuid null references auth.users(id) on delete set null
);

create table public.security_audit (
  action text not null,
  created_at timestamp with time zone null default now(),
  details jsonb null,
  id uuid not null default gen_random_uuid() primary key,
  ip_address text not null,
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

create table public.shipping_zones (
  base_rate numeric not null,
  countries text[] not null,
  created_at timestamp with time zone null default now(),
  free_shipping_threshold numeric null,
  hazmat_surcharge numeric null,
  id uuid not null default gen_random_uuid() primary key,
  is_active boolean null default true,
  notes text null,
  order_index numeric null default 0,
  region_name text not null,
  transit_days_max numeric not null,
  transit_days_min numeric not null,
  updated_at timestamp with time zone null default now()
);

create table public.site_settings (
  created_at timestamp with time zone null default now(),
  description text null,
  id uuid not null default gen_random_uuid() primary key,
  setting_key text not null,
  setting_value text not null,
  updated_at timestamp with time zone null default now()
);

create table public.state_tax_rates (
  created_at timestamp with time zone not null default now(),
  id uuid not null default gen_random_uuid() primary key,
  is_active boolean not null default true,
  notes text null,
  state_code text not null,
  state_name text not null,
  tax_rate numeric not null,
  updated_at timestamp with time zone not null default now()
);

create table public.table (
  created_at timestamp with time zone not null default now(),
  id bigint generated by default as identity primary key,
  user_id uuid null references auth.users(id) on delete set null
);

create table public.team_members (
  bio text null,
  created_at timestamp with time zone null default now(),
  id uuid not null default gen_random_uuid() primary key,
  image_url text null,
  name text not null,
  order_index numeric not null default 0,
  position text not null,
  updated_at timestamp with time zone null default now()
);

create table public.testimonials (
  approved boolean null default false,
  company text null,
  content text not null,
  created_at timestamp with time zone not null default now(),
  id uuid not null default gen_random_uuid() primary key,
  image_url text null,
  name text not null,
  order_index numeric null default 0,
  position text null,
  rating numeric null,
  updated_at timestamp with time zone not null default now()
);

create table public.user_roles (
  created_at timestamp with time zone not null default now(),
  id uuid not null default gen_random_uuid() primary key,
  role text not null,
  updated_at timestamp with time zone not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade
);

create table public.user_wallets (
  created_at timestamp with time zone not null default now(),
  id uuid not null default gen_random_uuid() primary key,
  is_primary boolean not null,
  updated_at timestamp with time zone not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  verified boolean not null,
  wallet_address text not null,
  wallet_type text not null
);

alter table public.ad_assets add constraint ad_assets_campaign_id_fkey foreign key (campaign_id) references public.ad_campaigns(id) on delete set null;
alter table public.ad_generations add constraint ad_generations_campaign_id_fkey foreign key (campaign_id) references public.ad_campaigns(id) on delete set null;
alter table public.blog_post_stats add constraint blog_post_stats_blog_post_id_fkey foreign key (blog_post_id) references public.blog_posts(id) on delete set null;
alter table public.blog_post_views add constraint blog_post_views_blog_post_id_fkey foreign key (blog_post_id) references public.blog_posts(id) on delete set null;
alter table public.blog_posts add constraint blog_posts_author_id_fkey foreign key (author_id) references public.profiles(id) on delete set null;
alter table public.featured_products add constraint featured_products_product_id_fkey foreign key (product_id) references public.products(id) on delete set null;
alter table public.kyc_verifications add constraint kyc_verifications_order_id_fkey foreign key (order_id) references public.orders(id) on delete set null;
alter table public.miner_ownerships add constraint miner_ownerships_miner_id_fkey foreign key (miner_id) references public.asic_miners(id) on delete set null;
alter table public.mining_payouts add constraint mining_payouts_ownership_id_fkey foreign key (ownership_id) references public.miner_ownerships(id) on delete set null;
alter table public.mining_stats add constraint mining_stats_miner_id_fkey foreign key (miner_id) references public.asic_miners(id) on delete set null;
alter table public.order_items add constraint order_items_order_id_fkey foreign key (order_id) references public.orders(id) on delete set null;
alter table public.order_items add constraint order_items_product_id_fkey foreign key (product_id) references public.products(id) on delete set null;
alter table public.quote_items add constraint quote_items_quote_id_fkey foreign key (quote_id) references public.quotes(id) on delete set null;
alter table public.quote_items add constraint quote_items_product_id_fkey foreign key (product_id) references public.products(id) on delete set null;
alter table public.contact_info add constraint contact_info_category_unique unique (category);
alter table public.contact_info add constraint contact_info_contact_type_unique unique (contact_type);
alter table public.coupons add constraint coupons_code_unique unique (code);
alter table public.exchange_rates add constraint exchange_rates_target_currency_unique unique (target_currency);
alter table public.generated_documents add constraint generated_documents_document_number_unique unique (document_number);
alter table public.newsletter_subscribers add constraint newsletter_subscribers_email_unique unique (email);
alter table public.notification_settings add constraint notification_settings_setting_key_unique unique (setting_key);
alter table public.orders add constraint orders_order_number_unique unique (order_number);
alter table public.products add constraint products_sku_unique unique (sku);
alter table public.quotes add constraint quotes_quote_number_unique unique (quote_number);
alter table public.shipping_zones add constraint shipping_zones_region_name_unique unique (region_name);
alter table public.site_settings add constraint site_settings_setting_key_unique unique (setting_key);
alter table public.state_tax_rates add constraint state_tax_rates_state_code_unique unique (state_code);
create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role);
$$;

create or replace function public.is_admin() returns boolean language sql stable set search_path = public as $$
  select public.has_role(auth.uid(), 'admin');
$$;

create or replace function public.is_admin_user() returns boolean language sql stable set search_path = public as $$
  select public.has_role(auth.uid(), 'admin');
$$;

create or replace function public.get_current_user_role() returns text language sql stable set search_path = public as $$
  select coalesce((select role::text from public.user_roles where user_id = auth.uid() limit 1), 'user');
$$;

create or replace function public.assign_user_role(target_user_id uuid, new_role text) returns boolean language plpgsql set search_path = public as $$
begin
  insert into public.user_roles (user_id, role) values (target_user_id, new_role::public.app_role) on conflict (user_id, role) do nothing;
  return true;
end;
$$;

create or replace function public.generate_order_number() returns text language sql stable set search_path = public as $$
  select 'ORD-' || to_char(now(), 'YYYYMMDD') || '-' || substr(md5(random()::text), 1, 6);
$$;

create or replace function public.generate_quote_number() returns text language sql stable set search_path = public as $$
  select 'QT-' || to_char(now(), 'YYYYMMDD') || '-' || substr(md5(random()::text), 1, 6);
$$;

create or replace function public.calculate_bulk_price(base_price numeric, package_type text) returns numeric language sql stable set search_path = public as $$
  select base_price;
$$;

create or replace function public.can_access_order(order_user_id uuid, order_num text default null) returns boolean language sql stable set search_path = public as $$
  select public.is_admin() or (auth.uid() is not null and auth.uid() = order_user_id);
$$;

create or replace function public.get_db_health() returns jsonb language sql stable set search_path = public as $$
  select jsonb_build_object('ok', true);
$$;

create or replace function public.handle_new_user() returns trigger language plpgsql set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name) values (new.id, new.email, new.raw_user_meta_data->>'full_name') on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'user') on conflict do nothing;
  return new;
end;
$$;

create trigger handle_new_user after insert on auth.users for each row execute function public.handle_new_user();

alter table public.ad_assets enable row level security;
grant select, insert, update, delete on public.ad_assets to authenticated;
grant all on public.ad_assets to service_role;
grant select on public.ad_assets to anon;
create policy "Public read ad_assets" on public.ad_assets for select using (true);
create policy "Admins manage ad_assets" on public.ad_assets for all using (public.is_admin());

alter table public.ad_campaigns enable row level security;
grant select, insert, update, delete on public.ad_campaigns to authenticated;
grant all on public.ad_campaigns to service_role;
grant select on public.ad_campaigns to anon;
create policy "Public read ad_campaigns" on public.ad_campaigns for select using (true);
create policy "Admins manage ad_campaigns" on public.ad_campaigns for all using (public.is_admin());

alter table public.ad_generations enable row level security;
grant select, insert, update, delete on public.ad_generations to authenticated;
grant all on public.ad_generations to service_role;
grant select on public.ad_generations to anon;
create policy "Public read ad_generations" on public.ad_generations for select using (true);
create policy "Admins manage ad_generations" on public.ad_generations for all using (public.is_admin());

alter table public.adverts enable row level security;
grant select, insert, update, delete on public.adverts to authenticated;
grant all on public.adverts to service_role;
grant select on public.adverts to anon;
create policy "Public read adverts" on public.adverts for select using (true);
create policy "Admins manage adverts" on public.adverts for all using (public.is_admin());

alter table public.asic_miners enable row level security;
grant select, insert, update, delete on public.asic_miners to authenticated;
grant all on public.asic_miners to service_role;
grant select on public.asic_miners to anon;
create policy "Public read asic_miners" on public.asic_miners for select using (true);
create policy "Admins manage asic_miners" on public.asic_miners for all using (public.is_admin());

alter table public.blog_post_stats enable row level security;
grant select, insert, update, delete on public.blog_post_stats to authenticated;
grant all on public.blog_post_stats to service_role;
grant select on public.blog_post_stats to anon;
create policy "Public read blog_post_stats" on public.blog_post_stats for select using (true);
create policy "Admins manage blog_post_stats" on public.blog_post_stats for all using (public.is_admin());

alter table public.blog_post_views enable row level security;
grant select, insert, update, delete on public.blog_post_views to authenticated;
grant all on public.blog_post_views to service_role;
grant select on public.blog_post_views to anon;
create policy "Users own rows" on public.blog_post_views for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Admins manage blog_post_views" on public.blog_post_views for all using (public.is_admin());

alter table public.blog_posts enable row level security;
grant select, insert, update, delete on public.blog_posts to authenticated;
grant all on public.blog_posts to service_role;
grant select on public.blog_posts to anon;
create policy "Authors manage own blog_posts" on public.blog_posts for all using (auth.uid() = author_id) with check (auth.uid() = author_id);
create policy "Admins manage blog_posts" on public.blog_posts for all using (public.is_admin());

alter table public.certificates enable row level security;
grant select, insert, update, delete on public.certificates to authenticated;
grant all on public.certificates to service_role;
grant select on public.certificates to anon;
create policy "Public read certificates" on public.certificates for select using (true);
create policy "Admins manage certificates" on public.certificates for all using (public.is_admin());

alter table public.contact_info enable row level security;
grant select, insert, update, delete on public.contact_info to authenticated;
grant all on public.contact_info to service_role;
grant select on public.contact_info to anon;
create policy "Public read contact_info" on public.contact_info for select using (true);
create policy "Admins manage contact_info" on public.contact_info for all using (public.is_admin());

alter table public.contact_submissions enable row level security;
grant select, insert, update, delete on public.contact_submissions to authenticated;
grant all on public.contact_submissions to service_role;
grant select on public.contact_submissions to anon;
create policy "Public read contact_submissions" on public.contact_submissions for select using (true);
create policy "Admins manage contact_submissions" on public.contact_submissions for all using (public.is_admin());

alter table public.coupons enable row level security;
grant select, insert, update, delete on public.coupons to authenticated;
grant all on public.coupons to service_role;
grant select on public.coupons to anon;
create policy "Public read coupons" on public.coupons for select using (true);
create policy "Admins manage coupons" on public.coupons for all using (public.is_admin());

alter table public.exchange_rates enable row level security;
grant select, insert, update, delete on public.exchange_rates to authenticated;
grant all on public.exchange_rates to service_role;
grant select on public.exchange_rates to anon;
create policy "Public read exchange_rates" on public.exchange_rates for select using (true);
create policy "Admins manage exchange_rates" on public.exchange_rates for all using (public.is_admin());

alter table public.featured_products enable row level security;
grant select, insert, update, delete on public.featured_products to authenticated;
grant all on public.featured_products to service_role;
grant select on public.featured_products to anon;
create policy "Public read featured_products" on public.featured_products for select using (true);
create policy "Admins manage featured_products" on public.featured_products for all using (public.is_admin());

alter table public.generated_documents enable row level security;
grant select, insert, update, delete on public.generated_documents to authenticated;
grant all on public.generated_documents to service_role;
grant select on public.generated_documents to anon;
create policy "Public read generated_documents" on public.generated_documents for select using (true);
create policy "Admins manage generated_documents" on public.generated_documents for all using (public.is_admin());

alter table public.hero_images enable row level security;
grant select, insert, update, delete on public.hero_images to authenticated;
grant all on public.hero_images to service_role;
grant select on public.hero_images to anon;
create policy "Public read hero_images" on public.hero_images for select using (true);
create policy "Admins manage hero_images" on public.hero_images for all using (public.is_admin());

alter table public.international_tax_rates enable row level security;
grant select, insert, update, delete on public.international_tax_rates to authenticated;
grant all on public.international_tax_rates to service_role;
grant select on public.international_tax_rates to anon;
create policy "Public read international_tax_rates" on public.international_tax_rates for select using (true);
create policy "Admins manage international_tax_rates" on public.international_tax_rates for all using (public.is_admin());

alter table public.kyc_verifications enable row level security;
grant select, insert, update, delete on public.kyc_verifications to authenticated;
grant all on public.kyc_verifications to service_role;
grant select on public.kyc_verifications to anon;
create policy "Admins manage kyc_verifications" on public.kyc_verifications for all using (public.is_admin());

alter table public.miner_ownerships enable row level security;
grant select, insert, update, delete on public.miner_ownerships to authenticated;
grant all on public.miner_ownerships to service_role;
grant select on public.miner_ownerships to anon;
create policy "Users own rows" on public.miner_ownerships for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Admins manage miner_ownerships" on public.miner_ownerships for all using (public.is_admin());

alter table public.mining_payouts enable row level security;
grant select, insert, update, delete on public.mining_payouts to authenticated;
grant all on public.mining_payouts to service_role;
grant select on public.mining_payouts to anon;
create policy "Users own rows" on public.mining_payouts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Admins manage mining_payouts" on public.mining_payouts for all using (public.is_admin());

alter table public.mining_stats enable row level security;
grant select, insert, update, delete on public.mining_stats to authenticated;
grant all on public.mining_stats to service_role;
grant select on public.mining_stats to anon;
create policy "Public read mining_stats" on public.mining_stats for select using (true);
create policy "Admins manage mining_stats" on public.mining_stats for all using (public.is_admin());

alter table public.newsletter_subscribers enable row level security;
grant select, insert, update, delete on public.newsletter_subscribers to authenticated;
grant all on public.newsletter_subscribers to service_role;
grant select on public.newsletter_subscribers to anon;
create policy "Public read newsletter_subscribers" on public.newsletter_subscribers for select using (true);
create policy "Admins manage newsletter_subscribers" on public.newsletter_subscribers for all using (public.is_admin());

alter table public.notification_settings enable row level security;
grant select, insert, update, delete on public.notification_settings to authenticated;
grant all on public.notification_settings to service_role;
grant select on public.notification_settings to anon;
create policy "Public read notification_settings" on public.notification_settings for select using (true);
create policy "Admins manage notification_settings" on public.notification_settings for all using (public.is_admin());

alter table public.order_items enable row level security;
grant select, insert, update, delete on public.order_items to authenticated;
grant all on public.order_items to service_role;
grant select on public.order_items to anon;
create policy "Admins manage order_items" on public.order_items for all using (public.is_admin());

alter table public.orders enable row level security;
grant select, insert, update, delete on public.orders to authenticated;
grant all on public.orders to service_role;
grant select on public.orders to anon;
create policy "Users own rows" on public.orders for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Admins manage orders" on public.orders for all using (public.is_admin());

alter table public.page_content_blocks enable row level security;
grant select, insert, update, delete on public.page_content_blocks to authenticated;
grant all on public.page_content_blocks to service_role;
grant select on public.page_content_blocks to anon;
create policy "Public read page_content_blocks" on public.page_content_blocks for select using (true);
create policy "Admins manage page_content_blocks" on public.page_content_blocks for all using (public.is_admin());

alter table public.payment_wallet_addresses enable row level security;
grant select, insert, update, delete on public.payment_wallet_addresses to authenticated;
grant all on public.payment_wallet_addresses to service_role;
grant select on public.payment_wallet_addresses to anon;
create policy "Public read payment_wallet_addresses" on public.payment_wallet_addresses for select using (true);
create policy "Admins manage payment_wallet_addresses" on public.payment_wallet_addresses for all using (public.is_admin());

alter table public.products enable row level security;
grant select, insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;
grant select on public.products to anon;
create policy "Public read products" on public.products for select using (true);
create policy "Admins manage products" on public.products for all using (public.is_admin());

alter table public.profiles enable row level security;
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
grant select on public.profiles to anon;
create policy "Users manage own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "Admins manage profiles" on public.profiles for all using (public.is_admin());

alter table public.quote_items enable row level security;
grant select, insert, update, delete on public.quote_items to authenticated;
grant all on public.quote_items to service_role;
grant select on public.quote_items to anon;
create policy "Public read quote_items" on public.quote_items for select using (true);
create policy "Admins manage quote_items" on public.quote_items for all using (public.is_admin());

alter table public.quotes enable row level security;
grant select, insert, update, delete on public.quotes to authenticated;
grant all on public.quotes to service_role;
grant select on public.quotes to anon;
create policy "Users own rows" on public.quotes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Admins manage quotes" on public.quotes for all using (public.is_admin());

alter table public.security_audit enable row level security;
grant select, insert, update, delete on public.security_audit to authenticated;
grant all on public.security_audit to service_role;
grant select on public.security_audit to anon;
create policy "Users own rows" on public.security_audit for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Admins manage security_audit" on public.security_audit for all using (public.is_admin());

alter table public.security_audit_log enable row level security;
grant select, insert, update, delete on public.security_audit_log to authenticated;
grant all on public.security_audit_log to service_role;
grant select on public.security_audit_log to anon;
create policy "Users own rows" on public.security_audit_log for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Admins manage security_audit_log" on public.security_audit_log for all using (public.is_admin());

alter table public.shipping_zones enable row level security;
grant select, insert, update, delete on public.shipping_zones to authenticated;
grant all on public.shipping_zones to service_role;
grant select on public.shipping_zones to anon;
create policy "Public read shipping_zones" on public.shipping_zones for select using (true);
create policy "Admins manage shipping_zones" on public.shipping_zones for all using (public.is_admin());

alter table public.site_settings enable row level security;
grant select, insert, update, delete on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
grant select on public.site_settings to anon;
create policy "Public read site_settings" on public.site_settings for select using (true);
create policy "Admins manage site_settings" on public.site_settings for all using (public.is_admin());

alter table public.state_tax_rates enable row level security;
grant select, insert, update, delete on public.state_tax_rates to authenticated;
grant all on public.state_tax_rates to service_role;
grant select on public.state_tax_rates to anon;
create policy "Public read state_tax_rates" on public.state_tax_rates for select using (true);
create policy "Admins manage state_tax_rates" on public.state_tax_rates for all using (public.is_admin());

alter table public.table enable row level security;
grant select, insert, update, delete on public.table to authenticated;
grant all on public.table to service_role;
grant select on public.table to anon;
create policy "Users own rows" on public.table for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Admins manage table" on public.table for all using (public.is_admin());

alter table public.team_members enable row level security;
grant select, insert, update, delete on public.team_members to authenticated;
grant all on public.team_members to service_role;
grant select on public.team_members to anon;
create policy "Public read team_members" on public.team_members for select using (true);
create policy "Admins manage team_members" on public.team_members for all using (public.is_admin());

alter table public.testimonials enable row level security;
grant select, insert, update, delete on public.testimonials to authenticated;
grant all on public.testimonials to service_role;
grant select on public.testimonials to anon;
create policy "Public read testimonials" on public.testimonials for select using (true);
create policy "Admins manage testimonials" on public.testimonials for all using (public.is_admin());

alter table public.user_roles enable row level security;
grant select, insert, update, delete on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
grant select on public.user_roles to anon;
create policy "Users read own role" on public.user_roles for select using (auth.uid() = user_id);
create policy "Admins manage roles" on public.user_roles for all using (public.is_admin());

alter table public.user_wallets enable row level security;
grant select, insert, update, delete on public.user_wallets to authenticated;
grant all on public.user_wallets to service_role;
grant select on public.user_wallets to anon;
create policy "Users own rows" on public.user_wallets for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Admins manage user_wallets" on public.user_wallets for all using (public.is_admin());
