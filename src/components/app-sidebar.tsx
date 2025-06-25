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
  SidebarMenuBadge,
  useSidebar,
  SidebarFooter,
  SidebarHeader,
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
import { usePathname, useRouter } from "next/navigation";
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
import { useSocket } from "@/lib/client-socket";
import { useConversations } from "./hooks/useConversation";
import { useQueryClient } from "@tanstack/react-query";
import { gitDarkLogo, gitLightLogo } from "../../public/assets";
import Image from "next/image";
import { useTheme } from "next-themes";
import { motion } from "motion/react";
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
 
  ],
  profile: [
    {
      title: "GitDates Profile",
      url: "/dashboard/gitdate-profile",
      icon: gitIcon,
      tooltip: "Manage GitDates profile",
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
  const {
    state: isCollapsed,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const {unreadCounts} = useConversations();
  const {subscribeToNewMessages} = useSocket();
  const queryClient = useQueryClient();
  const {theme} = useTheme();
  useEffect(() => {
    const unsubscribe = subscribeToNewMessages((message) => {
      queryClient.invalidateQueries({ queryKey: ['unread-counts'], });
    });

    return () => {
      unsubscribe?.();
    };
  }, [subscribeToNewMessages, queryClient]);

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
        <SidebarGroupLabel className="py-2">
          {title}
        </SidebarGroupLabel>
      )}
      {items.map((item) => (
        <SidebarMenuItem key={item.title} className="py-1">
          <Link 
            href={item.url} 
            prefetch={false}
          >
            <SidebarMenuButton 
              tooltip={item.tooltip}
              isActive={isActive(item.url)}
              className='[&>svg]:size-8'
            >
              <item.icon className={cn(
                "h-4 w-4 shrink-0 p-1 ",
                isActive(item.url) && "bg-gitdate text-white rounded-full "
              )} />
              <span className="truncate">{item.title}</span>
              {item.title === "Conversations" && unreadCounts && unreadCounts.total > 0 && (
                <SidebarMenuBadge className="bg-gitdate text-white">
                  {unreadCounts.total}
                </SidebarMenuBadge>
              )}
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </>
  );

  return (
    <Sidebar className="overflow-hidden" collapsible="icon">
      <SidebarHeader className="flex items-center justify-center pt-4 md:pt-6">
        <motion.div
          initial={false}
          animate={{ 
            scale: isCollapsed !== 'expanded' ? 1 : 0,
            opacity: isCollapsed !== 'expanded' ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
          className={isCollapsed !== 'expanded' ? 'block' : 'hidden'}
        >
          <Image
            src={theme === 'dark' ? gitDarkLogo : gitLightLogo}
            className="h-8 w-8"
            alt="GitDate"
            width={50}
            height={50}
          />
        </motion.div>

        <motion.div
          initial={false} 
          animate={{
            scale: isCollapsed === 'expanded' ? 1 : 0,
            opacity: isCollapsed === 'expanded' ? 1 : 0
          }}
          transition={{ duration: 0.2 }}
          className={isCollapsed === 'expanded' ? 'block' : 'hidden'}
        >
          <Logo />
        </motion.div>
      </SidebarHeader>
      <SidebarContent className="w-full">
        <SidebarGroup className="w-full">
          <SidebarGroupContent className="w-full">
            <SidebarMenu className="w-full">
              <div className="w-full py-3">
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

            <div className="mt-auto w-full">
              <SidebarMenuButton
                onClick={handleSignOut}
                className="w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50">
                <LogOut className="h-8 w-8 shrink-0" />
                {isCollapsed === 'expanded' && (
                  <span className="truncate">Sign out</span>
                )}
              </SidebarMenuButton>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ProfileSet isCollapsed={isCollapsed} />
      </SidebarFooter>
    </Sidebar>
  )
}
