import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Columns3, Users, Scale, Scroll } from "lucide-react";

export const AthenianDemocracy = () => {
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
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">L'Ecclésia</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                L'assemblée populaire où tous les citoyens athéniens pouvaient participer 
                aux débats et voter sur les lois.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardHeader className="text-center">
              <Scroll className="h-12 w-12 text-accent mx-auto mb-2" />
              <CardTitle className="text-lg">L'Ostracisme</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Procédure permettant d'exiler temporairement un citoyen jugé 
                dangereux pour la démocratie.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardHeader className="text-center">
              <Scale className="h-12 w-12 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">L'Héliée</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Tribunal populaire composé de 6000 citoyens tirés au sort 
                pour rendre la justice.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardHeader className="text-center">
              <Columns3 className="h-12 w-12 text-accent mx-auto mb-2" />
              <CardTitle className="text-lg">La Boulè</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Conseil de 500 membres tiré au sort, préparant les décisions 
                de l'assemblée populaire.
              </p>
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
        </Card>
      </div>
    </section>
  );
};