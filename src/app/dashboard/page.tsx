'use client'
import { getMatchPreference, getMatchRequests } from '@/actions/match.action'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import {motion}  from 'motion/react'
import { RequestsList } from '@/components/recieved-request'
import { ProfileSetupSuccess } from '@/components/dashboard/ProfileSetupSuccess'
import { NewRequestsCard } from '@/components/dashboard/new-requests'
import { ConnectionsCard } from '@/components/dashboard/matches-card'
import { ActiveSummary } from '@/components/dashboard/active-summary'
import useSWR from 'swr'
import { getProfileSetupStatus } from '@/fetchers/fetchers'
import { useProfileSetupStatus } from '@/components/hooks/useProfileSetupStatus'
import { useMatchRequest } from '@/components/hooks/useMatchRequests'
import { useMyMatches } from '@/components/hooks/useMyMatches'
import { useGetActivitySummary } from '@/components/hooks/useGetActivitySummary'
 
export default function Dashboard() {
  const {data:session} = useSession();
 
  const { data: profileSetupStatus, isLoading : isProfileStatusLoading } = useProfileSetupStatus()
  const {data: matchRequests, isLoading:isMatchRequestsLoading} = useMatchRequest()
  const {data: matches, isLoading:isMyMatchesLoading } = useMyMatches();
  const {data:activity, isLoading:isActivityLoading } = useGetActivitySummary();
  // if (isLoading) {
  //   return (
  //     <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="container mx-auto p-4">
  //       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
  //         {error}
  //       </div>
  //     </div>
  //   );
  // }

 
  return (
     <div className="container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12">
          <div className='lg:col-span-8'>
            <ActiveSummary loading={isActivityLoading} activityData={activity ?? { profileViews: 0, newConnections: 0, pendingRequests: 0 }} />
          </div>
          <div className="lg:col-span-4">
            <ProfileSetupSuccess 
              isMatchPreferenceCreated={profileSetupStatus?.isMatchPreferenceCreated ?? false} 
              isProfileCreated={profileSetupStatus?.isProfileCreated ?? false} 
              isLoading={isProfileStatusLoading}
            />
          </div>

          <div className="lg:col-span-6">
            <NewRequestsCard matchRequests={matchRequests} isLoading={isMatchRequestsLoading}/>
          </div>
 
        <div className="lg:col-span-6">
          <ConnectionsCard matches={matches as []} isLoading={isMyMatchesLoading}/>
        </div>
        </div>
      
  
    </div>
  );
}

