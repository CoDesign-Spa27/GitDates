//USER 
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