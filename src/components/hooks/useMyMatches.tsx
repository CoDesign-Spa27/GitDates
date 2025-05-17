import { getMyMatchesFetcher } from "@/fetchers/fetchers"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

export const useMyMatches = () =>{
    const {data:session,} = useSession()
    const email = session?.user?.email;
    const {data = [], isLoading} = useQuery({
        queryKey:['my-matches'],
        queryFn:getMyMatchesFetcher,
        enabled:!!email,
    })

    return {
        data,
        isLoading
    }
}