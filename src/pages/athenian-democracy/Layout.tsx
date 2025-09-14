import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AthenianSidebar } from "@/components/AthenianSidebar";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AthenianDemocracyLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-primary/5 to-accent/10">
        <AthenianSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-background/80 backdrop-blur-sm flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold text-foreground">
                Démocratie Athénienne Antique
              </h1>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l'accueil
            </Button>
          </header>
          
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};