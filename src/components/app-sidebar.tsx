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
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { ModeToggle } from "./ui/mode-toggle";
import { Logo } from "./designs/logo";
import { useMemo, useState, useEffect } from "react";
import {
  dashboardIcon,
  exploreIcon,
  gitIcon,
  preferenceIcon,
  profileIcon,
} from "../../public/icons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  HeartHandshake, 
  Settings, 
  LogOut,
  Bell,
  MessageCircle 
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ProfileSet } from "./profileSet";
import { getUnreadMessageCounts } from "@/actions/conversation.action";

// Navigation items grouped by category
const navigationItems = {
  main: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: dashboardIcon,
      tooltip: "View your dashboard",
    },
    {
      title: "Explore",
      url: "/dashboard/explore", 
      icon: exploreIcon,
      tooltip: "Find new matches",
    },
     {
      title: "Conversations",
      url: "/dashboard/conversations",
      icon: MessageCircle,
      tooltip: "Conversations",
    },
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: Bell,
      tooltip: "View notifications",
      badge: 3, // Optional badge count
    }
  ],
  profile: [
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: profileIcon,
      tooltip: "Edit your profile",
    },
    {
      title: "GitDate Profile",
      url: "/dashboard/gitdate-profile",
      icon: gitIcon,
      tooltip: "Manage GitDate profile",
    },
    {
      title: "Match Preference",
      url: "/dashboard/match-preference",
      icon: preferenceIcon,
      tooltip: "Set match preferences",
    },
    {
      title: "Matches",
      url: "/dashboard/matches",
      icon: HeartHandshake,
      tooltip: "View your matches",
    }
  ],
  settings: [
    // {
    //   title: "Settings",
    //   url: "/dashboard/settings",
    //   icon: Settings,
    //   tooltip: "App settings",
    // }
  ]
};

export function AppSidebar() {
  const pathname = usePathname();
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const isActive = (url: string) => {
    if (url === "/dashboard" && pathname === "/dashboard") {
      return true;
    }
    if(url !== "/dashboard" && pathname.startsWith(url)) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    // Fetch unread message counts
    const fetchUnreadCounts = async () => {
      try {
        const counts = await getUnreadMessageCounts();
        setUnreadMessageCount(counts?.total || 0);
      } catch (error) {
        console.error("Error fetching unread counts:", error);
      }
    };
    
    fetchUnreadCounts();
    
    // Set up polling every 30 seconds
    const interval = setInterval(fetchUnreadCounts, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      toast({
        title: "Failed to sign out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const NavigationSection = ({ items, title }: { items: typeof navigationItems.main, title?: string }) => (
    <>
      {title && (
        <div className="px-4 py-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {title}
          </h3>
        </div>
      )}
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <Link href={item.url} prefetch={true} className="w-full">
            <SidebarMenuButton 
              tooltip={item.tooltip}
              className={cn(
                "transition-all duration-200 ease-in-out",
                isActive(item.url) 
                  ? "bg-gitdate bg-opacity-10 text-gitdate" 
                  : "hover:bg-gray-100 dark:hover:bg-neutral-800"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon
                className={`${
                  isActive(item.url)
                  ? "bg-gitdate text-[#fff] rounded-full p-1 text-3xl "
                  : "dark:text-gray-300 text-gray-800 rounded-full p-1 text-3xl"
                }`}
                />
                <span className="font-medium">
                  {item.title}
                </span>
                {/* Show unread message count for Messages item */}
                {item.title === "Messages" && unreadMessageCount > 0 && (
                  <span className="ml-auto bg-gitdate text-white px-2 py-0.5 rounded-full text-xs">
                    {unreadMessageCount}
                  </span>
                )}
                {/* Other badges */}
                {item.badge && item.title !== "Messages" && (
                  <span className="ml-auto bg-gitdate text-white px-2 py-0.5 rounded-full text-xs">
                    {item.badge}
                  </span>
                )}
              </div>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </>
  );

  return (
    <Sidebar className="overflow-x-hidden">
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 mb-6">
            <Logo />
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              <div className="py-2">
                <ProfileSet />
              </div>
              <div className="px-1 py-3">

              <NavigationSection items={navigationItems.main} />
              
              <SidebarSeparator className="my-4" />
              
              <NavigationSection 
                items={navigationItems.profile} 
                title="Profile" 
                />
              
              <SidebarSeparator className="my-4" />
              
              <NavigationSection 
                items={navigationItems.settings} 
                title="Settings" 
                />
                </div>
            </SidebarMenu>

            <div className="px-4 mt-auto pt-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
