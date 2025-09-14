-- Correction du problème SECURITY DEFINER VIEW avec approche alternative
-- Le problème : la vue topic_votes_summary est détenue par 'postgres' au lieu de 'authenticator'

-- Approche alternative : Supprimer et recréer la vue en tant qu'utilisateur administrateur
-- puis configurer les bonnes permissions

-- 1. Supprimer la vue existante
DROP VIEW IF EXISTS public.topic_votes_summary;

-- 2. Recréer la vue simple (sans options spéciales qui pourraient causer des problèmes de permissions)
CREATE VIEW public.topic_votes_summary AS
SELECT 
    topic_id,
    vote_choice,
    count(*) AS vote_count
FROM public.user_votes
GROUP BY topic_id, vote_choice;

-- 3. S'assurer que les bonnes permissions sont accordées
GRANT SELECT ON public.topic_votes_summary TO authenticated;
GRANT SELECT ON public.topic_votes_summary TO anon;

-- Note: Cette vue utilisera maintenant les permissions par défaut (SECURITY INVOKER)
-- et respectera les politiques RLS de la table sous-jacente user_votes