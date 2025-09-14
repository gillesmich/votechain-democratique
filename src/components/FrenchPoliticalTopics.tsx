import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Vote, Clock, Newspaper, TrendingUp, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


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
  const [loading, setLoading] = useState(true);
  const [votingLoading, setVotingLoading] = useState<string | null>(null);
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
        .select('topic_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setUserVotes(new Set(data?.map(vote => vote.topic_id) || []));
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
      await fetchTopics(); // Refresh to get updated vote counts

      toast({
        title: "Vote enregistré",
        description: `Votre vote "${voteChoice}" a été enregistré sur la blockchain`,
      });
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
                          Voté
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
                          <Badge variant="default">Voté</Badge>
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
                  <div className="mt-4 p-4 bg-background/50 rounded-lg">
                    <div className="mb-4">
                      <h4 className="font-semibold text-foreground mb-2">Résumé du sujet</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {topic.description}
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
      </div>
    </section>
  );
};