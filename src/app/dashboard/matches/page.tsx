'use client'
import { useState } from 'react'
import { respondToMatchRequest } from '@/actions/match.action'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Check, X, Heart } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { useMyMatches } from '@/components/hooks/useMyMatches'
import { useMatchRequest } from '@/components/hooks/useMatchRequests'
import { useProfileSetupStatus } from '@/components/hooks/useProfileSetupStatus'
import { SetupReminder } from '@/components/setup-reminder'

interface Profile {
  name: string
  image: string
  bio: string
}

interface Match {
  matchId: string
  userId: string
  profile: Profile
  createdAt: Date
}

interface MatchRequest {
  id: string
  sender: {
    gitDateProfile: Profile
  }
  createdAt: Date
}

export default function MatchesPage() {
  const [activeTab, setActiveTab] = useState('matches')
  const { data: matches, isLoading: matchesLoading } = useMyMatches()
  const {
    data: requests,
    mutateAsync: respondToMatchRequest,
    isLoading: requestsLoading,
  } = useMatchRequest()
  const { setupDone, isLoading: setupLoading } = useProfileSetupStatus()

  const handleAccept = async (matchId: string) => {
    try {
      await respondToMatchRequest({ matchId, action: 'ACCEPT' })
      toast({
        title: 'Match request accepted!',
        description: 'You can now message each other',
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: 'Failed to accept match request',
        variant: 'destructive',
      })
    }
  }

  const handleReject = async (matchId: string) => {
    try {
      await respondToMatchRequest({ matchId, action: 'REJECT' })
      toast({
        title: 'Match request declined',
        description: 'The request has been removed',
      })
    } catch (error) {
      toast({
        title: 'Failed to decline match request',
        variant: 'destructive',
      })
    }
  }

  const renderLoadingSkeleton = () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
  if (!setupDone && !setupLoading && !matchesLoading && !requestsLoading) {
    return <SetupReminder />
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs
        defaultValue="matches"
        value={activeTab}
        onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="matches">
            Matches
            {matchesLoading ? (
              <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent"></span>
            ) : matches?.length > 0 ? (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {matches.length}
              </span>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="requests">
            Requests
            {requestsLoading ? (
              <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-amber-500 border-r-transparent"></span>
            ) : requests?.length > 0 ? (
              <span className="ml-2 rounded-full bg-amber-500 px-2 py-0.5 text-xs text-white">
                {requests.length}
              </span>
            ) : null}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matches">
          {matchesLoading ? (
            renderLoadingSkeleton()
          ) : !matches?.length ? (
            <div className="py-12 text-center">
              <Heart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">No matches yet</h3>
              <p className="text-muted-foreground">
                When you match with someone, they'll appear here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {matches.map((match: any) => (
                <MatchCard key={match.matchId} match={match} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests">
          {requestsLoading ? (
            renderLoadingSkeleton()
          ) : !requests?.length ? (
            <div className="py-12 text-center">
              <Heart className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">No pending requests</h3>
              <p className="text-muted-foreground">
                When someone sends you a match request, it will appear here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {requests.map((request: any) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onAccept={() => handleAccept(request.id)}
                  onReject={() => handleReject(request.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MatchCard({ match }: { match: any }) {
  const router = useRouter()

  if (!match.profile) return null

  const handleMessage = () => {
    router.push(`/dashboard/messages/new?matchId=${match.matchId}`)
  }

  const handleViewProfile = () => {
    router.push(`/dashboard/profile/${match.userId}`)
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex gap-4 p-4">
        <div className="relative">
          <img
            src={match.profile.image || '/placeholder-avatar.png'}
            alt={match.profile.name}
            className="h-16 w-16 rounded-full border-2 border-primary object-cover"
          />
          <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
            <Check className="h-3 w-3 text-white" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold">{match.profile.name}</h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {match.profile.bio || 'No bio available'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Matched {new Date(match.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mt-auto flex gap-2 p-4 pt-0">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleViewProfile}>
          View Profile
        </Button>
        <Button variant="pressed" className="flex-1" onClick={handleMessage}>
          Message
        </Button>
      </div>
    </div>
  )
}

function RequestCard({
  request,
  onAccept,
  onReject,
}: {
  request: any
  onAccept: () => void
  onReject: () => void
}) {
  const [actionLoading, setActionLoading] = useState<
    'accept' | 'reject' | null
  >(null)

  const handleAccept = async () => {
    setActionLoading('accept')
    try {
      await onAccept()
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async () => {
    setActionLoading('reject')
    try {
      await onReject()
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex gap-4 p-4">
        <img
          src={
            request.sender.gitDateProfile?.image || '/placeholder-avatar.png'
          }
          alt={request.sender.gitDateProfile?.name}
          className="h-16 w-16 rounded-full object-cover"
        />

        <div>
          <h3 className="font-bold">{request.sender.gitDateProfile?.name}</h3>
          <p className="text-sm text-muted-foreground">
            {request.sender.gitDateProfile?.bio?.substring(0, 60) ||
              'No bio available'}
            {request.sender.gitDateProfile?.bio?.length > 60 ? '...' : ''}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Sent request {new Date(request.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex gap-2 p-4 pt-0">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleReject}
          disabled={actionLoading !== null}>
          <X className="mr-1 h-4 w-4" />
          {actionLoading === 'reject' ? 'Declining...' : 'Decline'}
        </Button>
        <Button
          variant="default"
          className="flex-1"
          onClick={handleAccept}
          disabled={actionLoading !== null}>
          <Check className="mr-1 h-4 w-4" />
          {actionLoading === 'accept' ? 'Accepting...' : 'Accept'}
        </Button>
      </div>
    </div>
  )
}
