import { ExternalLink, UserPlus } from 'lucide-react'
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useMatchRequest } from '@/components/hooks/useMatchRequests'
import { Key } from 'react'

 

export function NewRequestsCard({matchRequests}:{matchRequests:any}) {
 

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">New Requests</CardTitle>
          <CardDescription>People who want to connect with you</CardDescription>
        </div>
        <UserPlus className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {matchRequests && matchRequests.length > 0 ? (
            matchRequests.map((request: { sender: { gitDateProfile: any }; id: Key | null | undefined; createdAt: string | Date }) => {
              const profile = request.sender?.gitDateProfile
              if (!profile) return null

              return (
                <div key={request.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={profile.image || "/placeholder.svg"} alt={profile.name || 'User'} />
                      <AvatarFallback>{(profile.name || 'U').substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">{profile.name || 'Anonymous User'}</p>
                      <p className="text-xs text-muted-foreground">@{profile.githubUsername || 'user'}</p>
                    </div>
                  </div>
                  <div>
              
                  <span className="text-xs text-muted-foreground">{formatDate(request.createdAt)}</span>
                  </div>

                </div>
              )
            })
          ) : (
            <div className="text-center text-muted-foreground py-4">
              No new requests
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
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
