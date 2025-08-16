'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getOrCreateConversation } from '@/actions/conversation.action'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

function ConversationCreator() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const matchId = searchParams.get('matchId')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!matchId) {
      setError('No match specified')
      setLoading(false)
      return
    }

    const createConversation = async () => {
      try {
        setLoading(true)
        const conversation = await getOrCreateConversation(matchId)
        if (conversation) {
          router.push(`/dashboard/messages/${matchId}`)
        } else {
          setError('Could not create conversation')
          setLoading(false)
        }
      } catch (error) {
        setError('Failed to create conversation. Please try again.')
        setLoading(false)
      }
    }

    createConversation()
  }, [matchId, router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="py-12 text-center">
          <Skeleton className="mx-auto mb-4 h-8 w-56" />
          <Skeleton className="mx-auto h-4 w-80" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="py-12 text-center">
          <h3 className="mb-2 text-lg font-medium">Error</h3>
          <p className="mb-4 text-muted-foreground">{error}</p>
          <Button onClick={() => router.push('/dashboard/messages')}>
            Back to messages
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="py-12 text-center">
        <h3 className="text-lg font-medium">Creating conversation...</h3>
      </div>
    </div>
  )
}

export default function NewConversationPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="py-12 text-center">
            <Skeleton className="mx-auto mb-4 h-8 w-56" />
            <Skeleton className="mx-auto h-4 w-80" />
          </div>
        </div>
      }>
      <ConversationCreator />
    </Suspense>
  )
}
