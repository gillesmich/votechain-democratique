-- Analyse et correction des fonctions SECURITY DEFINER
-- Certaines fonctions DOIVENT rester SECURITY DEFINER pour des raisons de sécurité
-- D'autres peuvent être converties en SECURITY INVOKER pour plus de sécurité

-- 1. handle_new_user: DOIT rester SECURITY DEFINER car elle est appelée par un trigger 
--    et a besoin d'accès aux tables même si l'utilisateur n'est pas encore créé
-- GARDE: SECURITY DEFINER (nécessaire)

-- 2. check_registration_attempt et record_successful_registration: 
--    DOIVENT rester SECURITY DEFINER car elles accèdent à registration_tracking
--    qui a une RLS très restrictive (seuls les admins peuvent lire)
-- GARDE: SECURITY DEFINER (nécessaire)

-- 3. increment_vote_count: Peut être convertie en SECURITY INVOKER
--    Car elle ne fait qu'incrémenter un compteur sur une table publique
-- CONVERSION: SECURITY DEFINER → SECURITY INVOKER

-- Recréer increment_vote_count en SECURITY INVOKER
CREATE OR REPLACE FUNCTION public.increment_vote_count(topic_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER  -- Changement ici: utilise les permissions de l'utilisateur appelant
SET search_path = 'public'
AS $$
BEGIN
  UPDATE public.voting_topics 
  SET total_votes = total_votes + 1 
  WHERE id = topic_id;
END;
$$;

-- Ajouter un commentaire explicatif pour clarifier la sécurité
COMMENT ON FUNCTION public.increment_vote_count(uuid) IS 
'Increments vote count for a topic. Uses SECURITY INVOKER to respect caller permissions and RLS policies.';

-- Les autres fonctions SECURITY DEFINER sont justifiées car:
-- - handle_new_user: trigger d''authentification, doit pouvoir insérer même sans user actuel
-- - check_registration_attempt: accède à registration_tracking avec RLS admin-only
-- - record_successful_registration: accède à registration_tracking avec RLS admin-only