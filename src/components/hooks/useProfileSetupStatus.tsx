import { getProfileSetupStatus } from '@/fetchers/fetchers'
import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'

export const useProfileSetupStatus = () => {
  const { data: session } = useSession()
  const email = session?.user?.email

  const { data, isLoading, isFetching, status } = useQuery({
    queryKey: ['profile-setup', email],
    queryFn: () => getProfileSetupStatus(),
    enabled: !!email,
  })

  const isStillLoading = isLoading || isFetching || status === 'pending'

  const setupDone = isStillLoading
    ? undefined
    : Boolean(data?.isProfileCreated && data?.isMatchPreferenceCreated)

  return {
    data,
    setupDone,
    isLoading: isStillLoading,
  }
}
