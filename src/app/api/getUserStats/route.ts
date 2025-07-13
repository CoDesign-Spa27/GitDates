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

    // Filter and validate repositories before fetching languages
    const validRepos = repos.data
      .filter((repo) => {
        // Filter out repos with problematic names or that are inaccessible
        const hasValidName = repo.name && repo.name.length > 0 && !repo.name.endsWith('-')
        const isAccessible = !repo.private || repo.permissions?.admin || repo.permissions?.push
        return hasValidName && isAccessible && !repo.fork // Optionally exclude forks
      })
      .slice(0, 5)

    // Fetch languages with individual error handling
    const repoLanguagesPromises = validRepos.map(async (repo) => {
      try {
        const languages = await octokit.rest.repos.listLanguages({
          owner: repo.owner.login, // Use repo.owner.login instead of userData.login
          repo: repo.name,
        })
        return { repo: repo.name, languages: languages.data }
      } catch (error) {
 
        return { repo: repo.name, languages: {} }
      }
    })

    const repoLanguages = await Promise.all(repoLanguagesPromises)

    // Process languages with weights based on bytes of code
    const languageStats: Record<string, number> = {}
    
    repoLanguages.forEach(({ languages }) => {
      Object.entries(languages).forEach(([lang, bytes]) => {
        languageStats[lang] = (languageStats[lang] || 0) + bytes
      })
    })

    // Sort languages by total bytes and get top languages
    const topLanguages = Object.entries(languageStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .reduce((acc, [lang, bytes]) => {
        acc[lang] = bytes
        return acc
      }, {} as Record<string, number>)

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

        
        topLanguages: topLanguages,
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
 
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data' },
      { status: 500 }
    )
  }
}