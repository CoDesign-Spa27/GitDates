'use client'
import Navbar from '@/components/section/navbar'
import { getServerSession } from 'next-auth'
import { cn } from '../lib/utils'
import Hero from '@/components/section/Hero'
import { Features } from '@/components/section/features'
import HowItWorks from '@/components/section/howitworks'
import FAQSection from '@/components/section/faq'
import Footer from '@/components/section/footer'
import Image from 'next/image'
import heroIntro from '../../public/hero-intro.svg'
import { motion, useScroll, useTransform } from 'motion/react'

export default function Home() {
  const { scrollY } = useScroll()
  const rotate = useTransform(scrollY, [0, 500], [0, 15])
  const scale = useTransform(scrollY, [0, 500], [1, 0.9])
  const translateZ = useTransform(scrollY, [0, 500], [0, -100])

  return (
    <div className="dark">
      <Navbar />
      <div className="relative">
        <Hero />
        <div className="relative z-10 -mt-80 hidden justify-center sm:flex">
          <motion.div
            style={{
              perspective: 1000,
              rotateX: rotate,
              scale: scale,
              translateZ: translateZ
            }}>
            <Image
              src={heroIntro}
              alt="hero-intro" 
              width={1200}
              height={600}
              className="hidden object-contain sm:block"
            />
          </motion.div>
        </div>
      </div>
      <div className="mt-0 sm:mt-10">
        <Features />
      </div>
      <HowItWorks />
      <FAQSection />
      <Footer />
    </div>
  )
}
