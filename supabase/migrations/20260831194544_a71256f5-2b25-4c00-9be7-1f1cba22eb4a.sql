revoke all on function public.assign_user_role(uuid, text) from anon, authenticated, public;
revoke all on function public.handle_new_user() from anon, authenticated, public;
revoke all on function public.can_access_order(uuid, text) from anon, authenticated, public;
revoke all on function public.is_admin_user() from anon, authenticated, public;
revoke all on function public.get_current_user_role() from anon, public;
revoke all on function public.get_db_health() from anon, public;

grant execute on function public.assign_user_role(uuid, text) to service_role;
grant execute on function public.handle_new_user() to service_role;
grant execute on function public.can_access_order(uuid, text) to service_role;
grant execute on function public.is_admin_user() to service_role;
grant execute on function public.get_current_user_role() to authenticated, service_role;
grant execute on function public.get_db_health() to service_role;