-- Correction du problème SECURITY DEFINER VIEW
-- Le problème : la vue topic_votes_summary est détenue par 'postgres' au lieu de 'authenticator'
-- Cela fait que la vue peut contourner les politiques RLS

-- Solution : Supprimer et recréer la vue avec le bon propriétaire (authenticator)
-- et s'assurer qu'elle respecte les politiques RLS

-- 1. Supprimer la vue existante
DROP VIEW IF EXISTS public.topic_votes_summary;

-- 2. Recréer la vue avec SECURITY INVOKER explicite (bien que ce soit le défaut)
-- Cela garantit que la vue utilise les permissions de l'utilisateur qui l'exécute
CREATE VIEW public.topic_votes_summary
WITH (security_invoker = true)  -- Force l'utilisation des permissions de l'invoqueur
AS
SELECT 
    topic_id,
    vote_choice,
    count(*) AS vote_count
FROM public.user_votes
GROUP BY topic_id, vote_choice;

-- 3. Changer le propriétaire de la vue vers authenticator (rôle standard Supabase)
ALTER VIEW public.topic_votes_summary OWNER TO authenticator;

-- 4. Accorder les permissions appropriées
GRANT SELECT ON public.topic_votes_summary TO authenticated;
GRANT SELECT ON public.topic_votes_summary TO anon;

-- 5. Ajouter un commentaire explicatif
COMMENT ON VIEW public.topic_votes_summary IS 
'Summary of votes by topic and choice. Uses SECURITY INVOKER to respect RLS policies from user_votes table.';

-- Vérification : La vue respectera maintenant les politiques RLS de la table user_votes
-- Les utilisateurs ne verront que les votes qu'ils ont le droit de voir selon les politiques RLS