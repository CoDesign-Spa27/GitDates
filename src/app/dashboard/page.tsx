'use client'
import { getMatchPreference, getMatchRequests } from '@/actions/match.action'
import { getGithubProfile } from '@/actions/user.profile.action'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import {motion}  from 'motion/react'
import { RequestsList } from '@/components/recieved-request'
import { ProfileSetupSuccess } from '@/components/dashboard/ProfileSetupSuccess'
import { NewRequestsCard } from '@/components/dashboard/new-requests'
import { ConnectionsCard } from '@/components/dashboard/connections-card'
import { ActiveSummary } from '@/components/dashboard/active-summary'
import useSWR from 'swr'
import { getProfileSetupStatus } from '@/fetchers/fetchers'
import { useProfileSetupStatus } from '@/components/hooks/useProfileSetupStatus'
import { useMatchRequest } from '@/components/hooks/useMatchRequests'

export interface UserData {
  basicInfo: {
    login: string
    name: string
    bio: string
    avatar_url: string
    city: string | null
    state: string | null
    country: string | null
    blog: string
    public_repos: number
    followers: number
    following: number
    totalContributions: number
  }
  socialStats: {
    followers: Array<{ login: string; avatar_url: string }>
    following: Array<{ login: string; avatar_url: string }>
  }
  codingProfile: {
    topLanguages: Record<string, number>
    starredReposCount: number
  }
  activity: {
    recentEvents: Array<{
      type: string
      repo: { name: string }
      created_at: string
    }>
    topRepositories: Array<{
      name: string
      description: string
      stars: number
      language: string
    }>
  }
}

export default function Dashboard() {
  const {data:session} = useSession();
 
  const { data: profileSetupStatus, isLoading : isProfileStatusLoading } = useProfileSetupStatus()
  const {data: matchRequests} = useMatchRequest()
 
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
 
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className='lg:col-span-2'>
          {/* some kind of graphical representation */}
          </div>
          <div className="md:col-span-2 lg:col-span-1">
            <ProfileSetupSuccess 
              isMatchPreferenceCreated={profileSetupStatus?.isMatchPreferenceCreated ?? false} 
              isProfileCreated={profileSetupStatus?.isProfileCreated ?? false} 
            />
          </div>

          <div className="lg:col-span-1">
            <NewRequestsCard matchRequests={matchRequests} />
        </div>
 
        <div className="lg:col-span-1">
          <ConnectionsCard />
        </div>
        <div className="lg:col-span-1">
          <ActiveSummary />
        </div>
        </div>
      
  
    </div>
  );
}

