"use client";

import { useState, useEffect } from "react";
import { getConversations, getUnreadMessageCounts } from "@/actions/conversation.action";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { useSocket } from "@/lib/client-socket";

interface Conversation {
  id: string | null;
  matchId: string;
  otherUserId: string;
  name: string;
  image: string;
  lastMessage: {
    id: string;
    content: string;
    createdAt: string;
    read: boolean;
    senderId: string;
  } | null;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const router = useRouter();
  const { subscribeToNewMessages } = useSocket();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [conversationsData, unreadData] = await Promise.all([
        getConversations(),
        getUnreadMessageCounts()
      ]);

      setConversations(conversationsData);
      setUnreadCounts(unreadData?.byConversation || {});
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    const unsubscribe = subscribeToNewMessages((message) => {
      // Update conversations when a new message arrives
      fetchData();
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConversationClick = (conversation: Conversation) => {
    if (conversation.matchId) {
      router.push(`/dashboard/messages/${conversation.matchId}`);
    } else if (conversation.matchId) {
      router.push(`/dashboard/messages/new?matchId=${conversation.matchId}`);
    }
  };

  const renderLoadingSkeleton = () => (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>

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

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {loading ? (
            renderLoadingSkeleton()
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No conversations yet</h3>
              <p className="text-muted-foreground mb-4">
                When you match with someone, you can start chatting with them
              </p>
              <Button onClick={() => router.push("/dashboard/matches")}>
                Go to matches
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredConversations.map((conversation) => {
                const unreadCount = unreadCounts[conversation.id || ""] || 0;
                return (
                  <div
                    key={conversation.id || conversation.matchId}
                    className={`flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors ${
                      unreadCount > 0 ? "bg-muted/30" : ""
                    }`}
                    onClick={() => handleConversationClick(conversation)}
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conversation.image} />
                      <AvatarFallback>
                        {conversation.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{conversation.name}</h3>
                        {conversation.lastMessage && (
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(
                              new Date(conversation.lastMessage.createdAt), 
                              { addSuffix: true }
                            )}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage
                          ? conversation.lastMessage.content
                          : "Start a conversation"}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <div className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-medium">
                        {unreadCount}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}