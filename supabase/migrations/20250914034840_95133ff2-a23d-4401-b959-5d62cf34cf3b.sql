-- Correction finale du problème SECURITY DEFINER
-- Approche: Changer le propriétaire des objets problématiques

-- 1. Changer le propriétaire de la vue topic_votes_summary
ALTER VIEW public.topic_votes_summary OWNER TO authenticator;

-- 2. Les fonctions SECURITY DEFINER dans le schéma public doivent être évaluées:
-- handle_new_user: DOIT rester SECURITY DEFINER (pour trigger auth)
-- check_registration_attempt: DOIT rester SECURITY DEFINER (accès table admin-only)
-- record_successful_registration: DOIT rester SECURITY DEFINER (accès table admin-only)

-- 3. Mais on peut changer leur propriétaire vers authenticator pour plus de sécurité
ALTER FUNCTION public.handle_new_user() OWNER TO authenticator;
ALTER FUNCTION public.check_registration_attempt(inet, text, text, text) OWNER TO authenticator;
ALTER FUNCTION public.record_successful_registration(inet, text, uuid) OWNER TO authenticator;

-- 4. Ajouter des commentaires pour documenter pourquoi ces fonctions sont SECURITY DEFINER
COMMENT ON FUNCTION public.handle_new_user() IS 
'SECURITY DEFINER required: Trigger function needs elevated privileges to insert into profiles and democracy_tokens during user creation.';

COMMENT ON FUNCTION public.check_registration_attempt(inet, text, text, text) IS 
'SECURITY DEFINER required: Needs access to registration_tracking table which has admin-only RLS policies.';

COMMENT ON FUNCTION public.record_successful_registration(inet, text, uuid) IS 
'SECURITY DEFINER required: Needs access to registration_tracking table which has admin-only RLS policies.';