import { useQuery } from "@tanstack/react-query"
import { getProfileSetupStatus } from "@/fetchers/fetchers"
import { useSession } from "next-auth/react"

export const useProfileSetupStatus = () => {
  const { data: session } = useSession()
  const email = session?.user?.email

  const {data, isLoading, isFetching } = useQuery({
    queryKey: ['profile-setup', email],
    queryFn: () => getProfileSetupStatus(),
    enabled: !!email,
 
  })

  const setupDone = Boolean(data?.isProfileCreated && data?.isMatchPreferenceCreated)

  return {
        data,
        isLoading: isLoading || isFetching,
        setupDone
  }
}