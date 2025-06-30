'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  MessageSquare,
  Search,
  Plus,
  ChevronRight,
  UserCircle2,
  Settings,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDistanceToNow } from 'date-fns'
import { useSocket } from '@/lib/client-socket'
import { useConversations } from '@/components/hooks/useConversation'
import { useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Conversations } from '@/components/conversations'
import { Card } from '@/components/ui/card'
import { useProfileSetupStatus } from '@/components/hooks/useProfileSetupStatus'
import { SetupReminder } from '@/components/setup-reminder'

export default function ConversationsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const { subscribeToNewMessages } = useSocket()
  const { conversations, unreadCounts, isLoading } = useConversations()
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const email = session?.user?.email
  const { setupDone, isLoading: setupLoading } = useProfileSetupStatus()

  useEffect(() => {
    const unsubscribe = subscribeToNewMessages((message) => {
      queryClient.invalidateQueries({ queryKey: ['unread-counts', email] })
    })

    return () => {
      unsubscribe?.()
    }
  }, [subscribeToNewMessages, queryClient, unreadCounts])

  const filteredConversations =
    conversations?.filter((conversation: any) =>
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? []

  const renderLoadingSkeleton = () => (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex animate-pulse items-center gap-4 p-4">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full max-w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  )

  if (!setupDone && !setupLoading && !isLoading) {
    return <SetupReminder />
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Messages</h1>
          <p className="mt-1 text-muted-foreground">
            Connect with your matches
          </p>
        </div>
        <Button
          onClick={() => router.push('/dashboard/matches')}
          className="gap-2">
          <Plus className="h-4 w-4" />
          New Message
        </Button>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card className="overflow-hidden rounded-xl bg-card shadow-sm">
        {isLoading ? (
          renderLoadingSkeleton()
        ) : filteredConversations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-16 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 p-4">
              <MessageSquare className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-2xl font-semibold">
              No conversations yet
            </h3>
            <p className="mx-auto mb-6 max-w-sm text-muted-foreground">
              Start connecting with your matches to begin meaningful
              conversations
            </p>
            <Button
              onClick={() => router.push('/dashboard/matches')}
              size="lg"
              className="gap-2">
              <Plus className="h-5 w-5" />
              Find Matches
            </Button>
          </motion.div>
        ) : (
          <Conversations
            filteredConversations={filteredConversations}
            unreadCounts={unreadCounts}
          />
        )}
      </Card>
    </div>
  )
}
