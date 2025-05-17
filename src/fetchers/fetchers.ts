import { profileSetupStatus } from "@/actions/dashboard.action";
import { getSelectedUserById } from "@/actions/explore.action";
import { findMatches, getAllAccounts, getMatchPreference, getMatchRequests } from "@/actions/match.action";
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
export const getSelectedUserByIdFetcher = async (userId: string) => {
  try {
    if (!userId) {
      toast({
        title: 'User ID is required',
        variant: 'destructive'
      });
      return;
    }

    const response = await getSelectedUserById(userId);
    if (!response?.status) {
      toast({
        title: 'Failed to load user profile',
        variant: 'destructive'
      });
      return;
    }
    return response;
  } catch (err) {
    console.error('Error fetching user profile:', err);
    toast({
      title: "Failed to load user profile",
      description: "Please try again later",
      variant: "destructive",
    });
    return null;
  }
}

export const getAllMatchRequestsFetcher = async () =>{
  try {
    const response = await getMatchRequests()
    if(!response){
      toast({
        title:'Failed to load match requests',
        variant:'destructive'
      })
    }
    if(response)
      return response.additional
  }
  catch(err){
    toast({
      title: "Failed to load match requests",
      description: "Please try again later",
      variant: "destructive",
    });
  }
}


export const getProfileSetupStatus = async () =>{
  try {
    const response = await profileSetupStatus();
    if (!response) {
      toast({
        title: "Failed to load profile setup status",
        variant: "destructive",
      })
    }
    if(response)
      return response;
  }catch(err){
    toast({
      title: "Failed to load user profile",
      description: "Please try again later",
      variant: "destructive",
    });
  }
}