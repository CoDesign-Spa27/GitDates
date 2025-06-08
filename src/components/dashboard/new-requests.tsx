import { ExternalLink, UserPlus } from 'lucide-react'
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from '../ui/badge'
import { Skeleton } from "@/components/ui/skeleton"

interface GitDateProfile {
  id: string;
  userId: string;
  name: string;
  githubUsername: string;
  image: string;
  bio: string | null;
  blog: string;
  city: string;
  state: string;
  country: string;
  contributions: number;
  followers: number;
  following: number;
  repositories: number;
  mainLanguages: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface MatchRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
  sender: {
    gitDateProfile: GitDateProfile;
  };
}

const NewRequestsSkeleton = () => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-5 w-5" />
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}

export function NewRequestsCard({matchRequests,isLoading}:{matchRequests:any, isLoading:boolean}) {
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return <NewRequestsSkeleton />
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">New Requests</CardTitle>
          <CardDescription>People who want to connect with you</CardDescription>
        </div>
        <UserPlus className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          {matchRequests && matchRequests.length > 0 ? (
            matchRequests.map((request:MatchRequest) => {
              const profile = request.sender?.gitDateProfile
              if (!profile) return null

              return (
                <Link key={request.id} 
                href={`/dashboard/profile/${request.senderId}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src={profile.image || "/placeholder.svg"} alt={profile.name || 'User'} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {(profile.name || 'U').substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{profile.name || 'Anonymous User'}</p>
                      <p className="text-xs text-muted-foreground">@{profile.githubUsername || 'user'}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge className={request.status === 'PENDING' ? 'bg-yellow-800/30 text-yellow-500 hover:bg-yellow-800' : request.status === 'ACCEPTED' ? 'bg-green-800/30 text-green-500 hover:bg-green-800' : 'bg-red-800/30 text-red-500 hover:bg-red-800'}>
                      {request.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{formatDate(request.createdAt)}</span>
                  </div>
                </Link>
              )
            })
          ) : (
            <div className="text-center text-muted-foreground py-4">
              No new requests
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button variant="outline" asChild className="w-full">
          <Link href="/matches">
            View all requests
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
