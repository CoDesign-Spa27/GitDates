"use client";

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
} from "@/components/ui/sidebar";
import { ModeToggle } from "./ui/mode-toggle";
import { Logo } from "./designs/logo";
import { useMemo, useState } from "react";
import {
  dashboardIcon,
  exploreIcon,
  gitIcon,
  preferenceIcon,
  profileIcon,
} from "../../public/icons";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { HeartHandshakeIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { Button } from "./ui/button";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: dashboardIcon,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: profileIcon,
  },
  {
    title: "GitDate Profile",
    url: "/dashboard/gitdate-profile",
    icon: gitIcon,
  },
  {
    title: "Match Preference",
    url: "/dashboard/match-preference",
    icon: preferenceIcon,
  },
  {
    title: "Explore",
    url: "/dashboard/explore",
    icon: exploreIcon,
  },
  {
    title: "Matches",
    url: "/dashboard/matches",
    icon: HeartHandshakeIcon,
  },

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
];

export function AppSidebar() {
  const pathname = usePathname();
  
  const router = useRouter();

  const isActive = (url: string) => {
    if (url === "/dashboard" && pathname === "/dashboard") {
      return true;
    }
    if(url !== "/dashboard" && pathname.startsWith(url)) {
      return true;
    }
    return false;
  };

  const handleSignOut = async () => {
    try {
      const res = await signOut({
        callbackUrl: "/",
      });
      console.log(res, "signout");
    } catch (error) {
      toast({
        title: "Internal Server Error",
        variant: "destructive",
      });
      console.error("Error signing out:", error);
    }
  };
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
                <SidebarMenuItem
                  key={item.title}
                  className="py-1"
                >
                  <Link href={item.url} prefetch={true} className="w-full" >
                  <SidebarMenuButton className={isActive(item.url) ? "bg-opacity-10 bg-gitdate rounded-md" : ""}>
                    <div className="flex items-center gap-2">
                      <item.icon
                        className={`${
                          isActive(item.url)
                          ? "bg-gitdate text-[#fff] rounded-full p-1 text-3xl "
                          : "dark:text-gray-300 text-gray-800 rounded-full p-1 text-3xl"
                        }`}
                        />
                      <span className="font-bold text-[16px]">
                        {item.title}
                      </span>
                    </div>
                  </SidebarMenuButton>
                        </Link>
                </SidebarMenuItem>
              ))}
              <ModeToggle />
              <Button
                variant="pressed"
                className="w-full mt-5"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
