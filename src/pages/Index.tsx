import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { HeroSection } from "@/components/HeroSection";
import { AthenianDemocracy } from "@/components/AthenianDemocracy";
import { FrenchPoliticalTopics } from "@/components/FrenchPoliticalTopics";
import { UserProfile } from "@/components/UserProfile";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {!user && (
        <div className="fixed top-4 right-4 z-50">
          <Button onClick={() => navigate('/auth')} className="shadow-lg">
            <LogIn className="h-4 w-4 mr-2" />
            Se connecter
          </Button>
        </div>
      )}
      
      <HeroSection />
      
      <div id="democracy-section">
        <AthenianDemocracy />
      </div>
      
      <div id="voting-section">
        <FrenchPoliticalTopics />
      </div>

      {user && (
        <section className="py-16 bg-gradient-to-br from-background via-secondary/20 to-accent/10">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Mon Profil Citoyen</h2>
            <UserProfile />
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
