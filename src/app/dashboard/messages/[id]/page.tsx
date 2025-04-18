"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOrCreateConversation, sendMessage, markConversationAsRead } from "@/actions/conversation.action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { useSocket } from "@/lib/client-socket";
import { useSession } from "next-auth/react";

interface Message {
  id: string;
  content: string;
  senderId: string;
  read: boolean;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    image: string;
  };
}

interface Conversation {
  id: string;
  messages: Message[];
  currentUserId: string;
  otherUserId: string;
}

export default function ConversationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [messageInput, setMessageInput] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUserId, setTypingUserId] = useState<string | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { data: session } = useSession();
  
  const { 
    sendMessage: socketSendMessage, 
    subscribeToNewMessages, 
    subscribeToTyping,
    sendTypingStatus,
    markMessagesAsRead,
    subscribeToMessagesRead,
    isConnected
  } = useSocket();

  const fetchConversation = async () => {
    try {
      setLoading(true);
      const data: any = await getOrCreateConversation(id as string);
      setConversation(data);

      // Mark messages as read
      if (data && data.messages.some((m: { read: any; senderId: any; }) => !m.read && m.senderId !== data.currentUserId)) {
        await markConversationAsRead(data.id);
        markMessagesAsRead(data.id);
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchConversation();
    }
  }, [id]);

  useEffect(() => {
    // Subscribe to new messages
    const unsubscribeNewMessages = subscribeToNewMessages((message) => {
      if (message.conversationId === id) {
        setConversation(prev => {
          if (!prev) return prev;
          
          // Only add if not already in the list
          const messageExists = prev.messages.some(m => m.id === message.id);
          if (!messageExists) {
            const newMessages = [...prev.messages, message];
            
            // If message from other user, mark as read
            if (message.senderId !== prev.currentUserId) {
              markMessagesAsRead(prev.id);
              markConversationAsRead(prev.id);
            }
            
            return {
              ...prev,
              messages: newMessages
            };
          }
          return prev;
        });
      }
    });
    
    // Subscribe to typing events
    const unsubscribeTyping = subscribeToTyping(({ userId, isTyping }) => {
      if (conversation && userId !== conversation.currentUserId) {
        setIsTyping(isTyping);
        setTypingUserId(isTyping ? userId : null);
      }
    });
    
    // Subscribe to read receipts
    const unsubscribeMessagesRead = subscribeToMessagesRead(({ conversationId, readBy }) => {
      if (conversationId === id) {
        setConversation(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: prev.messages.map(msg => 
              msg.senderId === prev.currentUserId ? { ...msg, read: true } : msg
            )
          };
        });
      }
    });
    
    return () => {
      unsubscribeNewMessages?.();
      unsubscribeTyping?.();
      unsubscribeMessagesRead?.();
    };
  }, [id, conversation?.currentUserId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation?.messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!messageInput.trim() || sendingMessage || !conversation) return;
    
    try {
      setSendingMessage(true);
      
      // Try to send via socket first for real-time delivery
      const sentViaSocket = socketSendMessage(conversation.id, messageInput.trim());
      
      if (!sentViaSocket) {
        // Fallback to API if socket fails
        await sendMessage(conversation.id, messageInput.trim());
        fetchConversation();
      }
      
      // Clear input regardless
      setMessageInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = () => {
    // Send typing indicator to other user
    if (conversation) {
      sendTypingStatus(conversation.id, true);
      
      // Clear previous timer
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
      
      // Set new timer to stop typing after 2 seconds
      typingTimerRef.current = setTimeout(() => {
        if (conversation) {
          sendTypingStatus(conversation.id, false);
        }
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-6 w-40" />
          </div>
          
          <div className="bg-card rounded-lg border border-border overflow-hidden p-4">
            <div className="space-y-4 mb-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[80%] ${i % 2 === 0 ? "bg-muted" : "bg-primary/10"} rounded-lg p-3`}>
                    <Skeleton className={`h-4 w-${40 + Math.floor(Math.random() * 60)}`} />
                  </div>
                </div>
              ))}
            </div>
            <Skeleton className="h-12 w-full mt-4" />
          </div>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center py-12">
          <h3 className="text-lg font-medium">Conversation not found</h3>
          <p className="text-muted-foreground mb-4">
            This conversation may no longer exist or you don't have access to it
          </p>
          <Button onClick={() => router.push("/dashboard/conversations")}>
            Back to conversations
          </Button>
        </div>
      </div>
    );
  }

  const otherUser = conversation.messages[0]?.sender.id !== conversation.currentUserId
    ? conversation.messages[0]?.sender
    : conversation.messages.find(m => m.senderId !== conversation.currentUserId)?.sender;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push("/dashboard/messages")}
            className="md:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <Avatar className="h-10 w-10">
            <AvatarImage src={otherUser?.image} />
            <AvatarFallback>
              {otherUser?.name?.substring(0, 2) || "??"}
            </AvatarFallback>
          </Avatar>
          
          <h1 className="text-xl font-semibold">
            {otherUser?.name || "Chat"}
          </h1>
          
          <div className="ml-auto flex items-center">
            {isConnected ? (
              <span className="text-xs text-green-500 flex items-center">
                <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                Online
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">Offline</span>
            )}
          </div>
        </div>
        
        <div className="bg-card rounded-lg border border-border overflow-hidden flex flex-col h-[calc(100vh-16rem)]">
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {conversation.messages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                conversation.messages.map((message) => {
                  const isCurrentUser = message.senderId === conversation.currentUserId;
                  return (
                    <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] relative group ${
                        isCurrentUser 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      } rounded-lg p-3`}>
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                        <div className="flex items-center justify-end mt-1 gap-1">
                          <span className="text-xs opacity-70">
                            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                          </span>
                          {isCurrentUser && message.read && (
                            <span className="text-xs opacity-70">✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messageEndRef} />
            </div>
          </div>
          
          <form 
            onSubmit={handleSendMessage}
            className="p-4 border-t border-border flex gap-2"
          >
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              onInput={handleTyping}
              placeholder="Type a message..."
              className="flex-1"
              disabled={sendingMessage}
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={!messageInput.trim() || sendingMessage}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}