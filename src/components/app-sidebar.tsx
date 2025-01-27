import { Calendar, GithubIcon, Home, Inbox, Search, SearchCode, Settings, UserCog2Icon, UserRoundSearchIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ModeToggle } from "./ui/mode-toggle"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: UserCog2Icon
  },
  {
    title: "GitDate Profile",
    url: "/dashboard/gitdate-profile",
    icon: GithubIcon
  },
  {
    title: "Match Preference",
    url: "/dashboard/match-preference",
    icon: UserCog2Icon
  },
  {
  title:"Explore",
  url:"/dashboard/explore",
  icon:UserRoundSearchIcon
  }
  // {
  //   title: "Calendar",
  //   url: "#",
  //   icon: Calendar,
  // },
  // {
  //   title: "Search",
  //   url: "#",
  //   icon: Search,
  // },
  // {
  //   title: "Settings",
  //   url: "#",
  //   icon: Settings,
  // },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl leading-relaxed font-black bg-gradient-to-r from-gitdate to-pink-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity duration-300">Git Dates</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <ModeToggle />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
