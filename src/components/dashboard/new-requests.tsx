import { ExternalLink, UserPlus } from 'lucide-react'
import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type RequestUser = {
  id: string
  name: string
  avatar: string
  position: string
  time: string
}

const mockRequests: RequestUser[] = [
 
]

export function NewRequestsCard() {
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
          {mockRequests.length > 0 ? (
            mockRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={request.avatar || "/placeholder.svg"} alt={request.name} />
                    <AvatarFallback>{request.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{request.name}</p>
                    <p className="text-xs text-muted-foreground">{request.position}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{request.time}</span>
              </div>
            ))
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
