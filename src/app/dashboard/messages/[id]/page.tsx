'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, ArrowLeft } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

import { useSocket } from '@/lib/client-socket'
import { useMessage } from '@/components/hooks/useMessage'

import { UserStatus } from '@/components/chat/user-status'
import { VirtualizedChat } from '@/components/chat/virtualized-chat'

type Conversation = {
  id: string
  matchId: string
  lastMessageId: string | null
  createdAt: Date
  updatedAt: Date
  messages: Array<any>
  currentUserId: string
  otherUserId: string
}

export default function MessagesPage() {
  const { id: conversationId } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: session } = useSession()
  const { getOrCreateMessage } = useMessage(conversationId)
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [loading, setLoading] = useState(true)
  const [messageInput, setMessageInput] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [typingUserId, setTypingUserId] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(false)

  const messageEndRef = useRef<HTMLDivElement>(null)
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null)

  const {
    sendMessage: socketSendMessage,
    subscribeToNewMessages,
    subscribeToTyping,
    sendTypingStatus,
    markMessagesAsRead,
    subscribeToMessagesRead,
    isConnected,
    subscribeToOnlineUser,
  } = useSocket()

  const fetchConversation = useCallback(() => {
    if (!conversationId) return

    setLoading(true)
    getOrCreateMessage.mutate(undefined, {
      onSuccess: (data) => {
        if (data?.additional) {
          setConversation(data.additional)
        }
      },
      onError: (err) => console.error('Error loading conversation:', err),
      onSettled: () => setLoading(false),
    })
  }, [conversationId])

  useEffect(() => {
    fetchConversation()
  }, [fetchConversation])

  useEffect(() => {
    if (!conversation || !isConnected) return

    const unsubscribeNewMessages = subscribeToNewMessages((message) => {
      if (message.conversationId !== conversation.id) return

      setConversation((prev) => {
        if (!prev) return prev

        const exists = prev.messages.some((m) => m.id === message.id)
        if (!exists) {
          if (message.senderId !== prev.currentUserId)
            markMessagesAsRead(prev.id)
          return { ...prev, messages: [...prev.messages, message] }
        }

        return {
          ...prev,
          messages: prev.messages.map((m) =>
            m.id.startsWith('temp-') && m.content === message.content
              ? message
              : m
          ),
        }
      })
    })

    const unsubscribeTyping = subscribeToTyping(({ userId, isTyping }) => {
      if (userId !== conversation.currentUserId) {
        setIsTyping(isTyping)
        setTypingUserId(isTyping ? userId : null)
      }
    })

    const unsubscribeMessagesRead = subscribeToMessagesRead(
      ({ conversationId }) => {
        if (conversationId !== conversation.id) return
        setConversation((prev) =>
          prev
            ? {
                ...prev,
                messages: prev.messages.map((m) =>
                  m.senderId === prev.currentUserId ? { ...m, read: true } : m
                ),
              }
            : prev
        )
      }
    )

    const unsubscribeOnlineUser = subscribeToOnlineUser((onlineUserIds) => {
      setIsOnline(onlineUserIds.includes(conversation.otherUserId))
    })

    return () => {
      unsubscribeNewMessages()
      unsubscribeTyping()
      unsubscribeMessagesRead()
      unsubscribeOnlineUser()
    }
  }, [conversation, isConnected])

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation?.messages, isTyping])

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!messageInput.trim() || sendingMessage || !conversation) return

    const content = messageInput.trim()
    setMessageInput('')
    setSendingMessage(true)

    try {
      socketSendMessage(conversation.id, content)
    } catch (err) {
      console.error('Failed to send message:', err)
    } finally {
      setSendingMessage(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleTyping = () => {
    if (!conversation || !isConnected) return

    sendTypingStatus(conversation.id, true)
    clearTimeout(typingTimerRef.current!)

    typingTimerRef.current = setTimeout(() => {
      sendTypingStatus(conversation.id, false)
    }, 2000)
  }

  useEffect(() => {
    return () => {
      clearTimeout(typingTimerRef.current!)
      if (conversation && isConnected) {
        sendTypingStatus(conversation.id, false)
      }
    }
  }, [conversation, sendTypingStatus, isConnected])

  const getOtherUser = () => {
    if (!conversation?.messages.length) return null
    return (
      conversation.messages.find(
        (m) => m.senderId !== conversation.currentUserId
      )?.sender || null
    )
  }

  const otherUser = getOtherUser()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="overflow-hidden rounded-lg border border-border bg-card p-4">
            <div className="mb-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div
                    className={`max-w-[80%] ${i % 2 === 0 ? 'bg-muted' : 'bg-primary/10'} rounded-lg p-3`}>
                    <Skeleton
                      className={`h-4 w-${40 + Math.floor(Math.random() * 60)}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Skeleton className="mt-4 h-12 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl py-12 text-center">
          <h3 className="text-lg font-medium">Conversation not found</h3>
          <p className="mb-4 text-muted-foreground">
            This conversation may no longer exist or you don't have access to it
          </p>
          <Button onClick={() => router.push('/dashboard/conversations')}>
            Back to conversations
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard/conversations')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={otherUser?.image ?? undefined}
              alt={`${otherUser?.name ?? 'User'}'s avatar`}
            />
            <AvatarFallback>
              {otherUser?.name?.substring(0, 2) || '??'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-semibold">
              {otherUser?.name || 'Chat'}
            </h1>
            <UserStatus isOnline={isOnline} />
          </div>
        </div>

        <div className="flex h-[calc(100vh-12rem)] flex-col overflow-hidden rounded-lg border border-border bg-card">
          {conversation.messages.length === 0 ? (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="py-12 text-center text-muted-foreground">
                <p>No messages yet. Start the conversation!</p>
              </div>
            </div>
          ) : (
            <VirtualizedChat
              messages={conversation.messages}
              currentUserId={conversation.currentUserId}
              isTyping={isTyping}
              typingUser={otherUser}
            />
          )}
          <form
            onSubmit={handleSendMessage}
            className="flex gap-2 border-t border-border p-4">
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
              disabled={!messageInput.trim() || sendingMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
