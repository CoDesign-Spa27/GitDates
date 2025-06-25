import {
  createGitDateProfileMutation,
  updateGitDateProfileMutation,
} from '@/fetchers/mutations'
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { UserData } from '../../types/user'
import { toast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'
import { getGitDateProfileFetcher } from '@/fetchers/fetchers'

export const useGitDate = () => {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const email = session?.user?.email

  const createGitDateProfile = useMutation({
    mutationFn: (githubData: UserData) =>
      createGitDateProfileMutation(githubData),
    onMutate: async (newData: UserData) => {
      await queryClient.cancelQueries({
        queryKey: ['gitdate-profile-get', email],
      })

      const previousProfile = queryClient.getQueryData([
        'gitdate-profile-get',
        email,
      ])

      queryClient.setQueryData(['gitdate-profile-get', email], (old: any) => ({
        ...old,
        ...newData,
      }))

      return { previousProfile }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['gitdate-profile-get', email],
      })
    },
  })

  const updateGitDateProfile = useMutation({
    mutationFn: (data: UserData) => updateGitDateProfileMutation(data),
    onMutate: async (newData: UserData) => {
      await queryClient.cancelQueries({
        queryKey: ['gitdate-profile-get', email],
      })
      const prevData = queryClient.getQueryData(['gitdate-profile-get', email])
      queryClient.setQueryData(['gitdate-profile-get', email], (old: any) => ({
        ...old,
        ...newData,
      }))
      return {
        prevData,
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['gitdate-profile-get', email],
      })
    },
  })

  const gitdateProfile = useQuery({
    queryKey: ['gitdate-profile-get', email],
    queryFn: getGitDateProfileFetcher,
    enabled: !!email,
  })

  return {
    gitdateProfile,
    createGitDateProfile: {
      mutateAsync: createGitDateProfile.mutateAsync,
    },
    updateGitDateProfile: {
      mutateAsync: updateGitDateProfile.mutateAsync,
    },
  }
}
