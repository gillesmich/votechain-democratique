import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { User, Coins, Shield, Wallet, LogOut } from "lucide-react";

interface Profile {
  username: string;
  full_name: string;
  wallet_address: string;
  verification_level: number;
}

interface Tokens {
  token_balance: number;
  earned_tokens: number;
  spent_tokens: number;
}

export const UserProfile = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchTokens();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, wallet_address, verification_level')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTokens = async () => {
    try {
      const { data, error } = await supabase
        .from('democracy_tokens')
        .select('token_balance, earned_tokens, spent_tokens')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setTokens(data);
    } catch (error) {
      console.error('Error fetching tokens:', error);
    }
  };

  const createWallet = async () => {
    try {
      const response = await supabase.functions.invoke('create-wallet');
      if (response.data?.walletAddress) {
        setProfile(prev => prev ? { ...prev, wallet_address: response.data.walletAddress } : null);
        toast({
          title: "Portefeuille créé",
          description: "Votre portefeuille blockchain a été créé avec succès",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le portefeuille",
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profil Utilisateur
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nom complet</p>
              <p className="font-medium">{profile?.full_name || "Non renseigné"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nom d'utilisateur</p>
              <p className="font-medium">@{profile?.username || "Non renseigné"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Niveau de vérification</p>
              <Badge variant={profile?.verification_level === 1 ? "secondary" : "default"}>
                Niveau {profile?.verification_level}
              </Badge>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Portefeuille Blockchain
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profile?.wallet_address ? (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Adresse du portefeuille</p>
              <p className="font-mono text-sm bg-muted p-2 rounded">
                {profile.wallet_address}
              </p>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">
                Vous n'avez pas encore de portefeuille blockchain
              </p>
              <Button onClick={createWallet}>
                <Wallet className="h-4 w-4 mr-2" />
                Créer un portefeuille
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Jetons Démocratie
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tokens ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <p className="text-2xl font-bold text-primary">{tokens.token_balance}</p>
                <p className="text-sm text-muted-foreground">Solde actuel</p>
              </div>
              <div className="text-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{tokens.earned_tokens}</p>
                <p className="text-sm text-muted-foreground">Jetons gagnés</p>
              </div>
              <div className="text-center p-4 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{tokens.spent_tokens}</p>
                <p className="text-sm text-muted-foreground">Jetons dépensés</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center">Chargement des données des jetons...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};