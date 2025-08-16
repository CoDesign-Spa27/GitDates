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
    onMutate: async ({ matchId, action }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['match-request-recieved', email],
      })
      await queryClient.cancelQueries({ queryKey: ['my-matches'] })

      // Snapshot the previous values
      const previousMatchRequests = queryClient.getQueryData([
        'match-request-recieved',
        email,
      ])
      const previousMatches = queryClient.getQueryData(['my-matches'])

      // Optimistically update the match requests list
      if (previousMatchRequests && Array.isArray(previousMatchRequests)) {
        const updatedRequests = previousMatchRequests.filter(
          (request: any) => request.id !== matchId
        )
        queryClient.setQueryData(
          ['match-request-recieved', email],
          updatedRequests
        )
      }

      // If accepting, optimistically add to matches (we'll let the server response handle the proper data)
      if (action === 'ACCEPT') {
        // The server will provide the correct match data, so we just trigger a refetch
        // by invalidating the queries in onSettled
      }

      return { previousMatchRequests, previousMatches }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousMatchRequests) {
        queryClient.setQueryData(
          ['match-request-recieved', email],
          context.previousMatchRequests
        )
      }
      if (context?.previousMatches) {
        queryClient.setQueryData(['my-matches'], context.previousMatches)
      }
    },
    onSettled: () => {
      // Invalidate both match requests and matches queries to get fresh data
      queryClient.invalidateQueries({
        queryKey: ['match-request-recieved', email],
      })
      queryClient.invalidateQueries({ queryKey: ['my-matches'] })
    },
  })

  return {
    data,
    isLoading: isLoading || isFetching,
    mutateAsync: responsedToMatchRequest.mutateAsync,
  }
}
