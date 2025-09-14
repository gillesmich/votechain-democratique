-- Correction alternative pour le problème SECURITY DEFINER VIEW
-- Comme nous ne pouvons pas changer le propriétaire, nous allons recréer la vue différemment

-- 1. Supprimer la vue existante
DROP VIEW IF EXISTS public.topic_votes_summary;

-- 2. Recréer la vue avec une approche sécurisée
-- Utiliser SECURITY INVOKER explicitement pour forcer l'utilisation des permissions de l'utilisateur
CREATE VIEW public.topic_votes_summary
WITH (security_invoker = true)
AS
SELECT 
    topic_id,
    vote_choice,
    count(*) AS vote_count
FROM public.user_votes
GROUP BY topic_id, vote_choice;

-- 3. Définir les permissions appropriées pour les rôles Supabase
GRANT SELECT ON public.topic_votes_summary TO authenticated;
GRANT SELECT ON public.topic_votes_summary TO anon;

-- 4. Ajouter un commentaire explicatif sur la sécurité
COMMENT ON VIEW public.topic_votes_summary IS 
'Vote summary view with SECURITY INVOKER - respects RLS policies from underlying user_votes table';

-- Alternative : Si la vue pose toujours problème, nous pourrions la remplacer par une fonction
-- qui respecte automatiquement les politiques RLS