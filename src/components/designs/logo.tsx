import Link from 'next/link'
import { gitdark, gitlight } from '../../../public/assets'
import Image from 'next/image'
import { cn } from '../../lib/utils'

export const Logo = () => {
  return (
    <div>
      <Link href="#hero" className={cn('flex w-auto items-center xl:mr-5')}>
        {/* Dark Mode Logo */}
        <div className="hidden items-center dark:flex">
          <Image
            src={gitdark}
            alt="GitDate Logo"
            width={150}
            height={150}
            className="object-contain"
          />
        </div>

        <div className="flex items-center dark:hidden">
          <Image
            src={gitlight}
            alt="GitDate Logo"
            width={150}
            height={150}
            className="object-contain"
          />
        </div>
      </Link>
    </div>
  )
}
