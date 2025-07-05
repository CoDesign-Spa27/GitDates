'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '../lib/auth'
import prisma from '../lib/prisma'
import bcrypt from 'bcryptjs'
import { SuccessResponse } from '@/lib/success'
import { ErrorHandler } from '@/lib/error'

export interface SignUpData {
  email: string
  password: string
  name: string
}

export const signUpUser = async (data: SignUpData) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return new ErrorHandler('User with this email already exists', 'CONFLICT')
    }

    const hashedPassword = await bcrypt.hash(data.password, 12)

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    const response = new SuccessResponse('User created successfully', 201, user)
    return response.serialize()
  } catch (error) {
    console.error('Error creating user:', error)
    return new ErrorHandler('Failed to create user', 'DATABASE_ERROR')
  }
}

export const checkUserGitHubConnection = async () => {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new ErrorHandler('Not authenticated', 'UNAUTHORIZED')
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { accounts: true },
    })

    if (!user) {
      return new ErrorHandler('User not found', 'NOT_FOUND')
    }

    const hasGitHubAccount = user.accounts.some(
      (account) => account.provider === 'github'
    )
    const hasGitHubUsername = !!user.username

    const response = new SuccessResponse(
      'GitHub connection status checked',
      200,
      {
        hasGitHubAccount,
        hasGitHubUsername,
        needsGitHubConnection: !hasGitHubAccount && !hasGitHubUsername,
        isCredentialsUser: user.password !== null,
      }
    )
    return response.serialize()
  } catch (error) {
    console.error('Error checking GitHub connection:', error)
    return new ErrorHandler(
      'Failed to check GitHub connection',
      'DATABASE_ERROR'
    )
  }
}

export const linkGitHubAccount = async (githubAccountData: {
  access_token: string
  token_type: string
  scope: string
  provider_account_id: string
}) => {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new ErrorHandler('Not authenticated', 'UNAUTHORIZED')
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { accounts: true },
    })

    if (!user) {
      return new ErrorHandler('User not found', 'NOT_FOUND')
    }

    const existingGitHubAccount = user.accounts.find(
      (account) => account.provider === 'github'
    )
    if (existingGitHubAccount) {
      return new ErrorHandler('GitHub account already linked', 'CONFLICT')
    }

    await prisma.account.create({
      data: {
        userId: user.id,
        type: 'oauth',
        provider: 'github',
        providerAccountId: githubAccountData.provider_account_id,
        access_token: githubAccountData.access_token,
        token_type: githubAccountData.token_type,
        scope: githubAccountData.scope,
      },
    })

    const githubResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${githubAccountData.access_token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (!githubResponse.ok) {
      throw new Error('Failed to fetch GitHub user data')
    }

    const githubUser = await githubResponse.json()

    await prisma.user.update({
      where: { id: user.id },
      data: {
        username: githubUser.login,
        image: githubUser.avatar_url,
      },
    })

    const response = new SuccessResponse(
      'GitHub account linked successfully',
      200,
      {
        username: githubUser.login,
        name: githubUser.name,
        image: githubUser.avatar_url,
      }
    )
    return response.serialize()
  } catch (error) {
    console.error('Error linking GitHub account:', error)
    return new ErrorHandler('Failed to link GitHub account', 'DATABASE_ERROR')
  }
}
