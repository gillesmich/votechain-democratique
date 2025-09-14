-- Create function to increment vote count
CREATE OR REPLACE FUNCTION increment_vote_count(topic_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.voting_topics 
  SET total_votes = total_votes + 1 
  WHERE id = topic_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;