import { NextRequest, NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'
import { getToken } from 'next-auth/jwt'
import prisma from '../../../lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const account = await prisma.account.findFirst({
      where: {
        userId: token.sub,
        provider: 'github',
      },
      select: {
        access_token: true,
      },
    })

    if (!account?.access_token) {
      return NextResponse.json(
        { error: 'No GitHub access token found' },
        { status: 401 }
      )
    }

    const octokit = new Octokit({
      auth: account.access_token,
    })

    const { data: userData } = await octokit.rest.users.getAuthenticated()

    const contributionsQuery = `query {
      user(login: "${userData.login}") {
        name
        contributionsCollection {
          contributionCalendar {
            colors
            totalContributions
            weeks {
              contributionDays {
                color
                contributionCount
                date
                weekday
              }
              firstDay
            }
          }
        }
      }
    }`

    const [repos, gists, followers, following, starredRepos, contributions] =
      await Promise.all([
        octokit.rest.repos.listForAuthenticatedUser(),
        octokit.rest.gists.list(),
        octokit.rest.users.listFollowersForAuthenticatedUser(),
        octokit.rest.users.listFollowedByAuthenticatedUser(),
        octokit.rest.activity.listReposStarredByAuthenticatedUser(),
        octokit.graphql<{
          user: {
            contributionsCollection: {
              contributionCalendar: { totalContributions: number }
            }
          }
        }>(contributionsQuery),
      ])

    const repoLanguages = await Promise.all(
      repos.data.slice(0, 5).map((repo) =>
        octokit.rest.repos.listLanguages({
          owner: userData.login,
          repo: repo.name,
        })
      )
    )

    const userProfile = {
      basicInfo: {
        login: userData.login,
        name: userData.name,
        bio: userData.bio,
        avatar_url: userData.avatar_url,
        city: '',
        state: '',
        country: '',
        company: userData.company,
        blog: userData.blog,
        twitter_username: userData.twitter_username,
        public_repos: userData.public_repos,
        public_gists: userData.public_gists,
        followers: userData.followers,
        following: userData.following,
        created_at: userData.created_at,
        totalContributions:
          contributions.user.contributionsCollection.contributionCalendar
            .totalContributions,
      },
      socialStats: {
        followersCount: followers.data.length,
        followingCount: following.data.length,
        followers: followers.data.map((f) => ({
          login: f.login,
          avatar_url: f.avatar_url,
        })),
        following: following.data.map((f) => ({
          login: f.login,
          avatar_url: f.avatar_url,
        })),
      },
      codingProfile: {
        topLanguages: repoLanguages
          .map((lang) => Object.keys(lang.data))
          .flat()
          .reduce((acc: Record<string, number>, curr) => {
            acc[curr] = (acc[curr] || 0) + 1
            return acc
          }, {}),
        starredReposCount: starredRepos.data.length,
      },
      activity: {
        topRepositories: repos.data
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 5)
          .map((repo) => ({
            name: repo.name,
            description: repo.description,
            stars: repo.stargazers_count,
            language: repo.language,
            fork: repo.fork,
          })),
        recentGists: gists.data.slice(0, 5).map((gist) => ({
          description: gist.description,
          url: gist.html_url,
          created_at: gist.created_at,
        })),
      },
    }

    return NextResponse.json(userProfile)
  } catch (error) {
    console.error('Error fetching GitHub data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data' },
      { status: 500 }
    )
  }
}
