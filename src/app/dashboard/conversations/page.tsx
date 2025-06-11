"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Search, Plus, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { useSocket } from "@/lib/client-socket";
import { useConversations } from "@/components/hooks/useConversation";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Conversations } from "@/components/conversations";

export default function ConversationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { subscribeToNewMessages } = useSocket();
  const { conversations, unreadCounts, isLoading } = useConversations();
  const queryClient = useQueryClient();
  const {data: session} = useSession();
  const email = session?.user?.email;

  useEffect(() => {
    const unsubscribe = subscribeToNewMessages((message) => {
      queryClient.invalidateQueries({ queryKey: ['unread-counts', email] });
    });

    return () => {
      unsubscribe?.();
    };
  }, [subscribeToNewMessages, queryClient,unreadCounts]);
 
  const filteredConversations = conversations?.filter(
    (conversation) =>
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? [];

  const renderLoadingSkeleton = () => (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full max-w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground mt-1">Connect with your matches</p>
        </div>
        <Button 
          onClick={() => router.push("/dashboard/matches")}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Message
        </Button>
      </div>

        <div className="flex items-center gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          renderLoadingSkeleton()
        ) : filteredConversations.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 px-4"
          >
            <div className="bg-muted/50 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <MessageSquare className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No conversations yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Start connecting with your matches to begin meaningful conversations
            </p>
            <Button 
              onClick={() => router.push("/dashboard/matches")}
              size="lg"
              className="gap-2"
            >
              <Plus className="h-5 w-5" />
              Find Matches
            </Button>
          </motion.div>
        ) : (
          <Conversations filteredConversations={filteredConversations} unreadCounts={unreadCounts} />
        )}
      </div>
    </div>
  );
}