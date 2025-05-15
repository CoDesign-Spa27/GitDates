import { ExternalLink, Users } from "lucide-react"
import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type Connection = {
  id: string
  name: string
  avatar: string
  position: string
  status: "online" | "offline"
  lastActive?: string
}

const mockConnections: Connection[] = [
  // {
  //   id: "1",
  //   name: "Sarah Johnson",
  //   avatar: "/placeholder.svg?height=40&width=40",
  //   position: "UX Researcher",
  //   status: "online",
  // },
  // {
  //   id: "2",
  //   name: "Michael Brown",
  //   avatar: "/placeholder.svg?height=40&width=40",
  //   position: "Backend Developer",
  //   status: "offline",
  //   lastActive: "3h ago",
  // },
  // {
  //   id: "3",
  //   name: "Emily Davis",
  //   avatar: "/placeholder.svg?height=40&width=40",
  //   position: "Project Manager",
  //   status: "online",
  // },
]

export function ConnectionsCard() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Connections</CardTitle>
          <CardDescription>People you've connected with</CardDescription>
        </div>
        <Users className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockConnections.length > 0 ? ( mockConnections.map((connection) => (
            <div key={connection.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={connection.avatar || "/placeholder.svg"} alt={connection.name} />
                    <AvatarFallback>{connection.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background ${
                      connection.status === "online" ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">{connection.name}</p>
                  <p className="text-xs text-muted-foreground">{connection.position}</p>
                </div>
              </div>
              {connection.status === "online" ? (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                >
                  Online
                </Badge>
              ) : (
                <span className="text-xs text-muted-foreground">{connection.lastActive}</span>
              )}
            </div>
          ))):(
            <div className="text-center text-muted-foreground py-4">
            No connects yet
          </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" asChild className="w-full">
          <Link href="/connections">
            View all connections
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
