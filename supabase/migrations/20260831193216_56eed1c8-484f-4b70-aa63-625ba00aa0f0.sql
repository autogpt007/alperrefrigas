-- Foundation migration: app_role, profiles, user_roles, and auth helper functions
create type public.app_role as enum ('admin', 'moderator', 'user');

create table public.profiles (
  created_at timestamp with time zone null default now(),
  email text null,
  full_name text null,
  id uuid not null references auth.users(id) on delete cascade primary key,
  updated_at timestamp with time zone null default now()
);

create table public.user_roles (
  created_at timestamp with time zone not null default now(),
  id uuid not null default gen_random_uuid() primary key,
  role public.app_role not null,
  updated_at timestamp with time zone not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade
);

alter table public.user_roles add constraint user_roles_user_id_role_unique unique (user_id, role);

alter table public.profiles enable row level security;
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
grant select on public.profiles to anon;

alter table public.user_roles enable row level security;
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role);
$$;

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role(auth.uid(), 'admin');
$$;

create or replace function public.is_admin_user() returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role(auth.uid(), 'admin');
$$;

create or replace function public.get_current_user_role() returns text language sql stable security definer set search_path = public as $$
  select coalesce((select role::text from public.user_roles where user_id = auth.uid() limit 1), 'user');
$$;

create or replace function public.assign_user_role(target_user_id uuid, new_role text) returns boolean language plpgsql security definer set search_path = public as $$
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

create or replace function public.can_access_order(order_user_id uuid, order_num text default null) returns boolean language sql stable security definer set search_path = public as $$
  select public.is_admin() or (auth.uid() is not null and auth.uid() = order_user_id);
$$;

create or replace function public.get_db_health() returns jsonb language sql stable set search_path = public as $$
  select jsonb_build_object('ok', true);
$$;

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name) values (new.id, new.email, new.raw_user_meta_data->>'full_name') on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'user') on conflict do nothing;
  return new;
end;
$$;

create trigger handle_new_user after insert on auth.users for each row execute function public.handle_new_user();

create policy "Users manage own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "Admins manage profiles" on public.profiles for all using (public.is_admin());
create policy "Users read own role" on public.user_roles for select using (auth.uid() = user_id);
create policy "Admins manage roles" on public.user_roles for all using (public.is_admin());