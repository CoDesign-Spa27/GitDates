import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Menu } from 'lucide-react'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { ShareGitDate } from '@/components/share-gitdate'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 p-4 md:p-6 md:pt-6">
        <div className="flex items-center gap-5 pl-4 justify-between">
          <div className="flex items-center gap-5">
            <SidebarTrigger />
            <ModeToggle />
          </div>
          <ShareGitDate />
        </div>
        {children}
      </main>
    </SidebarProvider>
  )
}
