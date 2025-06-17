import { getOrCreateConversation } from '@/actions/conversation.action'
import {
  createMatchPreference,
  MatchPreference,
  respondToMatchRequest,
} from '@/actions/match.action'
import {
  createGitDateProfile,
  updateGitDateProfile,
  updateUserAvatar,
} from '@/actions/user.profile.action'
import { UserData } from '../types/user'
import { toast } from '@/hooks/use-toast'
import { ErrorHandler } from '@/lib/error'

export const createMatchPreferenceMutation = async (
  matchData: MatchPreference
) => {
  try {
    const response = await createMatchPreference(matchData)
    if (!response?.status) {
      throw new Error('Failed to create match preference')
    }
    if (response?.status) return response
  } catch (error) {
    console.error('Error creating match preference:', error)
    throw error
  }
}

export const updateAvatarMutation = async (email: string, avatar: string) => {
  try {
    const response = await updateUserAvatar(email, avatar)
    if (!response?.success) {
      throw new Error('Failed to update avatar')
    }
    if (response?.success) return response
  } catch (error) {
    console.error('Error updating avatar:', error)
    throw error
  }
}

export const getOrCreateConversationMutation = async (matchId: string) => {
  try {
    const response = await getOrCreateConversation(matchId)
    if (!response) {
      throw new Error('Failed to update avatar')
    }
    if (response) return response
  } catch (err) {
    toast({
      title: 'Internal Server Error',
      variant: 'destructive',
    })
  }
}

export const createGitDateProfileMutation = async (githubData: UserData) => {
  try {
    const response = await createGitDateProfile(githubData)
    if (!response?.status) {
      throw new Error('Failed to create gitdate profile')
    }
    if (response?.status)
      toast({
        title: 'GitDate profile created successfully',
        variant: 'success',
      })
    return response
  } catch (error) {
    throw error
  }
}

export const updateGitDateProfileMutation = async (githubData: UserData) => {
  try {
    const response = await updateGitDateProfile(githubData)
    if (!response?.status) {
      throw new Error('Failed to update gitdate profile')
    }
    if (response?.status)
      toast({
        title: 'GitDate profile updated successfully',
        variant: 'success',
      })
    return response
  } catch (error) {
    throw error
  }
}

export const respondToMatchRequestMutation = async ({
  matchId,
  action,
}: respondToMatchRequestArgumentsType) => {
  try {
    const response = await respondToMatchRequest({matchId, action})
    if (!response?.status) {
      throw new ErrorHandler('Failed to respond', 'VALIDATION_ERROR')
    }
    if (response?.status)
      toast({
        title: 'GitDate profile updated successfully',
        variant: 'success',
      })
    return response
  } catch (error) {
    throw error
  }
}
