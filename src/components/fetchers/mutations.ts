import { createMatchPreference, MatchPreference } from "@/actions/match.action";

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
