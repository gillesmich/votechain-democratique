import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, Rss } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const RSSManager = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchRSSTopics = async () => {
    setLoading(true);
    try {
      console.log('Déclenching RSS fetch for September 2025...');
      const response = await supabase.functions.invoke('fetch-rss-topics');
      
      if (response.error) {
        console.error('RSS function error:', response.error);
        throw response.error;
      }

      console.log('RSS response:', response.data);

      toast({
        title: "Actualisation réussie",
        description: response.data?.message || "Nouveaux sujets d'actualité récupérés pour septembre 2025",
      });

      // Wait a bit before refreshing to ensure data is processed
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('RSS fetch error:', error);
      toast({
        title: "Erreur d'actualisation",
        description: error.message || "Impossible de récupérer les derniers sujets d'actualité",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-accent/20 bg-gradient-to-r from-card/90 to-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rss className="h-5 w-5 text-accent" />
          Flux RSS Automatique
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Les sujets politiques sont automatiquement collectés depuis les principaux 
          médias français : Le Monde, Le Figaro, Libération, Les Échos et Franceinfo.
        </p>
        <Button 
          onClick={fetchRSSTopics}
          disabled={loading}
          className="w-full"
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Actualisation...' : 'Actualiser les sujets'}
        </Button>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>• Le Monde</div>
          <div>• Le Figaro</div>
          <div>• Libération</div>
          <div>• Les Échos</div>
          <div>• Franceinfo</div>
          <div>• Mise à jour auto</div>
        </div>
      </CardContent>
    </Card>
  );
};