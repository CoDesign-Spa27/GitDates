'use client'

import { useState, useEffect, useRef } from 'react'
import {
  motion,
  useAnimation,
  useScroll,
  useTransform,
  AnimatePresence,
} from 'motion/react'
import {
  Github,
  Heart,
  Code,
  Star,
  Command,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Settings,
  Clock,
} from 'lucide-react'
import Image from 'next/image'
import { undermark } from '../../../public/assets'
import { FeatureCard } from '../feature-card'
import { useRouter } from 'next/navigation'
import { AnimatedGradientText } from '../ui/animated-gradient-text'
import { cn } from '@/lib/utils'
import { CTAButton } from '../ui/cta-button'
import Link from 'next/link'
import heroIntro from '../../../public/hero-intro.svg'
import { WaitlistSignup } from '../waitlist-signup'
import { Badge } from '../ui/badge'

const Hero = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [showWaitlistMessage, setShowWaitlistMessage] = useState(false)
  const { scrollY } = useScroll()
  const containerRef = useRef(null)
  const controls = useAnimation()
  const router = useRouter()

  const y1 = useTransform(scrollY, [0, 500], [0, -100])
  const y2 = useTransform(scrollY, [0, 500], [0, -50])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    })

    // Check if user was redirected due to restricted access
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('waitlist') === 'true') {
      setShowWaitlistMessage(true)
      // Remove the parameter from URL
      window.history.replaceState({}, '', '/')
    }
  }, [controls])

  const codeSnippets = [
    'if (youCode && iCode) { return match(); }',
    "git commit -m 'Found my perfect match'",
    'function findLove() { return you.merge(me); }',
    'try { us(); } catch (feelings) { embrace(feelings); }',
    'while(true) { commit(love); push(affection); }',
    'for(let i = 0; i < infinity; i++) { loveCoding(with: you); }',
    'class Relationship extends Perfect { constructor(you, me) {...} }',
  ]

  const patternVariants: any = {
    animate: {
      backgroundPosition: ['0% 0%', '100% 100%'],
      transition: {
        duration: 20,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'reverse',
      },
    },
  }

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-[url('/rectangle.svg')] bg-cover bg-fixed bg-center bg-no-repeat md:bg-[url('/rectangle.svg')]">
      {/* Waitlist redirect message */}
      <AnimatePresence>
        {showWaitlistMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed left-4 right-4 top-4 z-50 mx-auto max-w-md">
            <div className="rounded-lg border border-orange-500/50 bg-orange-500/20 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-400" />
                <p className="text-sm text-orange-200">
                  GitDates is currently in private beta. Join our waitlist to
                  get early access!
                </p>
              </div>
              <button
                onClick={() => setShowWaitlistMessage(false)}
                className="absolute right-2 top-2 text-orange-300 hover:text-orange-100"
                aria-label="Close">
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0">
        {codeSnippets.map((snippet, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 0.15,
              x: [0, 10, -5, 0],
              y: [0, 5, -10, 0],
            }}
            transition={{
              x: {
                duration: 7 + index * 0.5,
                repeat: Infinity,
                repeatType: 'reverse',
              },
              y: {
                duration: 9 + index * 0.7,
                repeat: Infinity,
                repeatType: 'reverse',
              },
              opacity: { duration: 1 },
            }}
            className="absolute font-mono text-xs text-green-400 md:text-sm lg:text-base"
            style={{
              left: `${5 + index * 14}%`,
              top: `${10 + ((index * 12) % 80)}%`,
              transform: `rotate(${index * 3 - 5}deg)`,
            }}>
            {snippet}
          </motion.div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0">
        {[...Array(20)].map((_, index) => (
          <motion.div
            key={`icon-${index}`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.08, 0.2, 0.08],
              x: [0, index % 2 === 0 ? 15 : -15, 0],
              y: [0, index % 2 === 0 ? 15 : -15, 0],
              rotate: [0, index % 2 === 0 ? 10 : -10, 0],
            }}
            transition={{
              opacity: { duration: 5, repeat: Infinity, repeatType: 'reverse' },
              x: {
                duration: 7 + index * 0.3,
                repeat: Infinity,
                repeatType: 'reverse',
              },
              y: {
                duration: 8 + index * 0.5,
                repeat: Infinity,
                repeatType: 'reverse',
              },
              rotate: {
                duration: 10 + index * 0.2,
                repeat: Infinity,
                repeatType: 'reverse',
              },
            }}
            className="absolute text-white/30"
            style={{
              left: `${Math.floor(Math.random() * 90)}%`,
              top: `${Math.floor(Math.random() * 90)}%`,
              fontSize: `${Math.floor(Math.random() * 24) + 14}px`,
            }}>
            {index % 6 === 0 ? (
              <Github />
            ) : index % 6 === 1 ? (
              <Heart className="text-pink-500/40" />
            ) : index % 6 === 2 ? (
              <Code />
            ) : index % 6 === 3 ? (
              <Star className="text-yellow-400/40" />
            ) : index % 6 === 4 ? (
              <Command />
            ) : (
              <MessageSquare />
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="relative z-20 flex min-h-screen flex-col items-center justify-center px-4 text-center"
        style={{ y: y1, opacity }}>
        <div className="mb-8">
          <div className="group relative mx-auto flex w-full max-w-[300px] items-center justify-center rounded-full px-2 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
            <span
              className={cn(
                'animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-gitdate/50 via-[#9c40ff]/50 to-gitdate/50 bg-[length:300%_100%] p-[1px]'
              )}
              style={{
                WebkitMask:
                  'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'destination-out',
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'subtract',
                WebkitClipPath: 'padding-box',
              }}
            />
            <motion.div
              className="px-2"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
              }}>
              <Clock className="size-6 text-orange-400/80" />
            </motion.div>

            <AnimatedGradientText className="text-sm font-medium">
              Coming Soon
            </AnimatedGradientText>

            <Badge
              variant="secondary"
              className="ml-2 border-orange-500/50 bg-orange-500/20 text-orange-300 font-riffic">
             on 50 joiners
            </Badge>
          </div>
          <motion.h1
            className="relative mb-8 pt-5 font-riffic text-6xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}>
            <span className="bg-gitdate bg-clip-text text-transparent">
              git
            </span>
            <span className="bg-gradient-to-r from-purple-600 to-white bg-clip-text text-transparent">
              Connected
            </span>
            <div
              className="absolute flex w-full justify-center"
              style={{ top: '100%', left: '0' }}>
              <Image
                src={undermark}
                width={300}
                height={300}
                alt="undermark"
                className="-mt-16 w-[200px] sm:-mt-24 md:w-[290px]"
              />
            </div>
          </motion.h1>

          <motion.p
            className="text-md mx-auto mb-12 max-w-3xl font-light text-gray-300 md:text-xl lg:text-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}>
            Find your perfect{' '}
            <span className="text-pink-400">pair programmer</span> for life.
            <br className="hidden md:block" /> Where code meets chemistry.
          </motion.p>

          {/* Waitlist Signup Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}>
            <WaitlistSignup />
          </motion.div>

          <motion.div
            className="absolute bottom-10 left-0 right-0 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}>
            <motion.div
              className="flex cursor-pointer flex-col items-center text-white/60"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              whileHover={{ color: '#ffffff' }}>
              <p className="mb-2 text-sm">Scroll to discover</p>
              <ChevronDown />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes glow {
          0% {
            box-shadow: 0 0 5px rgba(255, 0, 128, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(255, 0, 128, 0.8);
          }
          100% {
            box-shadow: 0 0 5px rgba(255, 0, 128, 0.5);
          }
        }
      `}</style>
    </section>
  )
}

export default Hero
