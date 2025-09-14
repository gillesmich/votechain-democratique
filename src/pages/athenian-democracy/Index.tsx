import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Scale, Scroll, Columns3, Star, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AthenianDemocracyIndex = () => {
  const navigate = useNavigate();

  const topics = [
    {
      id: "ecclesia",
      title: "L'Ecclésia",
      icon: Users,
      description: "L'assemblée populaire où tous les citoyens athéniens participaient directement aux débats et aux votes",
      keyPoints: ["6000 citoyens en moyenne", "Vote à main levée", "Débats ouverts"]
    },
    {
      id: "ostracism",
      title: "L'Ostracisme", 
      icon: Scroll,
      description: "Procédure démocratique d'exil temporaire pour protéger la démocratie des personnalités trop influentes",
      keyPoints: ["Vote annuel", "Exil de 10 ans", "Protection de la démocratie"]
    },
    {
      id: "heliaia",
      title: "L'Héliée",
      icon: Scale,
      description: "Le tribunal populaire composé de citoyens tirés au sort pour rendre la justice",
      keyPoints: ["6000 jurés", "Tirage au sort", "Justice populaire"]
    },
    {
      id: "boule",
      title: "La Boulè",
      icon: Columns3,
      description: "Le conseil des 500 qui préparait les décisions de l'assemblée populaire",
      keyPoints: ["500 membres", "Mandat d'un an", "Préparation des lois"]
    },
    {
      id: "principles",
      title: "Principes Fondamentaux",
      icon: Star,
      description: "Les trois piliers de la démocratie athénienne : Isonomie, Iségorie et Isokratie",
      keyPoints: ["Égalité devant la loi", "Droit de parole", "Participation au pouvoir"]
    }
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-foreground">
          La Démocratie Athénienne Antique
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Découvrez les institutions et principes qui ont fondé la première démocratie de l'histoire, 
          née à Athènes au Ve siècle avant J.-C. Un système révolutionnaire où chaque citoyen 
          participait directement aux décisions politiques.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {topics.map((topic) => (
          <Card 
            key={topic.id}
            className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => navigate(`/athenian-democracy/${topic.id}`)}
          >
            <CardHeader className="text-center">
              <topic.icon className="h-12 w-12 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                {topic.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {topic.description}
              </p>
              <ul className="space-y-1 mb-4">
                {topic.keyPoints.map((point, index) => (
                  <li key={index} className="text-xs text-muted-foreground flex items-center">
                    <span className="w-1 h-1 bg-primary rounded-full mr-2"></span>
                    {point}
                  </li>
                ))}
              </ul>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                En savoir plus
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-primary/20 bg-gradient-to-r from-card/90 to-primary/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-primary">
            L'Héritage de la Démocratie Athénienne
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Bien que limitée aux citoyens masculins athéniens, cette première expérience démocratique 
            a posé les bases de nos systèmes politiques modernes. Les principes d'égalité, de participation 
            citoyenne et de délibération collective continuent d'inspirer les démocraties contemporaines.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};