import { findMatches, getAllAccounts } from "@/actions/match.action";
import { toast } from "@/hooks/use-toast";
 

export const findMatchesFetcher = async (email: string) => {
  const response = await findMatches(email);
  if (!response?.status) {
    toast({
        title: "Failed to load matches",
        variant: "destructive",
    })
  }
  if(response?.status)
  return response;
};

export const getAllAccountsFetcher = async () => { 
  const response = await getAllAccounts();
  if (!response?.status) {
    toast({
        title: "Failed to load accounts",
        variant: "destructive",
    })
  }
  if(response?.status)
  return response;
}