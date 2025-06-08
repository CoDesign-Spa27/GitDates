import { ExternalLink, Users } from "lucide-react"
import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type Match = {
  matchId: string
  userId: string
  profile: {
    name: string
    image: string
    bio: string | null
    githubUsername: string
    contributions: number
    repositories: number
    followers: number
    following: number
  }
  createdAt: Date
}

export function ConnectionsCard({matches, isLoading}:{matches:Match[], isLoading?: boolean}) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Connections</CardTitle>
          <CardDescription>People you've connected with</CardDescription>
        </div>
        <Users className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {matches && matches.length > 0 ? (
            matches.map((match) => (
              <div key={match.matchId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={match.profile.image || "/placeholder.svg"} alt={match.profile.name} />
                      <AvatarFallback>{match.profile.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">{match.profile.name}</p>
                    <p className="text-xs text-muted-foreground">@{match.profile.githubUsername}</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                  {match.profile.contributions} contributions
                </Badge>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-4">
              No connections yet
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button variant="outline" asChild className="w-full">
          <Link href="/dashboard/matches">
            View all connections
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
