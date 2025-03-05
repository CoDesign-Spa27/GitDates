'use client'
import { getMatchPreference, getMatchRequests } from '@/actions/match.action'
import { getGithubProfile } from '@/actions/user.profile.action'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import {motion}  from 'motion/react'
import { RequestsList } from '@/components/recieved-request'

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
  const [profile, setProfile] = useState<any>(null);
  const [matchPreference, setMatchPreference] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileCreated, setIsProfileCreated] = useState(false);
  const [isMatchPreferenceCreated, setIsMatchPreferenceCreated] = useState(false);
  const [matchRequests,setMatchRequests] = useState<any[]>([]);
  const {data:session} = useSession();
  const user = session?.user;
 
  console.log(matchRequests)

 

  useEffect(() => {
    const fetchProfile = async () => {
      if(!session?.user) return;
      try {
        const data = await getGithubProfile();
        const matchPreference = await getMatchPreference(session?.user?.email || '');
        const matchRequests= await getMatchRequests();
        setMatchRequests(matchRequests);
        setProfile(data);
        setMatchPreference(matchPreference);
        setIsProfileCreated(!!data);
        setIsMatchPreferenceCreated(!!matchPreference);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsProfileCreated(false);
      } finally {
        setIsLoading(false);
      }
    };
  
      fetchProfile();
   
  }, [session?.user]);
 
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }


  const GetStartedSection = ({isProfileCreated,isMatchPreferenceCreated}:{isProfileCreated:boolean,isMatchPreferenceCreated:boolean}) => {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <motion.h1
          className="text-3xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Complete these steps to unlock your Dashboard
        </motion.h1>
  
        <div className="space-y-6">
 
          <motion.div
            className={`p-6 rounded-lg border shadow-lg flex items-center gap-4 transition-all ${isProfileCreated ? "dark:bg-neutral-900  border-gitdate" : "bg-yellow-100 border-yellow-300"}`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${isProfileCreated ? "bg-gitdate" : "bg-yellow-500"}`}
              whileHover={{ scale: 1.1 }}
            >
              {isProfileCreated ? "✓" : "1"}
            </motion.div>
            <div>
              <h2 className="text-xl font-semibold">Create GitHub Profile</h2>
              <p className="text-gray-600">
                {isProfileCreated
                  ? "Your GitHub profile has been created successfully!"
                  : "Connect your GitHub account to create your dating profile."}
              </p>
            </div>
          </motion.div>
 
          <motion.div
            className={`p-6 rounded-lg border shadow-lg flex items-center gap-4 transition-all ${isMatchPreferenceCreated ? "dark:bg-neutral-900 border-gitdate" : "bg-yellow-100 border-yellow-300"}`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${isMatchPreferenceCreated ? "bg-gitdate" : "bg-yellow-500"}`}
              whileHover={{ scale: 1.1 }}
            >
              {isMatchPreferenceCreated ? "✓" : "2"}
            </motion.div>
            <div>
              <h2 className="text-xl font-semibold">Set Match Preferences</h2>
              <p className="text-gray-600">
                {isMatchPreferenceCreated
                  ? "Your match preferences have been set!"
                  : "Define your preferences to find your perfect match."}
              </p>
            </div>
          </motion.div>
   
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      {isProfileCreated && isMatchPreferenceCreated ? (
        <>
        Dashboard
          <RequestsList requests={matchRequests} />
        </>
      
      ) : (
          <GetStartedSection isProfileCreated={isProfileCreated} isMatchPreferenceCreated={isMatchPreferenceCreated} />
      )}
    </div>
  );
}

