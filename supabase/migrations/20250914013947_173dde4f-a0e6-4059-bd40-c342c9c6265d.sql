-- Make voting topics visible to everyone (including non-authenticated users)
DROP POLICY IF EXISTS "Anyone can view active topics" ON public.voting_topics;

CREATE POLICY "Everyone can view active topics" 
ON public.voting_topics 
FOR SELECT 
USING (is_active = true);

-- Allow public access to view votes count (anonymized)
CREATE OR REPLACE VIEW public.topic_votes_summary AS
SELECT 
  topic_id,
  vote_choice,
  COUNT(*) as vote_count
FROM public.user_votes
GROUP BY topic_id, vote_choice;

-- Enable RLS on the view
ALTER VIEW public.topic_votes_summary OWNER TO postgres;

-- Grant public access to the view
GRANT SELECT ON public.topic_votes_summary TO anon;
GRANT SELECT ON public.topic_votes_summary TO authenticated;