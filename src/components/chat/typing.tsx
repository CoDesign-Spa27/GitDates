import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface TypingIndicatorProps {
  username?: string;
  avatarUrl?: string;
}

export function TypingIndicator({ username = 'User', avatarUrl }: TypingIndicatorProps) {
  return (
    <div className="flex items-end gap-2 mb-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>
          {username.substring(0, 2)}
        </AvatarFallback>
      </Avatar>
      
      <div className="bg-muted rounded-lg px-3 py-2 rounded-bl-none">
        <div className="flex space-x-1 items-center h-6">
          <div className="w-2 h-2 bg-muted-foreground/70 rounded-full animate-bounce" 
               style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-muted-foreground/70 rounded-full animate-bounce" 
               style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-muted-foreground/70 rounded-full animate-bounce" 
               style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}