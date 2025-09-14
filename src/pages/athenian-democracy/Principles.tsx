import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Scale, Users, MessageCircle, Crown, Globe } from "lucide-react";

export const Principles = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
          <Star className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-foreground">Principes Fondamentaux</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Les trois piliers philosophiques et pratiques qui ont fondé la démocratie athénienne 
          et continuent d'inspirer les systèmes démocratiques modernes.
        </p>
      </div>

      <div className="grid lg:grid-cols-1 gap-8 mb-12">
        <div className="space-y-8">
          {/* Isonomie */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Scale className="h-8 w-8 text-primary" />
                Isonomie (Ἰσονομία)
                <Badge className="bg-primary/20 text-primary">Égalité devant la Loi</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-foreground">Définition et Portée</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    L'isonomie représente l'égalité politique fondamentale de tous les citoyens 
                    athéniens devant la loi. Ce principe révolutionnaire signifiait que les mêmes 
                    lois s'appliquaient à tous, indépendamment de la richesse, de la naissance ou 
                    du statut social.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-primary">Implications Pratiques</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Même traitement judiciaire pour tous</li>
                      <li>• Lois votées par l'ensemble des citoyens</li>
                      <li>• Sanctions identiques selon les délits</li>
                      <li>• Abolition des privilèges aristocratiques</li>
                    </ul>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-foreground">Application Historique</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h4 className="font-medium mb-2">Réformes de Clisthène (508 av. J.-C.)</h4>
                      <p className="text-sm text-muted-foreground">
                        Instauration de l'égalité politique en réorganisant la société 
                        par dèmes plutôt que par familles aristocratiques.
                      </p>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h4 className="font-medium mb-2">Justice Populaire</h4>
                      <p className="text-sm text-muted-foreground">
                        L'Héliée garantissait que riches et pauvres soient jugés 
                        par les mêmes tribunaux populaires.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Iségorie */}
          <Card className="border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <MessageCircle className="h-8 w-8 text-accent" />
                Iségorie (Ἰσηγορία)
                <Badge className="bg-accent/20 text-accent">Égalité de Parole</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-foreground">Liberté d'Expression</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    L'iségorie garantissait à tout citoyen athénien le droit de prendre la parole 
                    dans l'Ecclésia, de proposer des lois et d'exprimer librement son opinion. 
                    Ce principe fondait la délibération démocratique sur l'échange d'arguments.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-accent">Droits Accordés</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Prise de parole libre à l'Ecclésia</li>
                      <li>• Proposition de lois et décrets</li>
                      <li>• Critique des magistrats</li>
                      <li>• Débat contradictoire autorisé</li>
                    </ul>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-foreground">Mécanismes de Protection</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-accent/5 rounded-lg">
                      <h4 className="font-medium mb-2">Temps de Parole Égal</h4>
                      <p className="text-sm text-muted-foreground">
                        La clepsydre garantissait un temps identique d'expression 
                        pour tous les citoyens, riches ou pauvres.
                      </p>
                    </div>
                    <div className="p-4 bg-accent/5 rounded-lg">
                      <h4 className="font-medium mb-2">Protection contre les Interruptions</h4>
                      <p className="text-sm text-muted-foreground">
                        Les présidents veillaient au respect de l'ordre et 
                        à la liberté de parole de chaque intervenant.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Isokratie */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Crown className="h-8 w-8 text-destructive" />
                Isokratie (Ἰσοκρατία)
                <Badge className="bg-destructive/20 text-destructive">Égalité de Pouvoir</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-foreground">Participation Politique</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    L'isokratie consacrait le droit égal de tous les citoyens à participer 
                    au pouvoir politique. Contrairement aux régimes aristocratiques, le pouvoir 
                    n'était plus réservé à une élite mais partagé entre tous les citoyens.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-destructive">Formes de Participation</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Vote à l'Ecclésia pour tous</li>
                      <li>• Éligibilité aux magistratures</li>
                      <li>• Participation aux tribunaux</li>
                      <li>• Accès au Conseil des 500</li>
                    </ul>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-foreground">Rotation et Tirage au Sort</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-destructive/5 rounded-lg">
                      <h4 className="font-medium mb-2">Système du Klèros</h4>
                      <p className="text-sm text-muted-foreground">
                        Le tirage au sort garantissait un accès équitable aux fonctions, 
                        évitant la concentration du pouvoir.
                      </p>
                    </div>
                    <div className="p-4 bg-destructive/5 rounded-lg">
                      <h4 className="font-medium mb-2">Limitation des Mandats</h4>
                      <p className="text-sm text-muted-foreground">
                        La rotation des charges empêchait l'émergence d'une 
                        classe politique permanente.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-primary/20 bg-gradient-to-r from-card/90 to-primary/5">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-primary">
            <Globe className="h-8 w-8 mx-auto mb-2" />
            Héritage Universel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <Scale className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-2">État de Droit Moderne</h4>
              <p className="text-sm text-muted-foreground">
                L'isonomie inspire nos constitutions modernes et 
                la Déclaration universelle des droits de l'homme.
              </p>
            </div>
            <div>
              <MessageCircle className="h-8 w-8 text-accent mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Liberté d'Expression</h4>
              <p className="text-sm text-muted-foreground">
                L'iségorie fonde nos principes de débat démocratique 
                et de liberté de la presse.
              </p>
            </div>
            <div>
              <Users className="h-8 w-8 text-destructive mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Suffrage Universel</h4>
              <p className="text-sm text-muted-foreground">
                L'isokratie a inspiré l'extension progressive du droit 
                de vote à tous les citoyens.
              </p>
            </div>
          </div>
          <div className="mt-8 p-6 bg-background/50 rounded-lg text-center">
            <p className="text-muted-foreground leading-relaxed">
              Bien que limitée aux citoyens masculins athéniens, cette trilogie démocratique 
              a posé les bases conceptuelles de nos démocraties modernes. L'évolution vers 
              l'universalité de ces principes continue de définir le progrès démocratique.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};