"use client"
 
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
} from "@/components/ui/sidebar"
import { ModeToggle } from "./ui/mode-toggle"
import { Logo } from "./designs/logo"
import { useMemo, useState } from "react"
import { dashboardIcon, exploreIcon, gitIcon, preferenceIcon, profileIcon } from "../../public/icons"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { HeartHandshakeIcon } from "lucide-react"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: dashboardIcon ,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: profileIcon
  },
  {
    title: "GitDate Profile",
    url: "/dashboard/gitdate-profile",
    icon: gitIcon
  },
  {
    title: "Match Preference",
    url: "/dashboard/match-preference",
    icon: preferenceIcon
  },
  {
  title:"Explore",
  url:"/dashboard/explore",
  icon:exploreIcon
  },
  {
    title:"Matches",
    url:"/dashboard/matches",
    icon:HeartHandshakeIcon
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
  const pathname = usePathname();
  const activeItem = useMemo(()=> items.find((item)=> item.url === pathname), [pathname])
  const router = useRouter()
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>

            <Logo />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="py-5">
              {items.map((item) => (
                <SidebarMenuItem onClick={()=> router.push(item.url)} key={item.title} className={`p-2 ${activeItem?.title === item.title ? " " : ""}`}>
                  <SidebarMenuButton className="">
                    <div className="flex items-center gap-2">
                      <item.icon className={`${activeItem?.title === item.title ? "bg-gitdate text-[#fff] rounded-full p-1 text-3xl " : "dark:text-gray-300 text-gray-800 rounded-full p-1 text-3xl"}`} />
                      <span className="font-bold text-[16px]">{item.title}</span>
                    </div>
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
