REVOKE ALL ON FUNCTION public.is_admin(uuid) FROM anon;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;