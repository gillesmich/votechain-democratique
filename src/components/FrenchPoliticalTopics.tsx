import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Vote, Clock, Newspaper, TrendingUp } from "lucide-react";

// Simulation de sujets politiques français
const mockTopics = [
  {
    id: 1,
    title: "Réforme des retraites : nouvelles propositions du gouvernement",
    source: "Le Figaro",
    timestamp: "Il y a 2 heures",
    category: "Social",
    votes: 2847,
    trending: true
  },
  {
    id: 2,
    title: "Transition énergétique : le débat sur le nucléaire relancé",
    source: "Le Monde",
    timestamp: "Il y a 4 heures",
    category: "Environnement",
    votes: 1923,
    trending: false
  },
  {
    id: 3,
    title: "Immigration : nouvelles mesures proposées à l'Assemblée",
    source: "Libération",
    timestamp: "Il y a 6 heures",
    category: "Société",
    votes: 3156,
    trending: true
  },
  {
    id: 4,
    title: "Budget 2024 : les priorités économiques en débat",
    source: "Les Échos",
    timestamp: "Il y a 8 heures",
    category: "Économie",
    votes: 1687,
    trending: false
  },
  {
    id: 5,
    title: "Éducation nationale : réforme du baccalauréat en discussion",
    source: "Le Parisien",
    timestamp: "Il y a 12 heures",
    category: "Éducation",
    votes: 2341,
    trending: false
  }
];

export const FrenchPoliticalTopics = () => {
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [userVotes, setUserVotes] = useState<Set<number>>(new Set());

  const handleVote = (topicId: number) => {
    if (!userVotes.has(topicId)) {
      setUserVotes(new Set(userVotes.add(topicId)));
      // Ici on ajouterait la logique blockchain pour enregistrer le vote
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Social": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      "Environnement": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      "Société": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      "Économie": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      "Éducation": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Sujets Politiques Français
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Participez à la démocratie directe en votant sur les sujets d'actualité 
            issus des grands médias français. Votre voix compte dans le débat national.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Newspaper className="h-5 w-5 text-accent" />
            <span className="text-sm text-muted-foreground">
              Flux automatique depuis les principales sources d'information
            </span>
          </div>
        </div>

        <div className="grid gap-6 max-w-4xl mx-auto">
          {mockTopics.map((topic) => (
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
                      {topic.trending && (
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
                      {topic.votes} votes
                    </div>
                    <Button
                      size="sm"
                      variant={userVotes.has(topic.id) ? "default" : "outline"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(topic.id);
                      }}
                      disabled={userVotes.has(topic.id)}
                    >
                      {userVotes.has(topic.id) ? "Voté" : "Voter"}
                    </Button>
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
                      {topic.timestamp}
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-background/50 rounded-lg">
                    <p className="text-sm">
                      <strong>Contexte :</strong> Ce sujet fait partie des débats nationaux actuels. 
                      Votre participation à ce vote contribue à mesurer l'opinion publique sur cette question.
                      Les résultats seront enregistrés de manière sécurisée via la blockchain.
                    </p>
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