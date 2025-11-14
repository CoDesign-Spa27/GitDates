'use client'
import { useEffect } from 'react'
import Signin from '@/components/auth/signin-page'

export default function AuthPage() {
  useEffect(() => {
    document.documentElement.classList.add('dark')
    return () => {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  return (
    <div 
    // style={{backgroundImage: 'url("/signin-bg.jpg")', backgroundSize: 'cover', backgroundPosition: 'left'}}
    className="min-h-screen w-full max-w-2xl mx-auto">
        <Signin />
    </div>
  )
}
