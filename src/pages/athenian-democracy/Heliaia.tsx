import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, Gavel, Users, ShieldCheck, Clock, DollarSign } from "lucide-react";

export const Heliaia = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
          <Scale className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-foreground">L'Héliée</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Le tribunal populaire athénien, incarnation de la justice démocratique où les citoyens 
          ordinaires rendaient la justice au nom du peuple.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5 text-primary" />
              Organisation et Fonctionnement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3 text-foreground">Sélection des Jurés</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Chaque année, 6000 citoyens athéniens âgés de plus de 30 ans étaient sélectionnés 
                par tirage au sort pour former l'Héliée. Ce système garantissait la représentativité 
                sociale et évitait la corruption des juges.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h4 className="font-medium mb-2">Critères d'Éligibilité</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Citoyen athénien de plus de 30 ans</li>
                    <li>• Jouissance de ses droits civiques</li>
                    <li>• Aucune condamnation infamante</li>
                    <li>• Prestation du serment héliaste</li>
                  </ul>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h4 className="font-medium mb-2">Répartition</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 10 tribus x 600 jurés</li>
                    <li>• Attribution par lettre grecque</li>
                    <li>• Rotation quotidienne</li>
                    <li>• Panels de 201 à 2501 jurés</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-foreground">Types de Procès</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium mb-2">Procès Privés (Δίκαι - Dikai)</h4>
                  <p className="text-sm text-muted-foreground">
                    Conflits entre particuliers : contrats, propriété, famille. 
                    Panels de 201 ou 401 jurés selon l'importance de l'affaire.
                  </p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-medium mb-2">Procès Publics (Γραφαί - Graphai)</h4>
                  <p className="text-sm text-muted-foreground">
                    Crimes contre l'État : trahison, corruption, impiété. 
                    Panels de 501 à 2501 jurés selon la gravité.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium mb-2">Procès Politiques</h4>
                  <p className="text-sm text-muted-foreground">
                    Eisangélie (haute trahison), dokimasie (vérification des magistrats), 
                    euthyna (reddition de comptes).
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-foreground">Déroulement d'un Procès</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-medium">1</div>
                  <div>
                    <h4 className="font-medium">Tirage au Sort et Installation</h4>
                    <p className="text-sm text-muted-foreground">
                      Sélection aléatoire des jurés le matin même pour éviter la corruption.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-medium">2</div>
                  <div>
                    <h4 className="font-medium">Plaidoiries</h4>
                    <p className="text-sm text-muted-foreground">
                      Accusation et défense disposent d'un temps égal, mesuré par clepsydre.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-medium">3</div>
                  <div>
                    <h4 className="font-medium">Vote Secret</h4>
                    <p className="text-sm text-muted-foreground">
                      Chaque juré reçoit deux jetons : un plein (condamnation), un troué (acquittement).
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-medium">4</div>
                  <div>
                    <h4 className="font-medium">Verdict et Peine</h4>
                    <p className="text-sm text-muted-foreground">
                      Décompte public, puis vote sur la peine si condamnation (timèsis).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" />
                Composition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-primary mb-2">6000</div>
                <p className="text-sm text-muted-foreground">
                  Jurés sélectionnés annuellement par tirage au sort
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Âge minimum</span>
                  <Badge>30 ans</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Durée du mandat</span>
                  <Badge>1 an</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Renouvellement</span>
                  <Badge>Possible</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                Horaires et Durée
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Début des séances</span>
                  <Badge variant="outline">Lever du soleil</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Durée moyenne</span>
                  <Badge variant="outline">6-8 heures</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Jours d'activité</span>
                  <Badge variant="outline">200 par an</Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Les tribunaux siégeaient pratiquement tous les jours sauf lors des fêtes religieuses.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5 text-primary" />
                Rémunération
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-primary mb-2">3 oboles</div>
                <p className="text-sm text-muted-foreground">
                  Salaire journalier d'un juré (misthos dikastikos)
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Cette rémunération, introduite par Périclès vers 450 av. J.-C., 
                permettait aux citoyens les plus modestes de participer à la justice.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-primary/20 bg-gradient-to-r from-card/90 to-primary/5">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-primary">
            Justice Populaire et Démocratique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <ShieldCheck className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Égalité devant la Loi</h4>
              <p className="text-sm text-muted-foreground">
                Riches et pauvres, nobles et roturiers étaient jugés 
                par le même tribunal populaire.
              </p>
            </div>
            <div>
              <Users className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Participation Citoyenne</h4>
              <p className="text-sm text-muted-foreground">
                Chaque citoyen pouvait devenir juge et participer 
                à l'administration de la justice.
              </p>
            </div>
            <div>
              <Scale className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Transparence</h4>
              <p className="text-sm text-muted-foreground">
                Procès publics, débats contradictoires et votes 
                à la majorité garantissaient la transparence.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};