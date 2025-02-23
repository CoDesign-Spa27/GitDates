import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Menu } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      {/* Sidebar */}
      <AppSidebar />

      {/* Sidebar Trigger - Floating modern button */}
        <div className="fixed top-5 right-5 z-50 flex items-center justify-center p-2 rounded-full shadow-md   transition-all cursor-pointer">
      <SidebarTrigger />
  
        </div>

      {/* Main Content */}
      <main className="w-full">
        <div className="p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
