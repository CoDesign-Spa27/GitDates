'use client'
import { Share2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import Image from 'next/image'

export const ShareGitDate = () => {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'GitDate - Dating for Developers',
          text: 'Check out GitDate - A dating platform made specifically for developers!',
          url: 'https://gitdates.com',
        })
      } else {
        await navigator.clipboard.writeText('https://gitdates.com')
        toast({
          title: 'Link copied to clipboard!',
          description: 'Share GitDate with your developer friends',
        })
      }
    } catch (error) {
      console.error('Error sharing:', error)
      toast({
        title: 'Failed to share',
        description: 'Please try again',
        variant: 'destructive',
      })
    }
  }

  return (
    <button
      onClick={handleShare}
      className="group relative inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-neutral-200 px-4 py-1 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gitdate focus:ring-offset-2 dark:bg-white">
      <Share2 className="h-4 w-4 text-gitdate transition-colors duration-200 group-hover:text-gitdate" />
      <div className="flex items-center gap-2">
        <span className="relative">
          Share
          <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gitdate transition-all duration-300 group-hover:w-full"></span>
        </span>
        <Image
          src="/assets/logo/gitdate-light-logo.svg"
          alt="GitDate"
          width={16}
          height={16}
        />
      </div>
    </button>
  )
}
