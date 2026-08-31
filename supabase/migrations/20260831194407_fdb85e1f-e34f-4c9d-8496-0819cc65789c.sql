create table public.site_settings (
  created_at timestamp with time zone null default now(),
  description text null,
  id uuid not null default gen_random_uuid() primary key,
  setting_key text not null,
  setting_value text not null,
  updated_at timestamp with time zone null default now()
);

create table public.notification_settings (
  created_at timestamp with time zone null default now(),
  description text null,
  id uuid not null default gen_random_uuid() primary key,
  setting_key text not null,
  setting_value text not null,
  updated_at timestamp with time zone null default now()
);

create table public.contact_info (
  category text null,
  contact_type text not null,
  created_at timestamp with time zone null default now(),
  display_order numeric null default 0,
  id uuid not null default gen_random_uuid() primary key,
  is_active boolean null default true,
  label text null,
  updated_at timestamp with time zone null default now(),
  value text not null
);

create table public.shipping_zones (
  base_rate numeric not null default 0,
  countries text[] not null default '{}',
  created_at timestamp with time zone null default now(),
  free_shipping_threshold numeric null,
  hazmat_surcharge numeric null,
  id uuid not null default gen_random_uuid() primary key,
  is_active boolean null default true,
  notes text null,
  order_index numeric null default 0,
  region_name text not null,
  transit_days_max numeric not null default 0,
  transit_days_min numeric not null default 0,
  updated_at timestamp with time zone null default now()
);

create table public.state_tax_rates (
  created_at timestamp with time zone not null default now(),
  id uuid not null default gen_random_uuid() primary key,
  is_active boolean not null default true,
  notes text null,
  state_code text not null,
  state_name text not null,
  tax_rate numeric not null default 0,
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
  tax_rate numeric not null default 0,
  tax_type text not null default 'VAT',
  updated_at timestamp with time zone null default now()
);

create table public.exchange_rates (
  base_currency text not null default 'USD',
  created_at timestamp with time zone null default now(),
  id uuid not null default gen_random_uuid() primary key,
  rate numeric not null default 1,
  target_currency text not null,
  updated_at timestamp with time zone null default now()
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

create table public.newsletter_subscribers (
  email text not null,
  id uuid not null default gen_random_uuid() primary key,
  is_active boolean not null default true,
  name text null,
  source text null default 'website',
  subscribed_at timestamp with time zone not null default now()
);

alter table public.site_settings add constraint site_settings_setting_key_unique unique (setting_key);
alter table public.notification_settings add constraint notification_settings_setting_key_unique unique (setting_key);
alter table public.contact_info add constraint contact_info_contact_type_unique unique (contact_type);
alter table public.shipping_zones add constraint shipping_zones_region_name_unique unique (region_name);
alter table public.state_tax_rates add constraint state_tax_rates_state_code_unique unique (state_code);
alter table public.international_tax_rates add constraint international_tax_rates_country_code_unique unique (country_code);
alter table public.exchange_rates add constraint exchange_rates_target_currency_unique unique (target_currency);
alter table public.newsletter_subscribers add constraint newsletter_subscribers_email_unique unique (email);

grant all on public.site_settings to service_role;
grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;
alter table public.site_settings enable row level security;
create policy "site_settings_public_read" on public.site_settings for select using (true);
create policy "site_settings_admin_all" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger set_site_settings_updated_at before update on public.site_settings for each row execute function public.update_updated_at_column();

grant all on public.notification_settings to service_role;
grant select on public.notification_settings to anon, authenticated;
grant insert, update, delete on public.notification_settings to authenticated;
alter table public.notification_settings enable row level security;
create policy "notification_settings_public_read" on public.notification_settings for select using (true);
create policy "notification_settings_admin_all" on public.notification_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger set_notification_settings_updated_at before update on public.notification_settings for each row execute function public.update_updated_at_column();

grant all on public.contact_info to service_role;
grant select on public.contact_info to anon, authenticated;
grant insert, update, delete on public.contact_info to authenticated;
alter table public.contact_info enable row level security;
create policy "contact_info_public_read" on public.contact_info for select using (true);
create policy "contact_info_admin_all" on public.contact_info for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger set_contact_info_updated_at before update on public.contact_info for each row execute function public.update_updated_at_column();

grant all on public.shipping_zones to service_role;
grant select on public.shipping_zones to anon, authenticated;
grant insert, update, delete on public.shipping_zones to authenticated;
alter table public.shipping_zones enable row level security;
create policy "shipping_zones_public_read" on public.shipping_zones for select using (true);
create policy "shipping_zones_admin_all" on public.shipping_zones for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger set_shipping_zones_updated_at before update on public.shipping_zones for each row execute function public.update_updated_at_column();

grant all on public.state_tax_rates to service_role;
grant select on public.state_tax_rates to anon, authenticated;
grant insert, update, delete on public.state_tax_rates to authenticated;
alter table public.state_tax_rates enable row level security;
create policy "state_tax_rates_public_read" on public.state_tax_rates for select using (true);
create policy "state_tax_rates_admin_all" on public.state_tax_rates for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger set_state_tax_rates_updated_at before update on public.state_tax_rates for each row execute function public.update_updated_at_column();

grant all on public.international_tax_rates to service_role;
grant select on public.international_tax_rates to anon, authenticated;
grant insert, update, delete on public.international_tax_rates to authenticated;
alter table public.international_tax_rates enable row level security;
create policy "international_tax_rates_public_read" on public.international_tax_rates for select using (true);
create policy "international_tax_rates_admin_all" on public.international_tax_rates for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger set_international_tax_rates_updated_at before update on public.international_tax_rates for each row execute function public.update_updated_at_column();

grant all on public.exchange_rates to service_role;
grant select on public.exchange_rates to anon, authenticated;
grant insert, update, delete on public.exchange_rates to authenticated;
alter table public.exchange_rates enable row level security;
create policy "exchange_rates_public_read" on public.exchange_rates for select using (true);
create policy "exchange_rates_admin_all" on public.exchange_rates for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger set_exchange_rates_updated_at before update on public.exchange_rates for each row execute function public.update_updated_at_column();

grant all on public.payment_wallet_addresses to service_role;
grant select on public.payment_wallet_addresses to anon, authenticated;
grant insert, update, delete on public.payment_wallet_addresses to authenticated;
alter table public.payment_wallet_addresses enable row level security;
create policy "payment_wallet_addresses_public_read" on public.payment_wallet_addresses for select using (true);
create policy "payment_wallet_addresses_admin_all" on public.payment_wallet_addresses for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger set_payment_wallet_addresses_updated_at before update on public.payment_wallet_addresses for each row execute function public.update_updated_at_column();

grant all on public.newsletter_subscribers to service_role;
grant select, insert, update, delete on public.newsletter_subscribers to authenticated;
grant insert on public.newsletter_subscribers to anon;
alter table public.newsletter_subscribers enable row level security;
create policy "newsletter_subscribers_public_insert" on public.newsletter_subscribers for insert to anon, authenticated with check (true);
create policy "newsletter_subscribers_admin_all" on public.newsletter_subscribers for all to authenticated using (public.is_admin()) with check (public.is_admin());