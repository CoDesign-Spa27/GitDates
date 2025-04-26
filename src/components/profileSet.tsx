import { useSession } from "next-auth/react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Skeleton } from "./ui/skeleton"

export const ProfileSet = ({ isCollapsed }: { isCollapsed: string }) => {
  const { data: session, status } = useSession()
  const isLoading = status === "loading"

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    )
  }

  if (!session) {
    return <div className="text-red-500 p-2">No session found</div>
  }

 return (  <div className="flex flex-col items-center justify-center bg-neutral-800 rounded-md py-1">
        <div className="overflow-hidden">
            <div className="flex items-center space-x-2">
                <Avatar className="h-10 w-10 shadow-md">
                    <AvatarImage src={session?.user?.image || ""} alt={`${session?.user?.name}'s avatar`} />
                    <AvatarFallback className="text-xl font-medium">
                        {session?.user?.name?.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                </Avatar>
                 
                 {isCollapsed === 'expanded' &&
                      <div className="flex flex-col min-w-0">
                      <p className="text-sm font-medium truncate">
                        {session?.user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {session?.user?.email}
                      </p>
                    </div>
                }
        
            </div>
        </div>
    </div>
    )
}