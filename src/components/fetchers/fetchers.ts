import { findMatches, getAllAccounts, getMatchPreference } from "@/actions/match.action";
import { toast } from "@/hooks/use-toast";
 

export const getMatchPreferencesFetcher = async (email: string) => {
  try{

    const response = await getMatchPreference(email);
    if (!response?.status) {
      toast({
        title: "Failed to load match preferences",
        variant: "destructive",
      })
    }
    if(response?.status)
      return response;
  }catch (error) { 
    toast({
      title: "Internal Server Error",
      variant: "destructive",
    })
  }
}

export const findMatchesFetcher = async (email: string) => {
  try{

    const response = await findMatches(email);
    if (!response?.status) {
      toast({
        title: "Failed to load matches",
        variant: "destructive",
      })
    }
    if(response?.status)
      return response;
  }catch (error) {
    toast({
      title: "Internal Server Error",
      variant: "destructive",
    })
  }
};

export const getAllAccountsFetcher = async () => { 
  try{

    const response = await getAllAccounts();
    if (!response?.status) {
      toast({
        title: "Failed to load accounts",
        variant: "destructive",
      })
    }
    if(response?.status)
      return response;
  }catch (error) {
    toast({
      title: "Internal Server Error",
      variant: "destructive",
    })
  }
}