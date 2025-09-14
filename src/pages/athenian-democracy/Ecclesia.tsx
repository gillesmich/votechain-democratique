import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Calendar, Vote, Clock, UserCheck } from "lucide-react";

export const Ecclesia = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
          <Users className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-foreground">L'Ecclésia</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          L'assemblée populaire athénienne, cœur de la démocratie directe où chaque citoyen 
          pouvait participer aux décisions politiques majeures de la cité.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Vote className="h-5 w-5 text-primary" />
              Fonctionnement de l'Ecclésia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3 text-foreground">Participation Citoyenne</h3>
              <p className="text-muted-foreground leading-relaxed">
                Tous les citoyens athéniens masculins âgés de plus de 18 ans pouvaient participer à l'Ecclésia. 
                En moyenne, 6000 citoyens assistaient aux séances, représentant environ 15% de la population 
                citoyenne. Cette participation massive faisait de l'Ecclésia la plus grande assemblée 
                démocratique de l'Antiquité.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-foreground">Processus de Décision</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Les décisions étaient prises selon un processus structuré :
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Présentation des propositions par les magistrats ou la Boulè</li>
                <li>Débats ouverts où tout citoyen pouvait prendre la parole</li>
                <li>Vote à main levée (χειροτονία - cheirotonia)</li>
                <li>Annonce immédiate des résultats par les présidents</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-foreground">Sujets Traités</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Badge variant="outline">Politique Extérieure</Badge>
                  <p className="text-xs text-muted-foreground">Décisions de guerre et de paix, alliances</p>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline">Legislation</Badge>
                  <p className="text-xs text-muted-foreground">Adoption et modification des lois</p>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline">Finances Publiques</Badge>
                  <p className="text-xs text-muted-foreground">Budget de la cité, impôts, dépenses</p>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline">Magistrats</Badge>
                  <p className="text-xs text-muted-foreground">Élection et contrôle des responsables</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-accent" />
                Lieu de Réunion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                L'Ecclésia se réunissait sur la colline de la Pnyx, un amphithéâtre naturel 
                pouvant accueillir jusqu'à 8000 personnes. Ce lieu symbolique offrait une 
                acoustique exceptionnelle et une vue sur l'Acropole.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-accent" />
                Fréquence des Séances
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Séances ordinaires</span>
                  <Badge>40 par an</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Séances principales</span>
                  <Badge>10 par an</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Durée moyenne</span>
                  <Badge>6-8 heures</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserCheck className="h-5 w-5 text-accent" />
                Quorum Requis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">6000</div>
                <p className="text-sm text-muted-foreground">
                  Nombre minimum de citoyens requis pour les décisions importantes 
                  comme l'ostracisme ou les questions de citoyenneté.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-primary/20 bg-gradient-to-r from-card/90 to-primary/5">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-primary">
            L'Égalité dans la Parole
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Temps de Parole</h4>
              <p className="text-sm text-muted-foreground">
                Chaque citoyen disposait d'un temps égal pour s'exprimer, 
                mesuré par une clepsydre (horloge à eau).
              </p>
            </div>
            <div>
              <Vote className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Droit de Vote</h4>
              <p className="text-sm text-muted-foreground">
                Tous les citoyens présents avaient le même poids lors des votes, 
                indépendamment de leur richesse ou statut social.
              </p>
            </div>
            <div>
              <Users className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Liberté d'Expression</h4>
              <p className="text-sm text-muted-foreground">
                L'iségorie garantissait à tout citoyen le droit de prendre la parole 
                et de proposer des amendements aux lois.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};