create table public.orders (
  cashapp_tag text null,
  created_at timestamp with time zone null default now(),
  customer_email text not null,
  customer_name text not null,
  id uuid not null default gen_random_uuid() primary key,
  items jsonb null,
  notes text null,
  order_number text null default public.generate_order_number(),
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

create table public.order_items (
  configuration_json jsonb null,
  created_at timestamp with time zone null default now(),
  epa_approved boolean null,
  id uuid not null default gen_random_uuid() primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  packaging text null,
  price numeric not null,
  product_id uuid null references public.products(id) on delete set null,
  product_name text not null,
  quantity numeric not null,
  sku text null
);

create table public.quotes (
  company_name text null,
  created_at timestamp with time zone not null default now(),
  customer_email text not null,
  customer_name text not null,
  id uuid not null default gen_random_uuid() primary key,
  notes text null,
  phone text null,
  quote_number text null default public.generate_quote_number(),
  shipping_address text null,
  status text not null default 'pending',
  updated_at timestamp with time zone not null default now(),
  user_id uuid null references auth.users(id) on delete set null
);

create table public.quote_items (
  created_at timestamp with time zone not null default now(),
  id uuid not null default gen_random_uuid() primary key,
  packaging text null,
  product_id uuid null references public.products(id) on delete set null,
  product_name text not null,
  quantity numeric not null,
  quote_id uuid not null references public.quotes(id) on delete cascade
);

create table public.coupons (
  code text not null,
  created_at timestamp with time zone not null default now(),
  discount_type text not null default 'percent',
  discount_value numeric not null default 0,
  expires_at timestamp with time zone null,
  id uuid not null default gen_random_uuid() primary key,
  is_active boolean not null default true,
  max_uses numeric null,
  min_order_amount numeric null,
  updated_at timestamp with time zone not null default now(),
  used_count numeric not null default 0
);

create table public.generated_documents (
  amount_paid numeric not null default 0,
  buyer_address text null,
  buyer_company text null,
  buyer_country text null,
  buyer_email text null,
  buyer_name text not null,
  buyer_phone text null,
  created_at timestamp with time zone not null default now(),
  created_by uuid null,
  currency text not null default 'USD',
  discount_percent numeric not null default 0,
  document_number text not null,
  document_type text not null,
  due_date timestamp with time zone null,
  id uuid not null default gen_random_uuid() primary key,
  items jsonb not null default '[]'::jsonb,
  notes text null,
  order_id uuid null references public.orders(id) on delete set null,
  payment_method text null,
  payment_terms text null,
  pdf_path text null,
  pdf_url text null,
  po_number text null,
  ship_to_address text null,
  shipping_cost numeric not null default 0,
  subtotal numeric not null default 0,
  tax_amount numeric not null default 0,
  total numeric not null default 0,
  updated_at timestamp with time zone not null default now(),
  validity_days numeric not null default 30
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
  order_id uuid not null references public.orders(id) on delete cascade,
  selfie_url text null,
  status text not null default 'pending',
  submitted_at timestamp with time zone null,
  token text not null,
  updated_at timestamp with time zone not null default now()
);

alter table public.orders add constraint orders_order_number_unique unique (order_number);
alter table public.quotes add constraint quotes_quote_number_unique unique (quote_number);
alter table public.coupons add constraint coupons_code_unique unique (code);
alter table public.generated_documents add constraint generated_documents_document_number_unique unique (document_number);
alter table public.kyc_verifications add constraint kyc_verifications_order_id_unique unique (order_id);
alter table public.kyc_verifications add constraint kyc_verifications_token_unique unique (token);

grant all on public.orders to service_role;
grant select, insert, update, delete on public.orders to authenticated;
alter table public.orders enable row level security;
create policy "orders_owner_select" on public.orders for select to authenticated using (auth.uid() = user_id);
create policy "orders_owner_insert" on public.orders for insert to authenticated with check (auth.uid() = user_id);
create policy "orders_admin_all" on public.orders for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger set_orders_updated_at before update on public.orders for each row execute function public.update_updated_at_column();

grant all on public.order_items to service_role;
grant select, insert, update, delete on public.order_items to authenticated;
alter table public.order_items enable row level security;
create policy "order_items_owner_select" on public.order_items for select to authenticated using (exists (select 1 from public.orders o where o.id = order_items.order_id and o.user_id = auth.uid()));
create policy "order_items_owner_insert" on public.order_items for insert to authenticated with check (exists (select 1 from public.orders o where o.id = order_items.order_id and o.user_id = auth.uid()));
create policy "order_items_admin_all" on public.order_items for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant all on public.quotes to service_role;
grant select, insert, update, delete on public.quotes to authenticated;
alter table public.quotes enable row level security;
create policy "quotes_owner_select" on public.quotes for select to authenticated using (auth.uid() = user_id);
create policy "quotes_owner_insert" on public.quotes for insert to authenticated with check (auth.uid() = user_id);
create policy "quotes_admin_all" on public.quotes for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger set_quotes_updated_at before update on public.quotes for each row execute function public.update_updated_at_column();

grant all on public.quote_items to service_role;
grant select, insert, update, delete on public.quote_items to authenticated;
alter table public.quote_items enable row level security;
create policy "quote_items_owner_select" on public.quote_items for select to authenticated using (exists (select 1 from public.quotes q where q.id = quote_items.quote_id and q.user_id = auth.uid()));
create policy "quote_items_owner_insert" on public.quote_items for insert to authenticated with check (exists (select 1 from public.quotes q where q.id = quote_items.quote_id and q.user_id = auth.uid()));
create policy "quote_items_admin_all" on public.quote_items for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant all on public.coupons to service_role;
grant select, insert, update, delete on public.coupons to authenticated;
alter table public.coupons enable row level security;
create policy "coupons_admin_all" on public.coupons for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger set_coupons_updated_at before update on public.coupons for each row execute function public.update_updated_at_column();

grant all on public.generated_documents to service_role;
grant select, insert, update, delete on public.generated_documents to authenticated;
alter table public.generated_documents enable row level security;
create policy "generated_documents_admin_all" on public.generated_documents for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger set_generated_documents_updated_at before update on public.generated_documents for each row execute function public.update_updated_at_column();

grant all on public.kyc_verifications to service_role;
grant select, insert, update, delete on public.kyc_verifications to authenticated;
alter table public.kyc_verifications enable row level security;
create policy "kyc_verifications_admin_all" on public.kyc_verifications for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger set_kyc_verifications_updated_at before update on public.kyc_verifications for each row execute function public.update_updated_at_column();