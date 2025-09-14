-- Supprimer tous les sujets existants
DELETE FROM voting_topics;

-- Remettre les compteurs à zéro
DELETE FROM user_votes;