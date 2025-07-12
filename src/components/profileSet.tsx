import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from './ui/skeleton'
import { useGitDate } from './hooks/useGitdate'

export const ProfileSet = ({ isCollapsed }: { isCollapsed: string }) => {
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'
  const { gitdateProfile } = useGitDate()
  const profile = gitdateProfile.data
  const image = profile?.image
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
    return <div className="p-2 text-red-500">No session found</div>
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-md bg-neutral-200 py-1 dark:bg-neutral-800">
      <div className="overflow-hidden">
        <div className="flex items-center space-x-2">
          <Avatar className="h-10 w-10 shadow-md">
            <AvatarImage
              src={image || ''}
              alt={`${session?.user?.name}'s avatar`}
            />
            <AvatarFallback className="text-xl font-medium">
              {session?.user?.name
                ?.split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>

          {isCollapsed === 'expanded' && (
            <div className="flex min-w-0 flex-col">
              <p className="truncate text-sm font-medium">
                {session?.user?.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {session?.user?.email}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
