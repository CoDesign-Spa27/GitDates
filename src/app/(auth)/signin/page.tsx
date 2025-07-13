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
    <div className="grid min-h-screen grid-cols-1 bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-900 md:grid-cols-3">
      <div className="col-span-1 flex items-center justify-center p-4 md:p-0">
        <Signin />
      </div>
      <div
        style={{
          backgroundImage:
            'url("https://gitdate-files.blr1.cdn.digitaloceanspaces.com/bg-images/sign-in-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'left',
        }}
        className="col-span-2 hidden items-center justify-center md:flex"></div>
    </div>
  )
}
