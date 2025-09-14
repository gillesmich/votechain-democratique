import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Columns3, FileText, Users, Calendar, Crown, Building } from "lucide-react";

export const Boule = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
          <Columns3 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-foreground">La Boulè</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Le Conseil des Cinq-Cents, organe préparatoire essentiel de la démocratie athénienne, 
          chargé de préparer les délibérations de l'Ecclésia.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Rôle et Responsabilités
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3 text-foreground">Fonction Préparatoire</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                La Boulè avait pour mission principale de préparer l'ordre du jour de l'Ecclésia. 
                Aucune proposition ne pouvait être soumise au vote de l'assemblée sans avoir été 
                préalablement examinée par le Conseil. Cette fonction de "probouleusis" garantissait 
                la qualité et la cohérence des débats démocratiques.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h4 className="font-medium mb-2">Préparation Législative</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Examen préalable des propositions</li>
                    <li>• Rédaction de projets de décrets</li>
                    <li>• Fixation de l'ordre du jour</li>
                    <li>• Convocation de l'Ecclésia</li>
                  </ul>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h4 className="font-medium mb-2">Administration Courante</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Gestion des finances publiques</li>
                    <li>• Supervision des magistrats</li>
                    <li>• Relations diplomatiques</li>
                    <li>• Défense de la cité</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-foreground">Organisation par Prytanies</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                L'année était divisée en 10 prytanies de 35-36 jours chacune. Chaque tribu 
                exerçait à tour de rôle la prytanie, assurant la présidence du Conseil et 
                de l'Ecclésia. Ce système de rotation garantissait l'égalité entre les tribus.
              </p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium mb-2">Les Prytanes</h4>
                  <p className="text-sm text-muted-foreground">
                    Les 50 bouleutes de la tribu en prytanie siégeaient en permanence au 
                    Tholos et assuraient la continuité de l'administration.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium mb-2">L'Épistate</h4>
                  <p className="text-sm text-muted-foreground">
                    Chaque jour, un prytane était tiré au sort comme épistate, 
                    présidant le Conseil et gardant les clés du trésor.
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-medium mb-2">Rotation Quotidienne</h4>
                  <p className="text-sm text-muted-foreground">
                    Le système empêchait toute concentration du pouvoir en 
                    limitant la présidence à 24 heures.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-foreground">Pouvoirs et Prérogatives</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-primary">Pouvoirs Législatifs</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Initiative législative</li>
                    <li>• Probouleusis (examen préalable)</li>
                    <li>• Amendements aux projets</li>
                    <li>• Coordination inter-magistrats</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-primary">Pouvoirs Exécutifs</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Supervision budgétaire</li>
                    <li>• Contrôle des magistrats</li>
                    <li>• Réception des ambassades</li>
                    <li>• Mesures d'urgence</li>
                  </ul>
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
                <div className="text-3xl font-bold text-primary mb-2">500</div>
                <p className="text-sm text-muted-foreground">
                  Bouleutes tirés au sort (50 par tribu)
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Âge minimum</span>
                  <Badge>30 ans</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Mandat</span>
                  <Badge>1 an</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Renouvellement</span>
                  <Badge>Max 2 fois</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Par tribu</span>
                  <Badge>50 membres</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-primary" />
                Calendrier des Séances
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Séances annuelles</span>
                  <Badge variant="outline">~300</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Séances mensuelles</span>
                  <Badge variant="outline">25-30</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Prytanies par an</span>
                  <Badge variant="outline">10</Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Le Conseil siégeait presque quotidiennement, sauf lors des fêtes religieuses.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building className="h-5 w-5 text-primary" />
                Lieux de Réunion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Bouleutérion</h4>
                  <p className="text-xs text-muted-foreground">
                    Édifice carré pouvant accueillir les 500 membres, 
                    situé sur l'agora d'Athènes.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Tholos</h4>
                  <p className="text-xs text-muted-foreground">
                    Bâtiment circulaire où les prytanes prenaient 
                    leurs repas et passaient la nuit.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Crown className="h-5 w-5 text-primary" />
                Serment du Bouleute
              </CardTitle>
            </CardHeader>
            <CardContent>
              <blockquote className="text-sm text-muted-foreground italic border-l-2 border-primary pl-3">
                "Je conseillerai au mieux pour la cité d'Athènes et le peuple athénien... 
                Je ne recevrai ni présents ni gratifications..."
              </blockquote>
              <p className="text-xs text-muted-foreground mt-2">
                Chaque bouleute prêtait serment en début de mandat.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-primary/20 bg-gradient-to-r from-card/90 to-primary/5">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-primary">
            Organe Central de la Démocratie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <FileText className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Préparation Législative</h4>
              <p className="text-sm text-muted-foreground">
                Examen méticuleux de toutes les propositions avant 
                leur soumission à l'Ecclésia.
              </p>
            </div>
            <div>
              <Users className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Représentation Équitable</h4>
              <p className="text-sm text-muted-foreground">
                Chaque tribu contribuait également à la composition 
                du Conseil par tirage au sort.
              </p>
            </div>
            <div>
              <Columns3 className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-2">Continuité Administrative</h4>
              <p className="text-sm text-muted-foreground">
                Assurance de la permanence du gouvernement et 
                de la gestion des affaires courantes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};