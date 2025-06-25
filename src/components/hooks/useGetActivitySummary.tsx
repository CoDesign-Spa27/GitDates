import { getActivitySummaryFetchers, getMyMatchesFetcher } from "@/fetchers/fetchers"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

export const useGetActivitySummary = () =>{
    const {data:session,} = useSession()
    const email = session?.user?.email;
    const {data , isLoading, isFetching} = useQuery({
        queryKey:['my-activity'],
        queryFn:getActivitySummaryFetchers,
        enabled:!!email,
    })

    return {
        data,
        isLoading: isLoading || isFetching
    }
}