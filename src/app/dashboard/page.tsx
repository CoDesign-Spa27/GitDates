'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart, GitFork, Star, Users } from 'lucide-react'

interface UserData {
  basicInfo: {
    login: string
    name: string
    bio: string
    avatar_url: string
    location: string | null
    blog: string
    public_repos: number
    followers: number
    following: number
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
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={userData.basicInfo.avatar_url} alt={userData.basicInfo.name} />
              <AvatarFallback>{userData.basicInfo.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="space-y-2 text-center md:text-left">
              <h1 className="text-2xl font-bold">{userData.basicInfo.name}</h1>
              <p className="text-muted-foreground">@{userData.basicInfo.login}</p>
              <p>{userData.basicInfo.bio}</p>
              {userData.basicInfo.location && <p className="text-sm">{userData.basicInfo.location}</p>}
              {userData.basicInfo.blog && (
                <a href={userData.basicInfo.blog} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                  {userData.basicInfo.blog}
                </a>
              )}
            </div>
            <div className="flex gap-4 ml-auto">
              <Button>Message</Button>
              <Button variant="outline">Follow</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Repositories</CardTitle>
            <GitFork className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData.basicInfo.public_repos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Followers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData.basicInfo.followers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Following</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData.basicInfo.following}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="repositories">Top Repositories</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
        </TabsList>
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {userData.activity.recentEvents.map((event, index) => (
                  <div key={index} className="mb-4 last:mb-0">
                    <p className="text-sm">
                      <span className="font-medium">{event.type}</span> on {event.repo.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(event.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="repositories" className="space-y-4">
          {userData.activity.topRepositories.map((repo, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{repo.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{repo.description}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <Badge variant="secondary">{repo.language}</Badge>
                  <span className="flex items-center text-sm">
                    <Star className="w-4 h-4 mr-1" />
                    {repo.stars}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="network" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Followers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {userData.socialStats.followers.map((follower, index) => (
                  <Avatar key={index} className="w-8 h-8">
                    <AvatarImage src={follower.avatar_url} alt={follower.login} />
                    <AvatarFallback>{follower.login[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Following</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {userData.socialStats.following.map((following, index) => (
                  <Avatar key={index} className="w-8 h-8">
                    <AvatarImage src={following.avatar_url} alt={following.login} />
                    <AvatarFallback>{following.login[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Coding Languages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(userData.codingProfile.topLanguages).map(([language, count]) => (
              <Badge key={language} variant="secondary">
                {language}: {count}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

