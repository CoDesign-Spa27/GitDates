 import { useSession } from "next-auth/react"
 import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import { Skeleton } from "./ui/skeleton"
 
export const ProfileSet = ()=>{
 
    const { data: session, status } = useSession()
    const isLoading = status === "loading"

    if (isLoading) {
        return <div className="flex items-center justify-evenly gap-3 rounded-md py-1">
        <Skeleton className="animate-pulse bg-gray-200 h-12 w-12 rounded-full">
        </Skeleton>
        <div className="flex flex-col items-center justify-center ">
        <Skeleton className="animate-pulse bg-gray-200 h-4 w-36 mt-2 rounded-md">
        </Skeleton>
        <Skeleton className="animate-pulse bg-gray-200 h-4 w-36 mt-2 rounded-md">
        </Skeleton>
        </div>
        </div>
    }

    if (!session) {
        return <div className="text-red-500">No session found</div>
    }

 return (  <div className="flex flex-col items-center justify-center bg-neutral-800 rounded-md py-1">
        <div className="overflow-hidden">
            <div className="flex items-center space-x-2">
                <Avatar className="h-12 w-12 shadow-md">
                    <AvatarImage src={session?.user?.image || ""} alt={`${session?.user?.name}'s avatar`} />
                    <AvatarFallback className="text-xl font-medium">
                        {session?.user?.name?.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                </Avatar>
                
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{session?.user?.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{session?.user?.email}</p>
                </div>
        
            </div>
        </div>
    </div>
    )
}