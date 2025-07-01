import NextAuth, { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from './prisma'
import GithubProvider from 'next-auth/providers/github'

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.NEXT_AUTH_GITHUB_ID ?? '',
      clientSecret: process.env.NEXT_AUTH_GITHUB_SECRET ?? '',
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          scope: 'read:user user:email',
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile, email }) {
      if (!profile || !user.email) {
        console.error('Missing profile or user email')
        return false
      }

      if (account?.provider === 'github') {
        try {
          const githubProfile = profile as {
            login: string
            name?: string
            avatar_url?: string
          }

          // Check if user exists with this email
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { accounts: true },
          })

          if (existingUser && existingUser.accounts.length === 0) {
            // If user exists but has no linked accounts, create the account link
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                token_type: account.token_type,
                scope: account.scope,
              },
            })
          }

          await prisma.user.upsert({
            where: { email: user.email },
            create: {
              email: user.email,
              name: githubProfile.name || user.name,
              image: githubProfile.avatar_url || user.image,
              username: githubProfile.login,
            },
            update: {
              name: githubProfile.name || user.name,
              image: githubProfile.avatar_url || user.image,
              username: githubProfile.login,
            },
          })
        } catch (error) {
          console.error('Error managing user profile:', error)
          return false
        }
      }
      return true
    },
  },

  pages: {
    signIn: '/signin',
  },
  secret: process.env.NEXTAUTH_SECRET ?? '',
}

export const auth = NextAuth(authOptions)
