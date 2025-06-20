import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Menu } from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
          <AppSidebar />
            <main className="flex-1 p-4 md:p-6 md:pt-6">
              <div className="flex gap-5 items-center pl-4">
            <SidebarTrigger />
            <ModeToggle />
              </div>
              {children}
            </main>
 
    </SidebarProvider>
  );
}