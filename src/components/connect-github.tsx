'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Github, Loader2, ExternalLink } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { toast } from '@/hooks/use-toast'
import Image from 'next/image'

interface GitHubConnectionProps {
  onSuccess: () => void
}

export const ConnectGitHub = ({ onSuccess }: GitHubConnectionProps) => {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnectGitHub = async () => {
    setIsConnecting(true)

    try {
      // Use NextAuth to connect GitHub account
      const result = await signIn('github', {
        redirect: false,
        callbackUrl: '/dashboard/gitdate-profile',
      })

      if (result?.ok) {
        toast({
          title: 'GitHub account connected!',
          description: 'Your GitHub account has been successfully linked.',
          variant: 'success',
        })
        onSuccess()
      } else if (result?.error) {
        toast({
          title: 'Connection failed',
          description: 'Failed to connect GitHub account. Please try again.',
          variant: 'destructive',
        })
      }
    } catch (error) {
 
      toast({
        title: 'Error',
        description: 'Failed to connect GitHub account. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="relative w-full max-w-md rounded-3xl border-none p-8">
        <div className="absolute left-1/2 top-0 h-1 w-96 -translate-x-1/2 transform bg-gradient-to-r from-transparent via-gitdate to-transparent opacity-50"></div>
        <div className="space-y-6 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-900 to-neutral-800 shadow-[3px_4px_3px_rgba(0,0,0,0.1)] drop-shadow-[5px_5px_3px_rgba(255,255,255,0.2)]">
            <Image
              src={`/assets/logo/gitdate-dark-logo.svg`}
              alt="gitdate-logo"
              width={100}
              height={100}
              className="h-10 w-10"
            />
          </div>

          <div>
            <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
              Connect Your GitHub
            </h1>
            <p className="mb-4 text-slate-600 dark:text-slate-300">
              Link your GitHub account to unlock all GitDate features and get
              accurate coding statistics.
            </p>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-left dark:border-blue-800 dark:bg-blue-900/20">
            <h3 className="mb-2 font-semibold text-blue-800 dark:text-blue-200">
              Why connect GitHub?
            </h3>
            <ul className="space-y-1 text-sm text-blue-600 dark:text-blue-300">
              <li>• Get real contribution statistics</li>
              <li>• Show your top programming languages</li>
              <li>• Display your repository highlights</li>
              <li>• Enable all matching features</li>
            </ul>
          </div>

          <Button
            onClick={handleConnectGitHub}
            disabled={isConnecting}
            size="lg">
            {isConnecting ? <>Connecting...</> : <>Connect with GitHub</>}
          </Button>

          <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This will redirect you to GitHub to authorize GitDate. We only
              request access to your public profile information.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
