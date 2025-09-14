-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  wallet_address TEXT UNIQUE,
  verification_level INTEGER DEFAULT 1,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create voting topics table
CREATE TABLE public.voting_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  source TEXT,
  category TEXT NOT NULL,
  news_url TEXT,
  blockchain_hash TEXT UNIQUE,
  total_votes INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on voting topics
ALTER TABLE public.voting_topics ENABLE ROW LEVEL SECURITY;

-- Create policies for voting topics
CREATE POLICY "Anyone can view active topics" 
ON public.voting_topics 
FOR SELECT 
USING (is_active = TRUE);

-- Create user votes table
CREATE TABLE public.user_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES public.voting_topics(id) ON DELETE CASCADE,
  vote_choice TEXT NOT NULL CHECK (vote_choice IN ('pour', 'contre', 'abstention')),
  blockchain_tx_hash TEXT UNIQUE,
  vote_weight DECIMAL DEFAULT 1.0,
  voted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, topic_id)
);

-- Enable RLS on user votes
ALTER TABLE public.user_votes ENABLE ROW LEVEL SECURITY;

-- Create policies for user votes
CREATE POLICY "Users can view their own votes" 
ON public.user_votes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own votes" 
ON public.user_votes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create blockchain transactions table
CREATE TABLE public.blockchain_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_hash TEXT UNIQUE NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('vote', 'wallet_creation', 'token_transfer')),
  gas_used BIGINT,
  gas_price BIGINT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  block_number BIGINT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on blockchain transactions
ALTER TABLE public.blockchain_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for blockchain transactions
CREATE POLICY "Users can view their own transactions" 
ON public.blockchain_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create democracy tokens table
CREATE TABLE public.democracy_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_balance DECIMAL NOT NULL DEFAULT 0,
  earned_tokens DECIMAL NOT NULL DEFAULT 0,
  spent_tokens DECIMAL NOT NULL DEFAULT 0,
  last_reward_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);

-- Enable RLS on democracy tokens
ALTER TABLE public.democracy_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies for democracy tokens
CREATE POLICY "Users can view their own tokens" 
ON public.democracy_tokens 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tokens" 
ON public.democracy_tokens 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tokens" 
ON public.democracy_tokens 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_voting_topics_updated_at
  BEFORE UPDATE ON public.voting_topics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blockchain_transactions_updated_at
  BEFORE UPDATE ON public.blockchain_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_democracy_tokens_updated_at
  BEFORE UPDATE ON public.democracy_tokens
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'username'
  );
  
  INSERT INTO public.democracy_tokens (user_id, token_balance, earned_tokens)
  VALUES (NEW.id, 100, 100); -- Bonus initial de 100 tokens
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample voting topics
INSERT INTO public.voting_topics (title, description, category, source, news_url) VALUES
('Réforme des retraites : nouvelles propositions du gouvernement', 'Le gouvernement présente de nouvelles mesures pour la réforme des retraites incluant l''âge de départ et les cotisations.', 'Social', 'Le Figaro', 'https://www.lefigaro.fr/politique/retraites'),
('Transition énergétique : le débat sur le nucléaire relancé', 'Discussion sur l''avenir du nucléaire dans la stratégie énergétique française face aux enjeux climatiques.', 'Environnement', 'Le Monde', 'https://www.lemonde.fr/energies/nucleaire'),
('Immigration : nouvelles mesures proposées à l''Assemblée', 'Examen de nouvelles propositions de loi concernant l''immigration et l''intégration.', 'Société', 'Libération', 'https://www.liberation.fr/politique/immigration'),
('Budget 2024 : les priorités économiques en débat', 'Présentation et débat autour des orientations budgétaires pour l''année 2024.', 'Économie', 'Les Échos', 'https://www.lesechos.fr/economie/budget'),
('Éducation nationale : réforme du baccalauréat en discussion', 'Nouvelles propositions pour l''évolution du baccalauréat et de l''orientation post-bac.', 'Éducation', 'Le Parisien', 'https://www.leparisien.fr/societe/education');