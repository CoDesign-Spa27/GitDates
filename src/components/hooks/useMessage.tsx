import { getOrCreateConversationMutation } from "@/fetchers/mutations"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "@/hooks/use-toast"

export const useMessage = (matchId: string) => {
    const queryClient = useQueryClient()

    const getOrCreateMessage = useMutation({
        mutationFn: () => getOrCreateConversationMutation(matchId),
        onSuccess: (data) => {
            if (data) {
                queryClient.invalidateQueries({ queryKey: ['conversations'] })
            }
        },
        onError: (error) => {
            toast({
                title: "Failed to create conversation",
                description: "Please try again later",
                variant: "destructive",
            })
        }
    })

    return {
        getOrCreateMessage: {
            mutate: getOrCreateMessage.mutate,
            isLoading: getOrCreateMessage.isPending,
            isError: getOrCreateMessage.isError,
            error: getOrCreateMessage.error,
            data: getOrCreateMessage.data
        }
    }
}