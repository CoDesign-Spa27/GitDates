'use client'
import { formatDistanceToNow } from "date-fns"
import { Check, X, MessageSquare, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { GitDateProfileType } from "@/actions/match.action"

 
interface RecievedRequests {
  id: string
  sender: {
    gitDateProfile: GitDateProfileType
  }
  at: string
  status?: "PENDING" | "ACCEPTED" | "REJECTED"
  mutualConnections?: number
}

export function RequestsList({ requests }: { requests: RecievedRequests[] }) {
  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card
          key={request.id}
          className="p-4 transition-all duration-200 hover:shadow-lg"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={request.sender.gitDateProfile.image}
                  alt={request.sender.gitDateProfile.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary/10"
                />
                {request.status === "PENDING" && (
                  <div className="absolute -top-1 -right-1">
                    <Badge variant='destructive' className="h-5 w-5 rounded-full p-0 flex items-center bg-gitdate justify-center">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                      </span>
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg leading-none">
                    {request.sender.gitDateProfile.name}
                  </h3>
                  {request.mutualConnections && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="text-xs cursor-help flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {request.mutualConnections} mutual
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{request.mutualConnections} mutual connections</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {request.sender.gitDateProfile.bio}
                </p>
                <p className="text-xs text-muted-foreground">
                  {/* Sent {formatDistanceToNow(new Date(request.at), { addSuffix: true })} */}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {request.status === "PENDING" ? (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="outline" className="gap-1">
                        <X className="h-4 w-4" />
                        Decline
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Decline connection request</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" className="gap-1">
                        <Check className="h-4 w-4" />
                        Accept
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Accept connection request</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="outline" className="gap-1">
                      <MessageSquare className="h-4 w-4" />
                      Message
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Send a message</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}