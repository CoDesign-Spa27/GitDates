"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOrCreateConversation, markConversationAsRead } from "@/actions/conversation.action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSocket } from "@/lib/client-socket";
import { useSession } from "next-auth/react";
import { ChatMessage } from "@/components/chat/chat-message";
import { TypingIndicator } from "@/components/chat/typing";
import { UserStatus } from "@/components/chat/user-status";

// Type definitions for better type safety
interface User {
  id: string;
  name: string;
  image: string;
  lastSeen?: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  read: boolean;
  createdAt: string;
  sender: User;
}

interface Conversation {
  id: string;
  messages: Message[];
  currentUserId: string;
  otherUserId: string;
}

export default function MessagesPage() {
  // Hooks for routing and session management
  const { id: conversationId } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();

  // State management
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [messageInput, setMessageInput] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUserId, setTypingUserId] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  // Refs for DOM manipulation and timers
  const messageEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Socket hooks for real-time communication
  const { 
    sendMessage: socketSendMessage, 
    subscribeToNewMessages, 
    subscribeToTyping,
    sendTypingStatus,
    markMessagesAsRead,
    subscribeToMessagesRead,
    isConnected,
    subscribeToOnlineUser
  } = useSocket();

  /**
   * Fetches conversation data and marks messages as read if needed
   */
  const fetchConversation = useCallback(async () => {
    if (!conversationId) return;

    try {
      setLoading(true);
      const data = await getOrCreateConversation(conversationId);
      
      if (data) {
        setConversation(data);

        // Mark messages as read if there are unread messages from the other user
        const hasUnreadMessages = data.messages.some(
          m => !m.read && m.senderId !== data.currentUserId
        );

        if (hasUnreadMessages) {
          await markConversationAsRead(data.id);
          markMessagesAsRead(data.id);
        }
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
    } finally {
      setLoading(false);
    }
  }, [conversationId, markMessagesAsRead]);

  // Fetch conversation on initial render or when conversationId changes
  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  /**
   * Sets up socket subscriptions for real-time updates
   */
  useEffect(() => {
    if (!conversation || !isConnected) return;
    
    // Handle new incoming messages
    const unsubscribeNewMessages = subscribeToNewMessages((message) => {
      if (message.conversationId === conversation.id) {
        setConversation(prev => {
          if (!prev) return prev;
          
          // Check for duplicate messages
          const messageExists = prev.messages.some(m => m.id === message.id);
          
          if (!messageExists) {
            // Mark as read if message is from other user
            if (message.senderId !== prev.currentUserId) {
              markMessagesAsRead(prev.id);
              markConversationAsRead(prev.id).catch(console.error);
            }
            
            return {
              ...prev,
              messages: [...prev.messages, message]
            };
          }
          
          // Update temporary messages with server-generated IDs
          return {
            ...prev,
            messages: prev.messages.map(m => 
              (m.id.startsWith('temp-') && m.content === message.content) ? message : m
            )
          };
        });
      }
    });
    
    // Handle typing indicators
    const unsubscribeTyping = subscribeToTyping(({ userId, isTyping: userIsTyping }) => {
      if (userId !== conversation.currentUserId) {
        setIsTyping(userIsTyping);
        setTypingUserId(userIsTyping ? userId : null);
      }
    });
    
    // Handle read receipts
    const unsubscribeMessagesRead = subscribeToMessagesRead(({ conversationId: readConversationId }) => {
      if (readConversationId === conversation.id) {
        setConversation(prev => prev ? {
          ...prev,
          messages: prev.messages.map(msg => 
            msg.senderId === prev.currentUserId ? { ...msg, read: true } : msg
          )
        } : prev);
      }
    });

    // Handle online status updates
    const unsubscribeOnlineUser = subscribeToOnlineUser((onlineUserIds: string[]) => {
      setIsOnline(onlineUserIds.includes(conversation.otherUserId));
    });

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeNewMessages();
      unsubscribeTyping();
      unsubscribeMessagesRead();
      unsubscribeOnlineUser();
    };
  }, [
    conversation, 
    isConnected, 
    markMessagesAsRead, 
    subscribeToNewMessages, 
    subscribeToTyping, 
    subscribeToMessagesRead, 
    subscribeToOnlineUser
  ]);
 
  /**
   * Auto-scroll to the bottom of the message list when messages change
   */
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages, isTyping]);

  /**
   * Handles sending a new message
   */
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    // Validate input and state
    if (!messageInput.trim() || sendingMessage || !conversation) return;
  
    const content = messageInput.trim();
    setMessageInput("");
    setSendingMessage(true);
  
    try {
      // Send message via socket (backend handles persistence)
      socketSendMessage(conversation.id, content);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSendingMessage(false);
    }
  };
  
  /**
   * Handles Enter key press for message submission
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); 
      handleSendMessage();
    }
  };

  /**
   * Notifies other user when current user is typing
   */
  const handleTyping = () => {
    if (!conversation || !isConnected) return;
   
    // Send typing status and set timeout to clear it
    sendTypingStatus(conversation.id, true);
      
    clearTimeout(typingTimerRef.current as NodeJS.Timeout);
    
    typingTimerRef.current = setTimeout(() => {
      sendTypingStatus(conversation.id, false);
    }, 2000);
  };

  /**
   * Cleans up typing status on component unmount
   */
  useEffect(() => {
    return () => {
      clearTimeout(typingTimerRef.current as NodeJS.Timeout);
      
      if (conversation && isConnected) {
        sendTypingStatus(conversation.id, false);
      }
    };
  }, [conversation, sendTypingStatus, isConnected]);

  /**
   * Extracts the other user's details from the conversation
   */
  const getOtherUser = () => {
    if (!conversation?.messages.length) return null;
    
    return conversation.messages.find(
      m => m.senderId !== conversation.currentUserId
    )?.sender;
  };

  const otherUser = getOtherUser();

  // Loading state
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

  // Error state - conversation not found
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header with back button and user info */}
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push("/dashboard/conversations")}
            aria-label="Back to conversations"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <Avatar className="h-10 w-10">
            <AvatarImage src={otherUser?.image} alt={`${otherUser?.name}'s avatar`} />
            <AvatarFallback>
              {otherUser?.name?.substring(0, 2) || "??"}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h1 className="text-xl font-semibold">
              {otherUser?.name || "Chat"}
            </h1>
            <UserStatus isOnline={isOnline} />
          </div>
        </div>
        
        {/* Main chat area */}
        <div className="bg-card rounded-lg border border-border overflow-hidden flex flex-col h-[calc(100vh-16rem)]">
          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {conversation.messages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                conversation.messages.map((message, index) => (
                  <ChatMessage 
                    key={message.id}
                    message={message}
                    isCurrentUser={message.senderId === conversation.currentUserId}
                    showAvatar={index === 0 || 
                      conversation.messages[index - 1].senderId !== message.senderId}
                  />
                ))
              )}
              
              {/* Typing indicator */}
              {isTyping && (
                <TypingIndicator 
                  username={otherUser?.name}
                  avatarUrl={otherUser?.image}
                />
              )}
              
              {/* Scroll anchor */}
              <div ref={messageEndRef} />
            </div>
          </div>
          
          {/* Message input form */}
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
              aria-label="Message input"
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={!messageInput.trim() || sendingMessage}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}