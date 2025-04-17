import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Menu } from "lucide-react";
import { Suspense } from "react";
import Loading from "./loading";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <div className="hidden md:block h-full overflow-hidden">
          <AppSidebar />
        </div>

        <div className="flex-1 flex flex-col h-full overflow-auto relative">
          <div className="md:hidden fixed top-4 right-4 z-50">
            <SidebarTrigger />
          </div>

          {/* Content with proper spacing */}
          <Suspense fallback={<Loading />}>
            <main className="flex-1 p-4 md:p-6 pt-16 md:pt-6">
              {children}
            </main>
          </Suspense>
        </div>
      </div>
    </SidebarProvider>
  );
}