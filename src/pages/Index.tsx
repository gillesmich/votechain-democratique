import { HeroSection } from "@/components/HeroSection";
import { AthenianDemocracy } from "@/components/AthenianDemocracy";
import { FrenchPoliticalTopics } from "@/components/FrenchPoliticalTopics";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      
      <div id="democracy-section">
        <AthenianDemocracy />
      </div>
      
      <div id="voting-section">
        <FrenchPoliticalTopics />
      </div>
    </div>
  );
};

export default Index;
