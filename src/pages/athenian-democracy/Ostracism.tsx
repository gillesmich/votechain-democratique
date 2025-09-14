import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scroll, Shield, AlertTriangle, Users, Calendar, Target } from "lucide-react";

export const Ostracism = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-full mb-4">
          <Scroll className="h-8 w-8 text-accent" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-foreground">L'Ostracisme</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Une procédure démocratique unique permettant d'exiler temporairement les personnalités 
          jugées dangereuses pour la démocratie athénienne.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              Mécanisme de Protection Démocratique
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3 text-foreground">Principe et Objectif</h3>
              <p className="text-muted-foreground leading-relaxed">
                L'ostracisme était conçu comme un mécanisme préventif pour protéger la démocratie 
                des ambitions tyranniques. Contrairement à un procès criminel, il ne s'agissait pas 
                de punir un crime, mais d'écarter temporairement une personnalité dont l'influence 
                excessive pourrait menacer l'équilibre démocratique.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-foreground">Processus de Vote</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-medium mb-2">1. Consultation Préliminaire</h4>
                  <p className="text-sm text-muted-foreground">
                    Chaque année, l'Ecclésia décidait s'il fallait organiser un vote d'ostracisme.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-medium mb-2">2. Le Vote Principal</h4>
                  <p className="text-sm text-muted-foreground">
                    Si la décision était positive, un vote avait lieu deux mois plus tard sur l'agora.
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-medium mb-2">3. Les Ostraka</h4>
                  <p className="text-sm text-muted-foreground">
                    Les citoyens gravaient le nom de leur choix sur des tessons de poterie (ostraka).
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-medium mb-2">4. Décompte et Résultat</h4>
                  <p className="text-sm text-muted-foreground">
                    La personne recevant le plus de votes était exilée si le quorum était atteint.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-foreground">Personnalités Ostracisées</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2">Aristide "le Juste"</h4>
                  <p className="text-xs text-muted-foreground">
                    Ostracisé en 482 av. J.-C., rappelé pour la bataille de Salamine
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2">Thémistocle</h4>
                  <p className="text-xs text-muted-foreground">
                    Héros de Salamine, ostracisé vers 470 av. J.-C.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2">Cimon</h4>
                  <p className="text-xs text-muted-foreground">
                    General et homme politique, ostracisé en 461 av. J.-C.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2">Thucydide d'Alopèce</h4>
                  <p className="text-xs text-muted-foreground">
                    Adversaire de Périclès, ostracisé en 443 av. J.-C.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-accent" />
                Conditions Requises
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">6000</div>
                <p className="text-sm text-muted-foreground mb-4">
                  Nombre minimum de votes requis pour valider un ostracisme
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Durée d'exil</span>
                  <Badge variant="outline">10 ans</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Fréquence maximale</span>
                  <Badge variant="outline">1 par an</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Rappel possible</span>
                  <Badge variant="outline">Oui</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-accent" />
                Période d'Application
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Début</span>
                  <Badge>508 av. J.-C.</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Premier cas</span>
                  <Badge>487 av. J.-C.</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Dernier cas</span>
                  <Badge>417 av. J.-C.</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  L'institution a été progressivement abandonnée au début du IVe siècle.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Conséquences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-destructive rounded-full mt-2"></span>
                  Exil de 10 ans d'Athènes et de l'Attique
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-destructive rounded-full mt-2"></span>
                  Conservation des biens et de la citoyenneté
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-destructive rounded-full mt-2"></span>
                  Possible rappel anticipé en cas de crise
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-destructive rounded-full mt-2"></span>
                  Aucune infamie ou déshonneur attaché
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-accent/20 bg-gradient-to-r from-card/90 to-accent/5">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-accent">
            Innovation Démocratique Unique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <Shield className="h-8 w-8 text-accent mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Protection Préventive</h4>
              <p className="text-sm text-muted-foreground">
                Premier mécanisme de l'histoire permettant d'écarter pacifiquement 
                une menace politique potentielle.
              </p>
            </div>
            <div>
              <Users className="h-8 w-8 text-accent mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Décision Collective</h4>
              <p className="text-sm text-muted-foreground">
                Le peuple athénien décidait collectivement du sort de ses dirigeants 
                sans violence ni procès.
              </p>
            </div>
            <div>
              <Scroll className="h-8 w-8 text-accent mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Héritage Historique</h4>
              <p className="text-sm text-muted-foreground">
                Inspiration pour les mécanismes modernes de révocation 
                et de contrôle démocratique.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};