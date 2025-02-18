'use client'
import { getMatchPreference } from '@/actions/match.action'
import { getGithubProfile } from '@/actions/user.profile.action'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
 

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
  const {data:session} = useSession();
  const user = session?.user;
 

 

  useEffect(() => {
    const fetchProfile = async () => {
      if(!session?.user) return;
      try {
        const data = await getGithubProfile();
        const matchPreference = await getMatchPreference(session?.user?.email || '');
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

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Get Started</h1>
        
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border ${isProfileCreated ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isProfileCreated ? 'bg-green-500' : 'bg-yellow-500'}`}>
                <span className="text-white">{isProfileCreated ? '✓' : '1'}</span>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold">Create GitHub Profile</h2>
                <p className="text-gray-600">
                  {isProfileCreated 
                    ? 'Your GitHub profile has been created successfully!' 
                    : 'Connect your GitHub account to create your dating profile'}
                </p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${isMatchPreferenceCreated ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isMatchPreferenceCreated ? 'bg-green-500' : 'bg-yellow-500'}`}>
                <span className="text-white">{isMatchPreferenceCreated ? '✓' : '2'}</span>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold">Set Match Preferences</h2>
                <p className="text-gray-600">
                  {isMatchPreferenceCreated
                    ? 'Your match preferences have been set!' 
                    : 'Define your preferences to find your perfect match'}
                </p>
              </div>
            </div>
          </div>

          {isProfileCreated && isMatchPreferenceCreated && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white">✓</span>
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold">Ready to Match!</h2>
                  <p className="text-gray-600">You're all set to start finding your perfect match!</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

