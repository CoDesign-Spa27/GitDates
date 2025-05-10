import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface UserStatusProps {
  isOnline: boolean;
  lastSeen?: string | null;
  className?: string;
}

export function UserStatus({ isOnline, lastSeen, className }: UserStatusProps) {
  return (
    <div className={cn("flex items-center text-xs", className)}>
      <span 
        className={cn(
          "h-2 w-2 rounded-full mr-1",
          isOnline ? "bg-green-500" : "bg-gray-400"
        )}
      />
      
      {isOnline ? (
        <span className="text-green-500">Online</span>
      ) : lastSeen ? (
        <span className="text-muted-foreground">
          Last seen {formatDistanceToNow(new Date(lastSeen), { addSuffix: true })}
        </span>
      ) : (
        <span className="text-muted-foreground">Offline</span>
      )}
    </div>
  );
}