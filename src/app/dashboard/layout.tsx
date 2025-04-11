import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Menu } from "lucide-react";
import { Suspense } from "react";
import Loading from "./loading";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <div className="fixed top-5 right-5 z-50 flex items-center justify-center p-2 rounded-full shadow-md   transition-all cursor-pointer">
        <SidebarTrigger />
      </div>

      <Suspense fallback={<Loading />}>
        <main className="w-full">
          <div className="p-4">{children}</div>
        </main>
      </Suspense>
    </SidebarProvider>
  );
}
