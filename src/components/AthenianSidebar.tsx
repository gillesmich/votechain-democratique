import { Users, Scale, Scroll, Columns3, Star, BookOpen } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const athenianTopics = [
  { title: "Vue d'ensemble", url: "/athenian-democracy", icon: BookOpen },
  { title: "L'Ecclésia", url: "/athenian-democracy/ecclesia", icon: Users },
  { title: "L'Ostracisme", url: "/athenian-democracy/ostracism", icon: Scroll },
  { title: "L'Héliée", url: "/athenian-democracy/heliaia", icon: Scale },
  { title: "La Boulè", url: "/athenian-democracy/boule", icon: Columns3 },
  { title: "Principes Fondamentaux", url: "/athenian-democracy/principles", icon: Star },
];

export function AthenianSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isExpanded = athenianTopics.some((topic) => isActive(topic.url));
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/20 text-primary font-medium border-l-2 border-primary" : "hover:bg-muted/50";

  return (
    <Sidebar className="w-64">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-semibold">
            Démocratie Athénienne
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {athenianTopics.map((topic) => (
                <SidebarMenuItem key={topic.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={topic.url} end className={getNavCls}>
                      <topic.icon className="mr-2 h-4 w-4" />
                      <span>{topic.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}