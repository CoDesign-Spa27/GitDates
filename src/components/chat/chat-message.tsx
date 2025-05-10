import React from 'react';
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: {
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
  };
  isCurrentUser: boolean;
  showAvatar?: boolean;
}

export function ChatMessage({ message, isCurrentUser, showAvatar = true }: ChatMessageProps) {
  const messageDate = new Date(message.createdAt);
  
  const formatMessageTime = () => {
    if (isToday(messageDate)) {
      return format(messageDate, 'HH:mm');
    } else if (isYesterday(messageDate)) {
      return `Yesterday, ${format(messageDate, 'HH:mm')}`;
    } else {
      return format(messageDate, 'MMM d, HH:mm');
    }
  };
  
  return (
    <div className={cn(
      "flex items-end gap-2 mb-2", 
      isCurrentUser ? "justify-end" : "justify-start"
    )}>
      {!isCurrentUser && showAvatar && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.sender.image} />
          <AvatarFallback>
            {message.sender.name.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div 
        className={cn(
          "max-w-[75%] rounded-lg px-3 py-2 break-words", 
          isCurrentUser 
            ? "bg-primary text-primary-foreground rounded-br-none" 
            : "bg-muted rounded-bl-none"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <div className={cn(
          "flex text-xs mt-1", 
          isCurrentUser ? "justify-end" : "justify-start",
          isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
        )}>
          <span>{formatMessageTime()}</span>
          {isCurrentUser && (
            <span className="ml-1">
              {message.read ? "✓✓" : "✓"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}