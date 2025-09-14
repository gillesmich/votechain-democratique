import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AuthPage } from "@/components/AuthPage";
import { AthenianDemocracyLayout } from "@/pages/athenian-democracy/Layout";
import { AthenianDemocracyIndex } from "@/pages/athenian-democracy/Index";
import { Ecclesia } from "@/pages/athenian-democracy/Ecclesia";
import { Ostracism } from "@/pages/athenian-democracy/Ostracism";
import { Heliaia } from "@/pages/athenian-democracy/Heliaia";
import { Boule } from "@/pages/athenian-democracy/Boule";
import { Principles } from "@/pages/athenian-democracy/Principles";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/athenian-democracy" element={<AthenianDemocracyLayout />}>
              <Route index element={<AthenianDemocracyIndex />} />
              <Route path="ecclesia" element={<Ecclesia />} />
              <Route path="ostracism" element={<Ostracism />} />
              <Route path="heliaia" element={<Heliaia />} />
              <Route path="boule" element={<Boule />} />
              <Route path="principles" element={<Principles />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
