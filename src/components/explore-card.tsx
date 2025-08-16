import React, { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import {
  Users,
  GitFork,
  Star,
  MapPin,
  Link as LinkIcon,
  Heart,
  Check,
  Eye,
} from 'lucide-react'
import { Button } from './ui/button'
import { getMatchStatus, sendMatchRequest } from '@/actions/match.action'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

export interface GitDateProfileType {
  githubUsername: string
  repositories: number
  name: string
  followers: number
  following: number
  mainLanguages: string[]
  contributions: number
  bio: string
  city: string
  state: string
  country: string
  blog: string
  image: string
}

interface MatchStatusType {
  id?: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'NONE'
  isSender?: boolean
}
const ExploreCard = ({
  account,
  matchScore,
  userId,
}: {
  account: GitDateProfileType
  matchScore?: number
  userId: string
}) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [matchStatus, setMatchStatus] = useState<MatchStatusType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkMatchStatus = async () => {
      const status: any = await getMatchStatus(userId)
      setMatchStatus(status)
    }
    checkMatchStatus()
  }, [userId])

  const handleSendMatchRequest = async () => {
    try {
      setIsLoading(true)
      await sendMatchRequest(userId)
 
      setMatchStatus({
        status: 'PENDING',
        isSender: true,
      })

      toast({
        title: `Match request sent successfully!`,
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: `An error occurred while sending match request!`,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getMatchButton = () => {
    if (!matchStatus) {
      return (
        <Button disabled={isLoading} onClick={handleSendMatchRequest}>
          {isLoading ? 'Sending...' : 'Send Match Request'}
        </Button>
      )
    }

    switch (matchStatus.status) {
      case 'NONE':
        return (
          <Button disabled={isLoading} onClick={handleSendMatchRequest}>
            {isLoading ? 'Sending...' : 'Send Match Request'}
          </Button>
        )
      case 'PENDING':
        if (matchStatus.isSender) {
          return (
            <Button
              disabled
              variant="secondary"
              className="bg-amber-500/20 text-amber-500">
              <span className="mr-1">Request Sent</span>
              <Heart size={16} fill="currentColor" />
            </Button>
          )
        } else {
          // This will be handled in the Notifications/Requests section
          return (
            <Button
              disabled
              variant="secondary"
              className="bg-amber-500/20 text-amber-500">
              <span className="mr-1">Response Pending</span>
              <Heart size={16} />
            </Button>
          )
        }
      case 'ACCEPTED':
        return (
          <Button
            disabled
            variant="secondary"
            className="bg-green-500/20 text-green-500">
            <span className="mr-1">Matched</span>
            <Check size={16} />
          </Button>
        )
      case 'REJECTED':
        return <Button onClick={handleSendMatchRequest}>Try Again</Button>
      default:
        return (
          <Button disabled={isLoading} onClick={handleSendMatchRequest}>
            {isLoading ? 'Sending...' : 'Send Match Request'}
          </Button>
        )
    }
  }

  const handleProfileClick = (userId: string) => {
    router.push(`/dashboard/profile/${userId}`)
  }

  if (!account) return null

  return (
    <motion.div
      onClick={() => handleProfileClick(userId)}
      className="group relative h-auto w-full cursor-pointer rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-gitdate hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-gitdate">
      <div className="relative flex h-full flex-col p-5">
        {matchScore !== undefined && (
          <div className="absolute -right-3 -top-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gitdate to-purple-600 shadow-lg">
            <p className="text-sm font-bold text-white">{matchScore}%</p>
          </div>
        )}

        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-gitdate to-purple-600 p-0.5">
              {account.image ? (
                <img
                  src={account.image}
                  alt={account.name}
                  className="h-full w-full rounded-full border-2 border-white/10 object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-800">
                  <Users className="h-7 w-7 text-gray-400" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 rounded-full bg-gradient-to-r from-gitdate to-purple-500 px-2 py-0.5 text-[10px] text-white shadow-sm">
              {account.contributions}+
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-bold text-gray-900 dark:text-white">
              {account.name}
            </h2>
            <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
              {account.bio || 'No bio available'}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <StatItem value={account.followers} label="Followers" icon="👥" />
          <StatItem value={account.following} label="Following" icon="🔄" />
          <StatItem value={account.repositories} label="Repos" icon="📦" />
          <StatItem value={account.contributions} label="Contribs" icon="✨" />
        </div>

        <div className="flex flex-col items-start justify-between space-y-2 py-3 text-xs">
          {account.city || account.state || account.country ? (
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <MapPin className="h-4 w-4" />
              <span className="max-w-[120px] truncate">
                {[account.city, account.state, account.country]
                  .filter(Boolean)
                  .join(', ')}
              </span>
            </div>
          ) : null}
          <div className="flex flex-wrap justify-end gap-1">
            {account.mainLanguages.slice(0, 3).map((lang, i) => (
              <motion.span
                key={i}
                className="rounded-full bg-gitdate/10 px-2 py-1 text-xs font-medium text-gitdate dark:bg-gitdate/20 dark:text-gitdate/90"
                whileHover={{ scale: 1.05 }}>
                {lang}
              </motion.span>
            ))}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 dark:border-neutral-800">
          {account.blog && (
            <motion.div
              onClick={() => router.push(account?.blog)}
              className="flex items-center gap-1 text-sm text-purple-500 transition-colors hover:text-purple-600"
              whileHover={{ x: 2 }}>
              <LinkIcon className="h-4 w-4" />
            </motion.div>
          )}
          <div onClick={(e) => e.stopPropagation()}>{getMatchButton()}</div>
        </div>
      </div>
    </motion.div>
  )
}

const StatItem = ({
  value,
  label,
  icon,
}: {
  value: number
  label: string
  icon: string
}) => (
  <div className="flex flex-col items-center rounded-lg bg-gray-50 px-4 py-2 dark:bg-neutral-800/50">
    <div className="flex items-center gap-1">
      <span className="text-sm">{icon}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
    <span className="mt-0.5 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
      {label}
    </span>
  </div>
)

export default ExploreCard
