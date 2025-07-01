'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'
import { GithubOauthButton } from './social-auth'

const Signin = () => {
  const { data: session, status } = useSession()
  const [isMounted, setIsMounted] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  const handleSignInWithGithub = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await signIn('github', { redirect: false, callbackUrl: '/dashboard' })
    } catch (error) {
      console.error(error)
      setError('An error occurred during Google sign-in')
    }
  }

  return (
    <div className="flex sm:min-h-screen items-center justify-center">
      <div className="h-40 w-full max-w-xs px-5 rounded-lg border bg-neutral-800 shadow-lg">
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <h1 className="w-full text-center font-riffic text-white">
            Get started with GitDates
          </h1>
          <div className="flex w-full items-center">
            <div className="h-px flex-1 bg-[#D1627B]"></div>
            <span className="px-4 font-mono text-sm text-gray-200">
              Sign in with
            </span>
            <div className="h-px flex-1 bg-[#D1627B]"></div>
          </div>

          <GithubOauthButton
            handleSignIn={(e) => handleSignInWithGithub(e)}
            label="Github"
          />
        </div>
      </div>
    </div>
  )
}

export default Signin
