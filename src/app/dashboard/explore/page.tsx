'use client'
import { findMatches, PotentialMatch } from '@/actions/match.action'
import { useSession } from 'next-auth/react'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { getAllAccounts } from '@/actions/match.action'
import ExploreCard from '@/components/explore-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import useSWR from 'swr'
import { findMatchesFetcher, getAllAccountsFetcher } from '@/fetchers/fetchers'
import { useProfileSetupStatus } from '@/components/hooks/useProfileSetupStatus'
import { SetupReminder } from '@/components/setup-reminder'
import { ShareGitDate } from '@/components/share-gitdate'

export default function Explore() {
  const { data: session } = useSession()

  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'matches' | 'developers'>(
    'matches'
  )
  const email = session?.user?.email
  const { setupDone, isLoading: setupLoading } = useProfileSetupStatus()

  const {
    data: matches,
    error: matchesError,
    isLoading: isMatchesLoading,
  } = useSWR(
    email ? ['matches', email] : null,
    () => findMatchesFetcher(email as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000,
    }
  )
  const {
    data: accounts,
    error: accountsError,
    isLoading: isAccountsLoading,
  } = useSWR(
    email ? ['accounts', email] : null,
    () => getAllAccountsFetcher(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000,
    }
  )

  const filteredMatches = useMemo(
    () => matches?.additional?.filter((match) => match?.score > 1) || [],
    [matches]
  )

  const SkeletonCards = useCallback(
    () => (
      <>
        {[...Array(6)].map((_, index) => (
          <div key={index} className="w-full">
            <Skeleton className="h-[280px] w-full rounded-lg" />
            <div className="mt-3 space-y-2">
              <Skeleton className="h-8 w-3/4" />
            </div>
          </div>
        ))}
      </>
    ),
    []
  )

  if (!setupDone && !setupLoading && !isAccountsLoading && !isMatchesLoading) {
    return <SetupReminder />
  }
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <Tabs
          defaultValue="matches"
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as 'matches' | 'developers')
          }>
          <TabsList className="animate-fade-in w-full sm:w-auto">
            <TabsTrigger value="matches" className="flex-1 sm:flex-none">
              Matches
            </TabsTrigger>
            <TabsTrigger value="developers" className="flex-1 sm:flex-none">
              All Developers
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isAccountsLoading || isMatchesLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <SkeletonCards />
        </div>
      ) : activeTab === 'matches' ? (
        <div className="mb-12">
          {!filteredMatches || filteredMatches.length === 0 ? (
            <div className="rounded-lg bg-gray-50 py-12 text-center dark:bg-neutral-900">
              <p className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                No matches found
              </p>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                Keep exploring to find potential matches!
              </p>
              <div className="mt-6">
                <ShareGitDate />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredMatches.map((match: PotentialMatch) => (
                <ExploreCard
                  key={match.id}
                  account={match.profile}
                  matchScore={match.score}
                  userId={match.id}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {!accounts?.additional || accounts.additional.length === 0 ? (
            <div className="rounded-lg bg-gray-50 py-12 text-center text-gray-500 dark:bg-gray-800">
              <p className="text-lg">No developers found</p>
              <p className="mt-2 text-sm">
                Be the first to join our community!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {accounts.additional.map((account: any) => (
                <ExploreCard
                  key={account.id}
                  userId={account.id}
                  account={account.gitDateProfile}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
