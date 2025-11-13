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
import { StaticRadialGradient  } from '@paper-design/shaders-react';
const Hero = () => {
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
  }, [controls])
 
  return (
    <section
      id="home"
      ref={containerRef}
      className="relative">
      <div className="pointer-events-none absolute inset-0">
    <StaticRadialGradient
  style={{width:'100%', height:'100%'}}
  colors={["#ff0073"]}
  colorBack="#000000"
  radius={1}
  focalDistance={3}
  focalAngle={60}
  falloff={0.5}
  mixing={0.40}
  distortion={1}
  distortionShift={1}
  distortionFreq={18}
  grainMixer={1}
  grainOverlay={0.45}
/>
      </div>

      <motion.div
        className="relative z-20 flex min-h-screen flex-col items-center justify-center px-4 text-center"
        style={{ y: y1, opacity }}>
        <div className="mb-8">
          
          <motion.h1
            className="relative mb-8 pt-5 font-riffic text-6xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}>
            <span className="bg-gradient-to-l from-teal-500 to-white bg-clip-text text-transparent">
             Git
            </span>
            <span className="bg-gradient-to-br from-amber-200 to-white bg-clip-text text-transparent">
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

          <CTAButton onClick={() => router.push('/signin')}>
            Let's Match
          </CTAButton>

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
