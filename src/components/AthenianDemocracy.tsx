import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Columns3, Users, Scale, Scroll, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AthenianDemocracy = () => {
  const navigate = useNavigate();
  return (
    <section className="py-16 bg-gradient-to-br from-background via-secondary to-accent/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            La Démocratie Athénienne
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez les fondements de la démocratie directe, née dans l'Athènes antique 
            au Ve siècle avant J.-C., où chaque citoyen participait directement aux décisions politiques.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card 
            className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => navigate('/athenian-democracy/ecclesia')}
          >
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-lg group-hover:text-primary transition-colors">L'Ecclésia</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                L'assemblée populaire où tous les citoyens athéniens pouvaient participer 
                aux débats et voter sur les lois.
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-3 group-hover:bg-primary/10"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/athenian-democracy/ecclesia');
                }}
              >
                En savoir plus <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => navigate('/athenian-democracy/ostracism')}
          >
            <CardHeader className="text-center">
              <Scroll className="h-12 w-12 text-accent mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-lg group-hover:text-primary transition-colors">L'Ostracisme</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Procédure permettant d'exiler temporairement un citoyen jugé 
                dangereux pour la démocratie.
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-3 group-hover:bg-primary/10"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/athenian-democracy/ostracism');
                }}
              >
                En savoir plus <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => navigate('/athenian-democracy/heliaia')}
          >
            <CardHeader className="text-center">
              <Scale className="h-12 w-12 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-lg group-hover:text-primary transition-colors">L'Héliée</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Tribunal populaire composé de 6000 citoyens tirés au sort 
                pour rendre la justice.
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-3 group-hover:bg-primary/10"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/athenian-democracy/heliaia');
                }}
              >
                En savoir plus <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => navigate('/athenian-democracy/boule')}
          >
            <CardHeader className="text-center">
              <Columns3 className="h-12 w-12 text-accent mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <CardTitle className="text-lg group-hover:text-primary transition-colors">La Boulè</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Conseil de 500 membres tiré au sort, préparant les décisions 
                de l'assemblée populaire.
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-3 group-hover:bg-primary/10"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/athenian-democracy/boule');
                }}
              >
                En savoir plus <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/20 bg-gradient-to-r from-card/90 to-primary/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-primary">
              Les Principes Fondamentaux
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <h4 className="font-semibold text-lg mb-2 text-foreground">Isonomie</h4>
              <p className="text-sm text-muted-foreground">
                Égalité politique de tous les citoyens devant la loi
              </p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-lg mb-2 text-foreground">Iségorie</h4>
              <p className="text-sm text-muted-foreground">
                Droit égal de parole pour tous dans l'assemblée
              </p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-lg mb-2 text-foreground">Isokratie</h4>
              <p className="text-sm text-muted-foreground">
                Participation égale au pouvoir politique
              </p>
            </div>
          </CardContent>
          <div className="flex gap-4">
            <Button 
              onClick={() => navigate('/athenian-democracy')}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Explorer en Détail
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              onClick={() => navigate('/athenian-democracy/principles')}
              variant="outline"
              className="flex-1"
            >
              Voir les Principes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};