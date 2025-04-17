 import { useSession } from "next-auth/react"
 import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"

type UserSession = {
    name:string,
    email:string,
    image:string,
}

export const ProfileSet = ({session}:{session:UserSession })=>{
 
 return (  <div className="flex flex-col items-center justify-center bg-neutral-800 rounded-md py-1">
        <div className="overflow-hidden">
            <div className="flex items-center space-x-2">
                <Avatar className="h-12 w-12 shadow-md">
                    <AvatarImage src={session?.image} alt={`${session?.name}'s avatar`} />
                    <AvatarFallback className="text-xl font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {session?.name?.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                </Avatar>
                
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{session?.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{session?.email}</p>
                </div>
        
            </div>
        </div>
    </div>
    )

}