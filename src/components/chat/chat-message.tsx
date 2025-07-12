import React, { forwardRef } from 'react'
import { format, isToday, isYesterday } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { cn } from '@/lib/utils'

interface ChatMessageProps {
  message: {
    id: string
    content: string
    senderId: string
    read: boolean
    createdAt: string
    sender: {
      id: string
      name: string
      image: string
    }
  }
  isCurrentUser: boolean
  showAvatar?: boolean
}

export const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(
  ({ message, isCurrentUser, showAvatar = true }, ref) => {
    const messageDate = new Date(message.createdAt)

    const formatMessageTime = () => {
      if (isToday(messageDate)) {
        return format(messageDate, 'HH:mm')
      } else if (isYesterday(messageDate)) {
        return `Yesterday, ${format(messageDate, 'HH:mm')}`
      } else {
        return format(messageDate, 'MMM d, HH:mm')
      }
    }


    return (
      <div
        ref={ref}
        className={cn(
          'mb-2 flex min-h-[60px] items-end gap-2',
          isCurrentUser ? 'justify-end' : 'justify-start'
        )}>
        {!isCurrentUser && showAvatar && (
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={message.sender.image} />
            <AvatarFallback>
              {message.sender.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
        )}

        <div
          className={cn(
            'max-w-[75%] break-words rounded-lg border border-gitdate px-3 py-2',
            isCurrentUser
              ? 'rounded-br-none bg-primary text-primary-foreground'
              : 'rounded-bl-none bg-muted'
          )}>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </p>
          <div
            className={cn(
              'mt-1 flex text-[10px]',
              isCurrentUser ? 'justify-end' : 'justify-start',
              isCurrentUser
                ? 'text-primary-foreground/70'
                : 'text-muted-foreground'
            )}>
            <span>{formatMessageTime()}</span>
            {isCurrentUser && (
              <span
                className={cn(
                  'ml-1',
                  message.read
                    ? 'font-bold text-gitdate/70'
                    : 'text-muted-foreground'
                )}>
                {message.read ? '✓✓' : '✓'}
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }
)

ChatMessage.displayName = 'ChatMessage'
