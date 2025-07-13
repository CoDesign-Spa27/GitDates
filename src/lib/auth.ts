import NextAuth, { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from './prisma'
import GithubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

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
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile, email }) {
      // Handle credentials (email/password) login
      if (account?.provider === 'credentials') {
        return true
      }

      // Handle GitHub login
      if (!profile || !user.email) {
 
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

          if (existingUser) {
            // Check if this GitHub account is already linked
            const existingGitHubAccount = existingUser.accounts.find(
              (acc) =>
                acc.provider === 'github' &&
                acc.providerAccountId === account.providerAccountId
            )

            if (!existingGitHubAccount) {
              // Link the GitHub account to existing user
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

            // Update user with GitHub data
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                name: githubProfile.name || existingUser.name,
                image: githubProfile.avatar_url || existingUser.image,
                username: githubProfile.login,
              },
            })
          } else {
            // Create new user (GitHub signup)
            await prisma.user.create({
              data: {
                email: user.email,
                name: githubProfile.name || user.name,
                image: githubProfile.avatar_url || user.image,
                username: githubProfile.login,
              },
            })
          }
        } catch (error) {
 
          return false
        }
      }
      return true
    },

    async jwt({ token, user, account }) {
      // Persist user id and account info in token
      if (user) {
        token.id = user.id
      }
      if (account?.provider === 'github') {
        token.githubLinked = true
      }
      return token
    },

    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.id as string
        session.githubLinked = token.githubLinked as boolean
      }
      return session
    },
  },

  pages: {
    signIn: '/signin',
  },
  secret: process.env.NEXTAUTH_SECRET ?? '',
}

export const auth = NextAuth(authOptions)
