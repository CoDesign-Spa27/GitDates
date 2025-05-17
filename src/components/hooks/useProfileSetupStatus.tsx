import { useQuery } from "@tanstack/react-query"
import { getProfileSetupStatus } from "@/fetchers/fetchers"
import { useSession } from "next-auth/react"

export const useProfileSetupStatus = () => {
  const { data: session } = useSession()
  const email = session?.user?.email

  const {data, isLoading } = useQuery({
    queryKey: ['profile-setup', email],
    queryFn: () => getProfileSetupStatus(),
    enabled: !!email,
 
  })

  return {
        data,
        isLoading
  }
}