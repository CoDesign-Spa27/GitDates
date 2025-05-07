import { createMatchPreference, MatchPreference } from "@/actions/match.action";
import { updateUserAvatar } from "@/actions/user.profile.action";

export const createMatchPreferenceMutation = async (matchData: MatchPreference) => {
try{

    const response = await createMatchPreference(matchData);
    if (!response?.status) {
        throw new Error("Failed to create match preference");
    }
    if (response?.status)
        return response;
}catch (error) {
    console.error("Error creating match preference:", error);
    throw error;
}
}

export const updateAvatarMutation = async (email :string ,avatar: string) => {
try{
    const response = await updateUserAvatar(email, avatar);
    if(!response?.success) {
        throw new Error("Failed to update avatar");
    }
    if (response?.success)
        return response;
}catch (error) {
    console.error("Error updating avatar:", error);
    throw error;
}
}