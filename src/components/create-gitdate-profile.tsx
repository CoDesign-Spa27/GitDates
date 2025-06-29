import { Github } from 'lucide-react'
import { Button } from './ui/button'
import { AsyncFunctionType } from '@/types/func'
import { Card } from './ui/card'
import Image from 'next/image'

export const CreateGitDateProfile = ({
  handleCreateProfile,
}: {
  handleCreateProfile: AsyncFunctionType
}) => {
  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-3xl p-8 text-center border-none">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-900 to-neutral-800 shadow-[3px_4px_3px_rgba(0,0,0,0.1)] drop-shadow-[5px_5px_3px_rgba(255,255,255,0.2)]">
          <Image
            src={`/assets/logo/gitdate-dark-logo.svg`}
            alt="gitdate-logo"
            width={100}
            height={100}
            className="h-10 w-10"
          />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
          Create Your Profile
        </h1>
        <p className="mb-6 text-slate-600 dark:text-slate-300">
          Get started by creating your GitHub profile in just one click.
        </p>
        <Button onClick={handleCreateProfile}>Create Profile</Button>
      </Card>
    </div>
  )
}
