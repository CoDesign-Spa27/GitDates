import React, { useRef, useEffect, useCallback } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ChatMessage } from './chat-message'
import { TypingIndicator } from './typing'

interface Message {
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

interface VirtualizedChatProps {
  messages: Message[]
  currentUserId: string
  isTyping: boolean
  typingUser?: {
    name?: string
    image?: string
  }
  onScrollToBottom?: () => void
}

export function VirtualizedChat({
  messages,
  currentUserId,
  isTyping,
  typingUser,
  onScrollToBottom,
}: VirtualizedChatProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const scrollToBottomRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: messages.length + (isTyping ? 1 : 0),
    getScrollElement: () => parentRef.current,
    estimateSize: () => 70,
    overscan: 5,
  })

  const scrollToBottom = useCallback(() => {
    if (parentRef.current) {
      parentRef.current.scrollTop = parentRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (isTyping) {
      scrollToBottom()
    }
  }, [isTyping, scrollToBottom])

  const renderMessage = useCallback(
    (index: number) => {
      if (isTyping && index === messages.length) {
        return (
          <TypingIndicator
            username={typingUser?.name}
            avatarUrl={typingUser?.image}
          />
        )
      }

      const message = messages[index]
      if (!message) return null

      const isCurrentUser = message.senderId === currentUserId
      const showAvatar =
        index === 0 || messages[index - 1]?.senderId !== message.senderId

      return (
        <ChatMessage
          key={message.id}
          message={message}
          isCurrentUser={isCurrentUser}
          showAvatar={showAvatar}
        />
      )
    },
    [messages, currentUserId, isTyping, typingUser]
  )

  return (
    <div
      ref={parentRef}
      className="flex-1 overflow-y-auto p-4"
      style={{ height: 'calc(100vh - 12rem)' }}>
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}>
            {renderMessage(virtualRow.index)}
          </div>
        ))}
      </div>
      <div ref={scrollToBottomRef} />
    </div>
  )
}
