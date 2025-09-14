-- Créer une table pour tracker les tentatives d'inscription et empêcher les comptes multiples
CREATE TABLE public.registration_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address INET NOT NULL,
  user_agent TEXT,
  browser_fingerprint TEXT,
  email TEXT,
  user_id UUID,
  registration_attempts INTEGER DEFAULT 1,
  last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  blocked BOOLEAN DEFAULT false,
  block_reason TEXT
);

-- Activer RLS sur la table de tracking
ALTER TABLE public.registration_tracking ENABLE ROW LEVEL SECURITY;

-- Politique pour que seuls les admins puissent voir ces données
CREATE POLICY "Only admins can view registration tracking" 
ON public.registration_tracking 
FOR SELECT 
USING (false); -- Bloque tout accès par défaut, sera géré par des fonctions

-- Index pour optimiser les requêtes par IP
CREATE INDEX idx_registration_tracking_ip ON public.registration_tracking(ip_address);
CREATE INDEX idx_registration_tracking_email ON public.registration_tracking(email);
CREATE INDEX idx_registration_tracking_fingerprint ON public.registration_tracking(browser_fingerprint);

-- Fonction pour vérifier et enregistrer les tentatives d'inscription
CREATE OR REPLACE FUNCTION public.check_registration_attempt(
  p_ip_address INET,
  p_user_agent TEXT,
  p_browser_fingerprint TEXT,
  p_email TEXT
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing_record registration_tracking%ROWTYPE;
  v_ip_count INTEGER;
  v_fingerprint_count INTEGER;
  v_result jsonb;
BEGIN
  -- Vérifier si cette IP a déjà trop de comptes
  SELECT COUNT(*) INTO v_ip_count
  FROM registration_tracking 
  WHERE ip_address = p_ip_address 
    AND created_at > NOW() - INTERVAL '24 hours';
  
  -- Vérifier si ce fingerprint a déjà été utilisé
  SELECT COUNT(*) INTO v_fingerprint_count
  FROM registration_tracking 
  WHERE browser_fingerprint = p_browser_fingerprint
    AND browser_fingerprint IS NOT NULL
    AND created_at > NOW() - INTERVAL '7 days';
  
  -- Limites : max 3 comptes par IP par jour, 1 par fingerprint par semaine
  IF v_ip_count >= 3 THEN
    v_result := jsonb_build_object(
      'allowed', false,
      'reason', 'Trop de créations de comptes depuis cette adresse IP (limite: 3 par jour)'
    );
    
    -- Enregistrer la tentative bloquée
    INSERT INTO registration_tracking (
      ip_address, user_agent, browser_fingerprint, email, 
      blocked, block_reason
    ) VALUES (
      p_ip_address, p_user_agent, p_browser_fingerprint, p_email,
      true, 'IP limit exceeded'
    );
    
    RETURN v_result;
  END IF;
  
  IF v_fingerprint_count >= 1 AND p_browser_fingerprint IS NOT NULL THEN
    v_result := jsonb_build_object(
      'allowed', false,
      'reason', 'Un compte a déjà été créé depuis cet appareil récemment'
    );
    
    -- Enregistrer la tentative bloquée
    INSERT INTO registration_tracking (
      ip_address, user_agent, browser_fingerprint, email,
      blocked, block_reason
    ) VALUES (
      p_ip_address, p_user_agent, p_browser_fingerprint, p_email,
      true, 'Device fingerprint already used'
    );
    
    RETURN v_result;
  END IF;
  
  -- Vérifier s'il y a déjà un enregistrement pour cette IP
  SELECT * INTO v_existing_record
  FROM registration_tracking 
  WHERE ip_address = p_ip_address 
    AND email = p_email
  ORDER BY created_at DESC 
  LIMIT 1;
  
  IF FOUND THEN
    -- Mettre à jour l'enregistrement existant
    UPDATE registration_tracking 
    SET 
      registration_attempts = registration_attempts + 1,
      last_attempt_at = NOW(),
      user_agent = p_user_agent,
      browser_fingerprint = p_browser_fingerprint
    WHERE id = v_existing_record.id;
  ELSE
    -- Créer un nouvel enregistrement
    INSERT INTO registration_tracking (
      ip_address, user_agent, browser_fingerprint, email
    ) VALUES (
      p_ip_address, p_user_agent, p_browser_fingerprint, p_email
    );
  END IF;
  
  v_result := jsonb_build_object('allowed', true, 'reason', null);
  RETURN v_result;
END;
$$;

-- Fonction pour enregistrer une inscription réussie
CREATE OR REPLACE FUNCTION public.record_successful_registration(
  p_ip_address INET,
  p_email TEXT,
  p_user_id UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE registration_tracking 
  SET user_id = p_user_id
  WHERE ip_address = p_ip_address 
    AND email = p_email
    AND user_id IS NULL
  ORDER BY created_at DESC 
  LIMIT 1;
END;
$$;