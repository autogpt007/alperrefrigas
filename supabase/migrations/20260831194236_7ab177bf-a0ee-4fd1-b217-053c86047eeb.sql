create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;

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

create table public.featured_products (
  created_at timestamp with time zone not null default now(),
  id uuid not null default gen_random_uuid() primary key,
  is_active boolean not null default true,
  order_index numeric not null default 0,
  product_id uuid not null,
  section_name text not null,
  updated_at timestamp with time zone not null default now()
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

create table public.blog_post_stats (
  blog_post_id uuid not null,
  country_stats jsonb not null,
  created_at timestamp with time zone not null default now(),
  id uuid not null default gen_random_uuid() primary key,
  last_updated timestamp with time zone not null default now(),
  total_views numeric not null default 0,
  unique_views numeric not null default 0
);

create table public.adverts (
  content text not null,
  created_at timestamp with time zone not null default now(),
  dismissible boolean not null default true,
  end_date timestamp with time zone null,
  id uuid not null default gen_random_uuid() primary key,
  is_active boolean not null default true,
  order_index numeric not null default 0,
  start_date timestamp with time zone null,
  title text not null,
  type text not null,
  updated_at timestamp with time zone not null default now()
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

alter table public.blog_post_stats add constraint blog_post_stats_blog_post_id_fkey foreign key (blog_post_id) references public.blog_posts(id) on delete cascade;
alter table public.blog_post_views add constraint blog_post_views_blog_post_id_fkey foreign key (blog_post_id) references public.blog_posts(id) on delete cascade;
alter table public.blog_posts add constraint blog_posts_author_id_fkey foreign key (author_id) references public.profiles(id) on delete set null;
alter table public.featured_products add constraint featured_products_product_id_fkey foreign key (product_id) references public.products(id) on delete cascade;
alter table public.products add constraint products_sku_unique unique (sku);
alter table public.blog_posts add constraint blog_posts_slug_unique unique (slug);

grant all on public.products to service_role;
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
alter table public.products enable row level security;
create policy "products_public_read" on public.products for select using (true);
create policy "products_admin_all" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger set_products_updated_at before update on public.products for each row execute function public.update_updated_at_column();

grant all on public.featured_products to service_role;
grant select on public.featured_products to anon, authenticated;
grant insert, update, delete on public.featured_products to authenticated;
alter table public.featured_products enable row level security;
create policy "featured_products_public_read" on public.featured_products for select using (true);
create policy "featured_products_admin_all" on public.featured_products for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger set_featured_products_updated_at before update on public.featured_products for each row execute function public.update_updated_at_column();

grant all on public.hero_images to service_role;
grant select on public.hero_images to anon, authenticated;
grant insert, update, delete on public.hero_images to authenticated;
alter table public.hero_images enable row level security;
create policy "hero_images_public_read" on public.hero_images for select using (true);
create policy "hero_images_admin_all" on public.hero_images for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger set_hero_images_updated_at before update on public.hero_images for each row execute function public.update_updated_at_column();

grant all on public.page_content_blocks to service_role;
grant select on public.page_content_blocks to anon, authenticated;
grant insert, update, delete on public.page_content_blocks to authenticated;
alter table public.page_content_blocks enable row level security;
create policy "page_content_blocks_public_read" on public.page_content_blocks for select using (true);
create policy "page_content_blocks_admin_all" on public.page_content_blocks for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger set_page_content_blocks_updated_at before update on public.page_content_blocks for each row execute function public.update_updated_at_column();

grant all on public.blog_posts to service_role;
grant select on public.blog_posts to anon, authenticated;
grant insert, update, delete on public.blog_posts to authenticated;
alter table public.blog_posts enable row level security;
create policy "blog_posts_public_read" on public.blog_posts for select using (true);
create policy "blog_posts_admin_all" on public.blog_posts for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger set_blog_posts_updated_at before update on public.blog_posts for each row execute function public.update_updated_at_column();

grant all on public.blog_post_views to service_role;
grant select, insert, update, delete on public.blog_post_views to authenticated;
grant insert on public.blog_post_views to anon;
alter table public.blog_post_views enable row level security;
create policy "blog_post_views_public_insert" on public.blog_post_views for insert to anon, authenticated with check (true);
create policy "blog_post_views_owner_select" on public.blog_post_views for select to authenticated using (auth.uid() = user_id);
create policy "blog_post_views_admin_all" on public.blog_post_views for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant all on public.blog_post_stats to service_role;
grant select on public.blog_post_stats to anon, authenticated;
grant insert, update, delete on public.blog_post_stats to authenticated;
alter table public.blog_post_stats enable row level security;
create policy "blog_post_stats_public_read" on public.blog_post_stats for select using (true);
create policy "blog_post_stats_admin_all" on public.blog_post_stats for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant all on public.adverts to service_role;
grant select on public.adverts to anon, authenticated;
grant insert, update, delete on public.adverts to authenticated;
alter table public.adverts enable row level security;
create policy "adverts_public_read" on public.adverts for select using (true);
create policy "adverts_admin_all" on public.adverts for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger set_adverts_updated_at before update on public.adverts for each row execute function public.update_updated_at_column();

grant all on public.team_members to service_role;
grant select on public.team_members to anon, authenticated;
grant insert, update, delete on public.team_members to authenticated;
alter table public.team_members enable row level security;
create policy "team_members_public_read" on public.team_members for select using (true);
create policy "team_members_admin_all" on public.team_members for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger set_team_members_updated_at before update on public.team_members for each row execute function public.update_updated_at_column();

grant all on public.testimonials to service_role;
grant select on public.testimonials to anon, authenticated;
grant insert, update, delete on public.testimonials to authenticated;
alter table public.testimonials enable row level security;
create policy "testimonials_public_read" on public.testimonials for select using (true);
create policy "testimonials_admin_all" on public.testimonials for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger set_testimonials_updated_at before update on public.testimonials for each row execute function public.update_updated_at_column();

grant all on public.certificates to service_role;
grant select on public.certificates to anon, authenticated;
grant insert, update, delete on public.certificates to authenticated;
alter table public.certificates enable row level security;
create policy "certificates_public_read" on public.certificates for select using (true);
create policy "certificates_admin_all" on public.certificates for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger set_certificates_updated_at before update on public.certificates for each row execute function public.update_updated_at_column();