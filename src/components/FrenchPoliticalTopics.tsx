import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Vote, Clock, Newspaper, TrendingUp, CheckCircle, ExternalLink, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RSSManager } from "@/components/RSSManager";


interface Topic {
  id: string;
  title: string;
  description: string;
  source: string;
  category: string;
  news_url: string;
  total_votes: number;
  created_at: string;
}

// Helper function for category colors
const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    "Social": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    "Environnement": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    "Société": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    "Économie": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    "Éducation": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
  };
  return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
};

// Helper function for time ago
const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return "Il y a moins d'une heure";
  if (diffInHours < 24) return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
};

export const FrenchPoliticalTopics = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());
  const [userVoteChoices, setUserVoteChoices] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [votingLoading, setVotingLoading] = useState<string | null>(null);
  const [showVoteConfirmation, setShowVoteConfirmation] = useState(false);
  const [lastVoteChoice, setLastVoteChoice] = useState<string>("");
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchTopics();
    if (user) {
      fetchUserVotes();
    }
  }, [user]);

  const fetchTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('voting_topics')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTopics(data || []);
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVotes = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_votes')
        .select('topic_id, vote_choice')
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Créer un Set des IDs des sujets votés
      setUserVotes(new Set(data?.map(vote => vote.topic_id) || []));
      
      // Créer une Map des choix de vote par sujet
      const voteChoicesMap = new Map();
      data?.forEach(vote => {
        voteChoicesMap.set(vote.topic_id, vote.vote_choice);
      });
      setUserVoteChoices(voteChoicesMap);
    } catch (error) {
      console.error('Error fetching user votes:', error);
    }
  };

  const handleVote = async (topicId: string, voteChoice: 'pour' | 'contre' | 'abstention') => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour voter",
        variant: "destructive"
      });
      return;
    }

    if (userVotes.has(topicId)) {
      toast({
        title: "Vote déjà effectué",
        description: "Vous avez déjà voté sur ce sujet",
        variant: "destructive"
      });
      return;
    }

    setVotingLoading(topicId);
    try {
      const response = await supabase.functions.invoke('cast-vote', {
        body: { topicId, voteChoice }
      });

      if (response.error) throw response.error;

      setUserVotes(new Set(userVotes.add(topicId)));
      setUserVoteChoices(new Map(userVoteChoices.set(topicId, voteChoice)));
      await fetchTopics(); // Refresh to get updated vote counts

      // Show confirmation popup
      setLastVoteChoice(voteChoice);
      setShowVoteConfirmation(true);
    } catch (error) {
      toast({
        title: "Erreur de vote",
        description: error.message || "Impossible d'enregistrer votre vote",
        variant: "destructive"
      });
    } finally {
      setVotingLoading(null);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement des sujets politiques...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Sujets Politiques Français
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Participez à la démocratie directe en votant sur les sujets d'actualité 
            issus des grands médias français. Votre voix compte dans le débat national.
          </p>
        </div>

        <div className="max-w-md mx-auto mb-8">
          <RSSManager />
        </div>

        <div className="grid gap-6 max-w-4xl mx-auto">
          {topics.map((topic) => (
            <Card 
              key={topic.id} 
              className={`border transition-all duration-300 cursor-pointer hover:shadow-lg ${
                selectedTopic === topic.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border bg-card'
              }`}
              onClick={() => setSelectedTopic(selectedTopic === topic.id ? null : topic.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getCategoryColor(topic.category)}>
                        {topic.category}
                      </Badge>
                      {userVotes.has(topic.id) && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Voté: {userVoteChoices.get(topic.id)?.charAt(0).toUpperCase() + userVoteChoices.get(topic.id)?.slice(1)}
                        </Badge>
                      )}
                      {topic.total_votes > 100 && (
                        <Badge variant="outline" className="border-accent text-accent">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Tendance
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg leading-tight">
                      {topic.title}
                    </CardTitle>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <Vote className="h-4 w-4" />
                      {topic.total_votes} votes
                    </div>
                    <div className="space-x-2">
                      {user ? (
                        userVotes.has(topic.id) ? (
                          <div className="flex flex-col gap-2">
                            <Badge variant="default" className="bg-green-600 text-white">
                              Votre vote: {userVoteChoices.get(topic.id)?.charAt(0).toUpperCase() + userVoteChoices.get(topic.id)?.slice(1)}
                            </Badge>
                            <div className="flex gap-2 opacity-50">
                              <Button size="sm" variant="outline" disabled className="bg-green-50 border-green-200 text-green-700">Pour</Button>
                              <Button size="sm" variant="outline" disabled className="bg-red-50 border-red-200 text-red-700">Contre</Button>
                              <Button size="sm" variant="outline" disabled className="bg-gray-50 border-gray-200 text-gray-700">Abstention</Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVote(topic.id, 'pour');
                              }}
                              disabled={votingLoading === topic.id}
                              className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                            >
                              Pour
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVote(topic.id, 'contre');
                              }}
                              disabled={votingLoading === topic.id}
                              className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                            >
                              Contre
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVote(topic.id, 'abstention');
                              }}
                              disabled={votingLoading === topic.id}
                              className="bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                            >
                               Abstention
                             </Button>
                           </>
                        )
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = '/auth';
                          }}
                        >
                          Se connecter pour voter
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              {selectedTopic === topic.id && (
                <CardContent className="border-t bg-muted/30">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Newspaper className="h-4 w-4" />
                      Source: {topic.source}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {getTimeAgo(topic.created_at)}
                    </div>
                  </div>
                  
                  {/* Données objectives du sujet */}
                  <div className="mt-4 p-4 bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <TrendingUp className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-2">📊 Données objectives extraites</h4>
                        {topic.description.includes('DONNÉES PRÉCISES:') ? (
                          <div className="text-sm leading-relaxed">
                            {topic.description.split('DONNÉES PRÉCISES:')[1]?.split('•').map((data, index) => (
                              data.trim() && (
                                <div key={index} className="flex items-center gap-2 mb-1 p-2 bg-background/60 rounded border-l-2 border-primary">
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                  <span className="font-medium text-foreground">{data.trim()}</span>
                                </div>
                              )
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded border border-destructive/30">
                            <span className="text-destructive font-medium">⚠️ Données insuffisantes</span>
                            <p className="mt-1">Ce sujet n'a pas assez de données quantifiées pour un vote éclairé et devrait être retiré.</p>
                          </div>
                        )}
                        
                        {/* Lien vers l'article source */}
                         {topic.news_url && (
                           <div className="mt-3 pt-3 border-t border-border/50">
                             <a 
                               href={topic.news_url} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors group"
                               onClick={(e) => e.stopPropagation()}
                               onError={(e) => {
                                 console.error('Lien article non accessible:', topic.news_url);
                                 e.currentTarget.classList.add('text-destructive');
                                 e.currentTarget.innerHTML = '<span class="text-destructive">⚠️ Lien article non disponible</span>';
                               }}
                             >
                               <ExternalLink className="h-4 w-4 group-hover:scale-110 transition-transform" />
                               Lire l'article complet sur {topic.source}
                               <span className="text-xs text-muted-foreground ml-1">(source externe)</span>
                             </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-background/50 rounded-lg">
                    <div className="mb-4">
                      <h4 className="font-semibold text-foreground mb-2">📄 Contexte de l'article</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {topic.description.includes('CONTEXTE:') 
                          ? topic.description.split('CONTEXTE:')[1]?.split('FAITS CHIFFRÉS:')[0]?.split('DONNÉES PRÉCISES:')[0]?.trim() 
                          : topic.description.includes('RÉSUMÉ:')
                          ? topic.description.split('RÉSUMÉ:')[1]?.split('DONNÉES OBJECTIVES:')[0]?.split('DONNÉES PRÉCISES:')[0]?.trim()
                          : topic.description.split('DONNÉES OBJECTIVES:')[0]?.split('DONNÉES PRÉCISES:')[0]?.trim() || topic.description}
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-foreground mb-2">Choix proposés</h4>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                          <span className="font-medium text-green-800 dark:text-green-200">Pour</span>
                          <p className="text-green-600 dark:text-green-400 text-xs mt-1">Soutenir cette proposition</p>
                        </div>
                        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                          <span className="font-medium text-red-800 dark:text-red-200">Contre</span>
                          <p className="text-red-600 dark:text-red-400 text-xs mt-1">S'opposer à cette proposition</p>
                        </div>
                        <div className="p-2 bg-gray-50 dark:bg-gray-900/20 rounded border border-gray-200 dark:border-gray-800">
                          <span className="font-medium text-gray-800 dark:text-gray-200">Abstention</span>
                          <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">Ne pas prendre position</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
                      <strong>Note :</strong> Votre vote contribue à mesurer l'opinion publique sur cette question. 
                      Les résultats sont enregistrés de manière sécurisée via la blockchain.
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Card className="inline-block p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                <Vote className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-foreground">Vote Sécurisé par Blockchain</h3>
                <p className="text-sm text-muted-foreground">
                  Chaque vote est cryptographiquement sécurisé et vérifiable
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Vote Confirmation Dialog */}
        <Dialog open={showVoteConfirmation} onOpenChange={setShowVoteConfirmation}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Vote confirmé
              </DialogTitle>
              <DialogDescription asChild>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="h-10 w-10 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        Le citoyen <span className="font-bold">{user?.email || "Utilisateur"}</span> a voté
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300">
                        Vote: <span className="font-semibold capitalize">{lastVoteChoice}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Votre vote a été enregistré de manière sécurisée sur la blockchain et contribue au débat démocratique.
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center pt-4">
              <Button 
                onClick={() => setShowVoteConfirmation(false)}
                className="w-full"
              >
                Continuer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};