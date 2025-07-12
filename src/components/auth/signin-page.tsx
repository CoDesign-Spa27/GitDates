'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'
import { GithubOauthButton } from './social-auth'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { useForm } from 'react-hook-form'
import { signUpUser, SignUpData } from '@/actions/auth.action'
import { toast } from '@/hooks/use-toast'
import { Loader2, Eye, EyeOff } from 'lucide-react'

interface SignInData {
  email: string
  password: string
}

const Signin = () => {
  const { data: session, status } = useSession()
  const [isMounted, setIsMounted] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showSignUpPassword, setShowSignUpPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const {
    register: registerSignIn,
    handleSubmit: handleSubmitSignIn,
    formState: { errors: signInErrors },
    reset: resetSignIn,
  } = useForm<SignInData>()

  const {
    register: registerSignUp,
    handleSubmit: handleSubmitSignUp,
    formState: { errors: signUpErrors },
    reset: resetSignUp,
    watch,
  } = useForm<SignUpData & { confirmPassword: string }>()

  const watchPassword = watch('password')

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
    setIsLoading(true)
    setError('')
    try {
      await signIn('github', { redirect: false, callbackUrl: '/dashboard' })
    } catch (error) {
      console.error(error)
      setError('An error occurred during GitHub sign-in')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignInWithCredentials = async (data: SignInData) => {
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else if (result?.ok) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Sign in error:', error)
      setError('An error occurred during sign-in')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (
    data: SignUpData & { confirmPassword: string }
  ) => {
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await signUpUser({
        email: data.email,
        password: data.password,
        name: data.name,
      })

      if (response.status) {
        toast({
          title: 'Account created successfully!',
          description: 'You can now sign in with your credentials.',
          variant: 'success',
        })
        resetSignUp()
        // Automatically sign in the user
        await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        })
        router.push('/dashboard')
      } else {
        setError(response.message || 'Failed to create account')
      }
    } catch (error) {
      console.error('Sign up error:', error)
      setError('An error occurred during sign-up')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="mx-5 flex items-center justify-center sm:min-h-screen">
      <Card className="w-full max-w-4xl rounded-lg border bg-neutral-800 px-8 py-8 shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-6">
          <h1 className="w-full text-center font-riffic text-xl text-white transition-opacity duration-300">
            Get started with GitDates
          </h1>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 transition-all duration-300">
              <TabsTrigger
                value="signin"
                className="px-0 py-2 transition-all duration-300  ">
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="px-0 py-2 transition-all duration-300 ">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="signin"
              className="space-y-6 pt-6 duration-300 animate-in fade-in-0 slide-in-from-bottom-2">
              <div className="flex justify-center">
                <GithubOauthButton
                  handleSignIn={(e) => handleSignInWithGithub(e)}
                  label="Github"
                />
              </div>

              <div className="flex w-full items-center">
                <div className="h-px flex-1 bg-neutral-600 transition-colors duration-300"></div>
                <span className="px-4 font-mono text-sm text-gray-400 transition-colors duration-300">
                  or
                </span>
                <div className="h-px flex-1 bg-neutral-600 transition-colors duration-300"></div>
              </div>

              <form
                onSubmit={handleSubmitSignIn(handleSignInWithCredentials)}
                className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    className="border-neutral-600 bg-neutral-800 text-white transition-all duration-300 hover:border-neutral-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    {...registerSignIn('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Please enter a valid email',
                      },
                    })}
                  />
                  {signInErrors.email && (
                    <p className="mt-1 text-sm text-red-400 duration-200 animate-in fade-in-0 slide-in-from-top-1">
                      {signInErrors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="border-neutral-600 bg-neutral-800 pr-10 text-white transition-all duration-300 hover:border-neutral-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      {...registerSignIn('password', {
                        required: 'Password is required',
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 transition-all duration-200 hover:scale-110 hover:text-gray-200">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {signInErrors.password && (
                    <p className="mt-1 text-sm text-red-400 duration-200 animate-in fade-in-0 slide-in-from-top-1">
                      {signInErrors.password.message}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="duration-300 animate-in fade-in-0 slide-in-from-top-2">
                    <p className="rounded-md border border-red-400/20 bg-red-400/10 px-3 py-2 text-center text-sm text-red-400 transition-all duration-300">
                      {error}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:scale-100"
                  disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent
              value="signup"
              className="space-y-6 pt-6 duration-300 animate-in fade-in-0 slide-in-from-bottom-2">
              <div className="flex justify-center">
                <GithubOauthButton
                  handleSignIn={(e) => handleSignInWithGithub(e)}
                  label="Github"
                />
              </div>

              <div className="flex w-full items-center">
                <div className="h-px flex-1 bg-neutral-600 transition-colors duration-300"></div>
                <span className="px-4 font-mono text-sm text-gray-400 transition-colors duration-300">
                  or create account
                </span>
                <div className="h-px flex-1 bg-neutral-600 transition-colors duration-300"></div>
              </div>

              <form
                onSubmit={handleSubmitSignUp(handleSignUp)}
                className="space-y-4">
                <div className="space-y-2">
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    className="border-neutral-600 bg-neutral-800 text-white transition-all duration-300 hover:border-neutral-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    {...registerSignUp('name', {
                      required: 'Name is required',
                    })}
                  />
                  {signUpErrors.name && (
                    <p className="mt-1 text-sm text-red-400 duration-200 animate-in fade-in-0 slide-in-from-top-1">
                      {signUpErrors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    className="border-neutral-600 bg-neutral-800 text-white transition-all duration-300 hover:border-neutral-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    {...registerSignUp('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Please enter a valid email',
                      },
                    })}
                  />
                  {signUpErrors.email && (
                    <p className="mt-1 text-sm text-red-400 duration-200 animate-in fade-in-0 slide-in-from-top-1">
                      {signUpErrors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showSignUpPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      className="border-neutral-600 bg-neutral-800 pr-10 text-white transition-all duration-300 hover:border-neutral-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      {...registerSignUp('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters',
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 transition-all duration-200 hover:scale-110 hover:text-gray-200">
                      {showSignUpPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                  {signUpErrors.password && (
                    <p className="mt-1 text-sm text-red-400 duration-200 animate-in fade-in-0 slide-in-from-top-1">
                      {signUpErrors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      className="border-neutral-600 bg-neutral-800 pr-10 text-white transition-all duration-300 hover:border-neutral-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      {...registerSignUp('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) =>
                          value === watchPassword || 'Passwords do not match',
                      })}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 transition-all duration-200 hover:scale-110 hover:text-gray-200">
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                  {signUpErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-400 duration-200 animate-in fade-in-0 slide-in-from-top-1">
                      {signUpErrors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="duration-300 animate-in fade-in-0 slide-in-from-top-2">
                    <p className="rounded-md border border-red-400/20 bg-red-400/10 px-3 py-2 text-center text-sm text-red-400 transition-all duration-300">
                      {error}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:scale-100"
                  disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  )
}

export default Signin
