'use client'

import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Edit3,
  Github,
  MapPin,
  Code2,
  ExternalLink,
  X,
  Check,
  Users,
  GitBranch,
  Star,
  Calendar,
  Globe,
  Loader2,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { updateUserAvatar } from '@/actions/user.profile.action'
import { Card } from '@/components/ui/card'
import { uploadImage } from '@/lib/upload-image'
import { useSession } from 'next-auth/react'
import { toast } from '@/hooks/use-toast'
import useSWRMutation from 'swr/mutation'
import { useGitDate } from '@/components/hooks/useGitdate'
import { UserData } from '../../../types/user'
import { Skeleton } from '@/components/ui/skeleton'
import { CreateGitDateProfile } from '@/components/create-gitdate-profile'
import { ConnectGitHub } from '@/components/connect-github'
import imageCompression from 'browser-image-compression'
import { checkUserGitHubConnection } from '@/actions/auth.action'
import { useRouter, useSearchParams } from 'next/navigation'

interface GitDateProfileType {
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

export interface EditProfileForm {
  name: string
  city: string
  state: string
  country: string
  bio: string
  blog: string
}

const GitDateProfile = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const session = useSession()
  const email = session.data?.user?.email
  const [uploading, setUploading] = useState(false)
  const [needsGitHubConnection, setNeedsGitHubConnection] = useState(false)
  const [checkingConnection, setCheckingConnection] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  const [gitDetails, setGitDetails] = useState<any | null>(null)

  // Check if user needs to connect GitHub account
  useEffect(() => {
    const checkGitHubConnection = async () => {
      if (!email) return

      try {
        setCheckingConnection(true)
        const response = await checkUserGitHubConnection()

        if (response.status) {
          setNeedsGitHubConnection(response.additional.needsGitHubConnection)

          // If user just connected GitHub (coming from OAuth), show success message
          if (
            searchParams.get('connected') === 'true' &&
            !response.additional.needsGitHubConnection
          ) {
            toast({
              title: 'GitHub connected successfully!',
              description:
                'Your GitHub account has been linked. Loading your profile...',
              variant: 'success',
            })
            // Clean up URL
            router.replace('/dashboard/gitdate-profile')
          }
        }
      } catch (error) {
        console.error('Error checking GitHub connection:', error)
      } finally {
        setCheckingConnection(false)
      }
    }

    checkGitHubConnection()
  }, [email, searchParams, router])

  useEffect(() => {
    const fetchUserData = async () => {
      // Skip fetching GitHub stats if user needs to connect GitHub first
      if (needsGitHubConnection) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const response = await fetch('/api/getUserStats')

        if (!response.ok) {
          throw new Error('Failed to fetch user stats')
        }

        const data = await response.json()
        setGitDetails(data)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load profile data. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (!checkingConnection) {
      fetchUserData()
    }
  }, [needsGitHubConnection, checkingConnection])

  // Use the GitDate hook
  const { gitdateProfile, createGitDateProfile, updateGitDateProfile } =
    useGitDate()

  const profile = gitdateProfile.data
  const { trigger: updateAvatar } = useSWRMutation(
    email ? ['updateAvatar', email] : null,
    (_key, { arg }: { arg: { email: string; image: string } }) =>
      updateUserAvatar(arg.email, arg.image)
  )

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EditProfileForm & UserData>({
    defaultValues: {
      city: '',
      state: '',
      country: '',
      bio: '',
      blog: '',
      name: '',
    },
  })

  const cropImageToSquare = async (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.src = URL.createObjectURL(file)

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const size = Math.min(img.width, img.height)
        canvas.width = size
        canvas.height = size

        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Could not get canvas context')

        // Calculate dimensions to crop from center
        const offsetX = (img.width - size) / 2
        const offsetY = (img.height - size) / 2

        ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size)

        canvas.toBlob((blob) => {
          if (!blob) throw new Error('Could not create blob')
          resolve(blob)
        }, file.type)
      }
    })
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return

      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file',
          variant: 'destructive',
        })
        return
      }

      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: 'Image too large',
          description: 'Maximum file size is 2MB',
          variant: 'destructive',
        })
        return
      }

      // Crop image to square before preview
      const croppedBlob = await cropImageToSquare(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(croppedBlob)

      setUploading(true)

      // Create a new File from the cropped blob
      const croppedFile = new File([croppedBlob], file.name, {
        type: file.type,
      })

      // Replace the original file with cropped one in the event
      const newEvent = {
        ...e,
        target: {
          ...e.target,
          files: [croppedFile],
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>

      const publicUrl = await uploadImage(newEvent)

      if (!publicUrl || !email) {
        throw new Error('Failed to upload image')
      }

      const result = await updateAvatar({ email, image: publicUrl })

      if (result?.success) {
        toast({
          title: 'Avatar updated successfully',
          description: 'Your profile picture has been updated',
          variant: 'success',
        })

        if (gitdateProfile.refetch) {
          await gitdateProfile.refetch()
        }

        setImagePreview(null)
      } else {
        throw new Error(result?.error || 'Failed to update avatar')
      }
    } catch (err) {
      console.error('Image upload error:', err)
      toast({
        title: 'Error uploading image',
        description: err instanceof Error ? err.message : 'Please try again',
        variant: 'destructive',
      })

      // Reset preview to original image on error
      setImagePreview(profile?.image || null)
    } finally {
      setUploading(false)
    }
  }

  useEffect(() => {
    if (profile) {
      setValue('city', profile.city || '')
      setValue('state', profile.state || '')
      setValue('country', profile.country || '')
      setValue('bio', profile.bio || '')
      setValue('blog', profile.blog || '')
      setValue('name', profile.name || '')
    }
  }, [profile, setValue])

  const handleCreateProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      await createGitDateProfile.mutateAsync(gitDetails)
    } catch (error) {
      console.error('Error creating profile:', error)
      setError('Failed to create profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGitHubConnectionSuccess = () => {
    setCheckingConnection(true)
    setNeedsGitHubConnection(false)

    router.push('/dashboard/gitdate-profile?connected=true')
  }

  const onSubmit = async (formData: EditProfileForm & UserData) => {
    console.log(formData, 'form data')
    try {
      setLoading(true)
      setError(null)
      await updateGitDateProfile.mutateAsync(formData)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      setError('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const cancelEditing = () => {
    setIsEditing(false)
    if (profile) {
      reset({
        city: profile.city || '',
        state: profile.state || '',
        country: profile.country || '',
        bio: profile.bio || '',
        blog: profile.blog || '',
        name: profile.name || '',
      })
    }
  }

  if (checkingConnection || loading || gitdateProfile.isLoading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <div className="animate-pulse space-y-8">
            <Skeleton className="rounded-3xl border border-neutral-200/60 p-8 shadow-sm dark:border-neutral-800">
              <div className="flex items-start gap-6">
                <Skeleton className="h-24 w-24 rounded-2xl bg-neutral-200 dark:bg-neutral-700"></Skeleton>
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-8 w-1/3 rounded-lg" />
                  <Skeleton className="h-4 w-1/4 rounded bg-neutral-200 dark:bg-neutral-700"></Skeleton>
                </div>
              </div>
            </Skeleton>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Skeleton className="h-96 rounded-3xl border border-neutral-200/60 p-6 shadow-sm dark:border-neutral-800"></Skeleton>
              <Skeleton className="border-slaneutralte-200/60 h-96 rounded-3xl border p-6 shadow-sm dark:border-neutral-800"></Skeleton>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show GitHub connection component for email/password users who haven't connected
  if (needsGitHubConnection) {
    return <ConnectGitHub onSuccess={handleGitHubConnectionSuccess} />
  }

  if (!profile && !gitdateProfile.isLoading) {
    return <CreateGitDateProfile handleCreateProfile={handleCreateProfile} />
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header Section */}
        <Card className="mb-8 p-8">
          <div className="flex justify-between gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={profile?.image || undefined}
                  alt={profile?.name || 'Profile'}
                />
                <AvatarFallback>
                  {profile?.name
                    ?.split(' ')
                    .map((n: any) => n[0])
                    .join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute -bottom-2 -right-2 cursor-pointer rounded-full bg-gitdate p-2 shadow-md transition-colors hover:bg-gitdate/80">
                {uploading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Edit3 className="h-5 w-5" />
                )}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
                disabled={uploading}
              />
              {imagePreview && !uploading && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="absolute left-0 top-0 h-full w-full rounded-full object-cover opacity-80"
                />
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold">
                {profile?.name || 'Anonymous'}
              </h1>
              <p className="text-lg">
                @{profile?.githubUsername || 'github-user'}
              </p>
              <div className="mt-2 flex gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {[profile?.city, profile?.state, profile?.country]
                      .filter(Boolean)
                      .join(', ') || 'No location set'}
                  </span>
                </div>
                {profile?.blog && (
                  <a
                    href={
                      profile.blog.startsWith('http')
                        ? profile.blog
                        : `https://${profile.blog}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 transition-colors hover:text-blue-600">
                    <Globe className="h-4 w-4" />
                    <span>Website</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              disabled={uploading}>
              {isEditing ? (
                <>
                  <X className="mr-1 h-4 w-4" /> Cancel
                </>
              ) : (
                <>
                  <Edit3 className="mr-1 h-4 w-4" /> Edit
                </>
              )}
            </Button>
          </div>

          {!isEditing && (
            <p className="mt-4">{profile?.bio || 'No bio yet.'}</p>
          )}
        </Card>

        {isEditing ? (
          /* Edit Form */
          <div className="space-y-6">
            <Card className="p-8 shadow-sm">
              <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-white">
                Edit Profile
              </h2>

              <div className="space-y-6">
                <div>
                  <Label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Name
                  </Label>
                  <Input {...register('name')} placeholder="Your full name" />
                </div>

                <div>
                  <Label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Bio
                  </Label>
                  <Input
                    {...register('bio', {
                      maxLength: {
                        value: 250,
                        message: 'Bio must be 250 characters or less',
                      },
                    })}
                    placeholder="Tell us about yourself..."
                  />
                  {errors.bio && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.bio.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <Label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      City
                    </Label>
                    <Input {...register('city')} placeholder="San Francisco" />
                  </div>
                  <div>
                    <Label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      State
                    </Label>
                    <Input {...register('state')} placeholder="California" />
                  </div>
                  <div>
                    <Label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Country
                    </Label>
                    <Input
                      {...register('country')}
                      placeholder="United States"
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Website
                  </Label>
                  <Input
                    {...register('blog', {
                      pattern: {
                        value:
                          /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                        message: 'Please enter a valid URL',
                      },
                    })}
                    placeholder="https://your-website.com"
                  />
                  {errors.blog && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.blog.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <Button type="button" onClick={cancelEditing}>
                  Cancel
                </Button>
                <Button onClick={() => handleSubmit(onSubmit)()}>
                  <Check className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="p-6 shadow-sm">
              <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                <Github className="h-5 w-5 text-gitdate" />
                GitHub Stats
              </h2>

              <div className="mb-6 grid grid-cols-2 gap-4">
                {[
                  {
                    label: 'Repositories',
                    value: profile?.repositories || 0,
                    icon: GitBranch,
                    color: 'text-green-600',
                  },
                  {
                    label: 'Followers',
                    value: profile?.followers || 0,
                    icon: Users,
                    color: 'text-blue-600',
                  },
                  {
                    label: 'Following',
                    value: profile?.following || 0,
                    icon: Users,
                    color: 'text-purple-600',
                  },
                  {
                    label: 'Contributions',
                    value: profile?.contributions || 0,
                    icon: Calendar,
                    color: 'text-orange-600',
                  },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div
                    key={label}
                    className="rounded-md bg-neutral-100 p-4 text-center transition-colors dark:bg-neutral-900">
                    <Icon className={`mx-auto mb-2 h-5 w-5 ${color}`} />
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {value?.toLocaleString()}
                    </p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Languages Card */}
            <Card className="p-6 shadow-sm">
              <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                <Code2 className="h-5 w-5 text-gitdate" />
                Top Languages
              </h2>

              <div className="space-y-3">
                {profile?.mainLanguages && profile.mainLanguages.length > 0 ? (
                  profile.mainLanguages.slice(0, 5).map((language, index) => (
                    <div key={language} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {language}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          #{index + 1}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                    No languages data available
                  </p>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default GitDateProfile
