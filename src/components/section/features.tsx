'use client'
import { motion, useScroll, useTransform } from 'motion/react'
import { FeatureCard } from '../feature-card'
import { Code, Github, Heart } from 'lucide-react'
export const Features = () => {
  const { scrollY } = useScroll()

  return (
    <section id="features" className="relative">
      <motion.div className="relative z-10 flex min-h-[80vh] flex-col items-center justify-center bg-[#0C0A09] px-6 py-10">
        <motion.div
          className="right-30 absolute bottom-20 h-80 w-80 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-[100px]"
          animate={{
            x: [0, -10, 10, -10, 20, 0],
            y: [0, 30, -10, 20, -30, 0],
            scale: [1, 0.9, 1.1, 0.8, 1.2, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="absolute right-20 top-40 h-72 w-72 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-[90px]"
          animate={{
            x: [0, -10, 10, -10, 20, 0],
            y: [0, 30, -10, 20, -30, 0],
            scale: [1, 0.9, 1.1, 0.8, 1.2, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.h2
          className="mb-16 bg-gradient-to-r from-[#C0F4B8] to-[#FFD4E5] bg-clip-text text-center font-riffic text-4xl font-bold text-transparent md:text-5xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}>
          Where Developers Find Their Match
        </motion.h2>

        <div className="grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          <FeatureCard
            icon={<Code className="text-blue-400" size={32} />}
            title="Language Compatibility"
            description="Find someone who speaks your coding languages, from Python to JavaScript and beyond."
          />
          <FeatureCard
            icon={<Github className="text-purple-400" size={32} />}
            title="Repository Analysis"
            description="Our algorithm analyzes your GitHub to find developers with complementary skills and interests."
          />
          <FeatureCard
            icon={<Heart className="text-pink-400" size={32} />}
            title="Code Chemistry"
            description="Beyond technical skills, we match based on coding style, problem-solving approach, and values."
          />
        </div>
      </motion.div>
    </section>
  )
}
