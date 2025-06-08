import { getAllMatchRequestsFetcher } from "@/fetchers/fetchers"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
export const useMatchRequest = ()=>{
    const { data: session } = useSession()
    const email = session?.user?.email
  
    const {data = [], isLoading, isFetching} = useQuery({
        queryKey:['match-request-recieved',email],
        queryFn: getAllMatchRequestsFetcher,
        enabled: !!email,
    })

    return {
        data,
        isLoading : isLoading || isFetching
    }
}