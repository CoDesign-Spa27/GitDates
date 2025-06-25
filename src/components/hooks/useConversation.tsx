import { getConversationsFetcher, getUnreadConversationsFetcher } from "@/fetchers/fetchers"
import { useQueries } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

export const useConversations = () => {
    const { data: session } = useSession()
    const email = session?.user?.email;

    const results = useQueries({
        queries: [
            {
                queryKey: ['conversations'],
                queryFn: getConversationsFetcher,
                enabled: !!email,
            },
            {
                queryKey: ['unread-counts'],
                queryFn: getUnreadConversationsFetcher,
                enabled: !!email,
            }
        ]
    })

    const [conversationsQuery, unreadCountsQuery] = results;

    return {
        conversations: conversationsQuery.data,
        unreadCounts: unreadCountsQuery.data,
        isLoading: conversationsQuery.isLoading || conversationsQuery.isFetching || 
                  unreadCountsQuery.isLoading || unreadCountsQuery.isFetching,
        error: conversationsQuery.error || unreadCountsQuery.error
    }
}