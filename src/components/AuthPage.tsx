import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Shield, User, Mail, Lock, Smartphone } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate("/");
      }
    };
    checkUser();
  }, [navigate]);

  const handleSignUp = async () => {
    if (!email || !password || !fullName || !username) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username: username
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;

      toast({
        title: "Inscription réussie",
        description: "Vérifiez votre email pour confirmer votre compte",
      });
    } catch (error) {
      toast({
        title: "Erreur d'inscription",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if 2FA is enabled for the user
      const { data: profile } = await supabase
        .from('profiles')
        .select('two_factor_enabled')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (profile?.two_factor_enabled) {
        setShowTwoFactor(true);
      } else {
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const setupTwoFactor = async () => {
    try {
      const response = await supabase.functions.invoke('setup-2fa');
      if (response.data?.qrCode) {
        setQrCode(response.data.qrCode);
      }
    } catch (error) {
      toast({
        title: "Erreur 2FA",
        description: "Impossible de configurer l'authentification à deux facteurs",
        variant: "destructive"
      });
    }
  };

  const verifyTwoFactor = async () => {
    if (!twoFactorCode) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer le code de vérification",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await supabase.functions.invoke('verify-2fa', {
        body: { token: twoFactorCode }
      });

      if (response.data?.verified) {
        navigate("/");
      } else {
        toast({
          title: "Code invalide",
          description: "Le code de vérification est incorrect",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur de vérification",
        description: "Impossible de vérifier le code",
        variant: "destructive"
      });
    }
  };

  if (showTwoFactor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Authentification 2FA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="twoFactorCode">Code de vérification</Label>
              <Input
                id="twoFactorCode"
                type="text"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
              />
            </div>
            <Button
              onClick={verifyTwoFactor}
              disabled={loading}
              className="w-full"
            >
              Vérifier
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Démocratie Directe</CardTitle>
          <p className="text-muted-foreground">
            Connexion sécurisée par blockchain
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Mot de passe</Label>
                <Input
                  id="signin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <Button
                onClick={handleSignIn}
                disabled={loading}
                className="w-full"
              >
                <Mail className="mr-2 h-4 w-4" />
                Se connecter
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullname">Nom complet</Label>
                <Input
                  id="fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jean Dupont"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="jeandupont"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Mot de passe</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <Button
                onClick={handleSignUp}
                disabled={loading}
                className="w-full"
              >
                <User className="mr-2 h-4 w-4" />
                S'inscrire
              </Button>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-6 border-t">
            <div className="text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={setupTwoFactor}
                className="text-xs"
              >
                <Shield className="mr-2 h-3 w-3" />
                Configurer 2FA
              </Button>
            </div>
            
            {qrCode && (
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Scannez ce QR code avec votre app d'authentification
                </p>
                <div className="flex justify-center">
                  <QRCodeSVG value={qrCode} size={150} />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};