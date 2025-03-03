"use client"
import {motion, useScroll, useTransform} from 'motion/react'
import { FeatureCard } from '../feature-card';
import { Code, Github, Heart } from 'lucide-react';
export const Features = () => {
  const { scrollY } = useScroll();
  const y2 = useTransform(scrollY, [0, 500], [0, -50]);
  return (
    <section>
        <motion.div
        className=" z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-gradient-to-bl from-gray-950 via-gray-900 to-gray-800"
         
      >
        <motion.h2
          className="text-4xl md:text-5xl font-riffic font-bold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-[#C0F4B8] to-[#FFD4E5]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Where Developers Find Their Match
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
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
  );
}