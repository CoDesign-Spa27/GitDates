'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart, GitFork, Star, Users } from 'lucide-react'

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
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/getUserStats')
        const data = await response.json()
        setUserData(data)
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [])

  if (!userData) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
       
    </div>
  )
}

