import { getAllMatchRequestsFetcher } from '@/fetchers/fetchers'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useQueryClient } from '@tanstack/react-query'
import { respondToMatchRequestMutation } from '@/fetchers/mutations'
export const useMatchRequest = () => {
  const { data: session } = useSession()
  const email = session?.user?.email
  const queryClient = useQueryClient()
  const {
    data = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['match-request-recieved', email],
    queryFn: getAllMatchRequestsFetcher,
    enabled: !!email,
  })

  const responsedToMatchRequest = useMutation({
    mutationFn: ({ matchId, action }: respondToMatchRequestArgumentsType) =>
      respondToMatchRequestMutation({ matchId, action }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['match-request-recieved', email] })
 
      const previousMatchRequests = queryClient.getQueryData(['match-request-recieved', email])
  
      return { previousMatchRequests }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['match-request-recieved', email] })
    },
  })

  return {
    data,
    isLoading: isLoading || isFetching,
    mutateAsync: responsedToMatchRequest.mutateAsync,
  }
}
