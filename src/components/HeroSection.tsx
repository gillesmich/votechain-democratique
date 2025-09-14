import { Button } from "@/components/ui/button";
import { ArrowDown, Vote, Shield, Users } from "lucide-react";

export const HeroSection = () => {
  const scrollToContent = () => {
    const element = document.getElementById('democracy-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/athenian-democracy';
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 flex items-center justify-center relative overflow-hidden">
      {/* Decorative elements inspired by Greek columns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-2 h-40 bg-primary"></div>
        <div className="absolute top-20 left-20 w-2 h-32 bg-accent"></div>
        <div className="absolute top-20 right-10 w-2 h-40 bg-primary"></div>
        <div className="absolute top-20 right-20 w-2 h-32 bg-accent"></div>
        <div className="absolute bottom-20 left-1/4 w-2 h-24 bg-primary"></div>
        <div className="absolute bottom-20 right-1/4 w-2 h-24 bg-accent"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Sécurisé par Blockchain</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
              Démocratie Directe
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              De l'Agora athénienne à la France moderne :<br />
              <span className="text-foreground font-medium">
                Participez au débat national grâce à la technologie blockchain
              </span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="flex flex-col items-center p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border/30">
              <Users className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold text-foreground">Participation Citoyenne</h3>
              <p className="text-sm text-muted-foreground text-center">
                Chaque voix compte dans les décisions nationales
              </p>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border/30">
              <Vote className="h-8 w-8 text-accent mb-2" />
              <h3 className="font-semibold text-foreground">Vote Transparent</h3>
              <p className="text-sm text-muted-foreground text-center">
                Blockchain garantit l'intégrité du processus
              </p>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border/30">
              <Shield className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold text-foreground">Sécurité Maximale</h3>
              <p className="text-sm text-muted-foreground text-center">
                Cryptographie avancée pour protéger votre vote
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
              onClick={scrollToContent}
            >
              Découvrir la Démocratie Athénienne
              <ArrowDown className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground px-8 py-3 text-lg"
              onClick={() => document.getElementById('voting-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Participer aux Votes
            </Button>
          </div>
        </div>
      </div>

      {/* Animated scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-6 w-6 text-muted-foreground" />
      </div>
    </section>
  );
};