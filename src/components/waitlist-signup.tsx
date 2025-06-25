'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Mail, Users, CheckCircle, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface WaitlistSignupProps {
  className?: string
}

interface WaitlistResponse {
  message: string
  id: string
}

interface WaitlistStats {
  total: number
}

export function WaitlistSignup({ className }: WaitlistSignupProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [totalSignups, setTotalSignups] = useState<number>(0)
  const { toast } = useToast()

  useEffect(() => {
    fetchTotalSignups()
    const savedEmail = localStorage.getItem('waitlist_email')
    if (savedEmail) {
      setIsSubmitted(true)
      setEmail(savedEmail)
    }
  }, [])

  const fetchTotalSignups = async () => {
    try {
      const response = await fetch('/api/waitlist')
      const data: WaitlistStats = await response.json()
      setTotalSignups(data.total)
    } catch (error) {
      console.error('Failed to fetch total signups:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist')
      }

      setIsSubmitted(true)
      localStorage.setItem('waitlist_email', email)
      setIsOpen(false)
      fetchTotalSignups()

      toast({
        title: 'Welcome to the waitlist!',
        description: data.message,
      })
    } catch (error) {
      toast({
        title: 'Oops! Something went wrong',
        description:
          error instanceof Error ? error.message : 'Please try again later.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setEmail('')
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${className}`}>
        <div className="group relative mx-auto w-full max-w-[250px] cursor-pointer">
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 opacity-30 blur transition duration-300 group-hover:opacity-50"></div>
          <div className="relative rounded-full border border-green-500/30 bg-green-950/30 px-4 py-2 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium text-green-300">
                You're on the waitlist!
              </span>
              <Badge
                variant="secondary"
                className="border-green-500/50 bg-green-500/20 text-green-300">
                {totalSignups}
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${className}`}>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <div className="group relative mx-auto w-full max-w-[300px] cursor-pointer">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-gitdate to-purple-500 opacity-30 blur transition duration-300 group-hover:opacity-50"></div>
            <div className="relative rounded-full border border-gitdate/30 bg-gray-900/50 px-5 py-3 backdrop-blur-sm transition-all duration-300 hover:border-gitdate/50">
              <div className="flex items-center justify-center gap-3">
                <Users className="h-5 w-5 text-gitdate" />
                <span className="text-base font-medium text-white">
                  {totalSignups > 0 ? `Joined by ${totalSignups} developers` : 'Be the first one to join!'}
                </span>
                <Plus className="h-5 w-5 text-gitdate/70 transition-colors group-hover:text-gitdate" />
              </div>
            </div>
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Join the Waitlist</DialogTitle>
            <DialogDescription className="text-gray-300">
              Be the first to find your perfect coding companion
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {totalSignups > 0 && (
              <div className="flex items-center justify-center gap-2 rounded-lg border border-gitdate/20 bg-gitdate/10 p-3">
                <Users className="h-4 w-4 text-gitdate" />
                <span className="text-sm font-medium text-gitdate">
                  {totalSignups} developers already joined
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dialog-email" className="text-white">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="dialog-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !email}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Joining waitlist...
                  </>
                ) : (
                  'Join Waitlist'
                )}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
