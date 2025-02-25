"use client";

import { useState, useEffect } from "react";
import {motion,useAnimation }  from 'motion/react'
import { 
  MouseParallax, 
  ScrollParallax 
} from 'react-just-parallax';
import {  Github, Heart, Code } from 'lucide-react';

type Props = {};

const Hero = (props: Props) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    });
  }, [controls]);

  const codeSnippets = [
    "if (youCode && iCode) { return match(); }",
    "git commit -m 'Found my perfect match'",
    "function findLove() { return you.merge(me); }",
    "try { us(); } catch (feelings) { embrace(feelings); }",
    "while(true) { commit(love); push(affection); }"
  ];

  return (
    <div className="relative h-screen w-full pt-5 overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-neutral-800">
 
    <div className="absolute inset-0">
      {codeSnippets.map((snippet, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.2,
            x: [0, 10, 0],
            y: [0, 5, 0]
          }}
          transition={{
            x: { duration: 3 + index, repeat: Infinity, repeatType: "reverse" },
            y: { duration: 4 + index, repeat: Infinity, repeatType: "reverse" },
            opacity: { duration: 1 }
          }}
          className="absolute text-green-400 font-mono text-sm"
          style={{
            left: `${10 + (index * 20)}%`,
            top: `${15 + (index * 15)}%`,
            transform: `rotate(${index * 5 - 10}deg)`
          }}
        >
          {snippet}
        </motion.div>
      ))}
    </div>

 
    <div className="absolute inset-0">
      {[...Array(15)].map((_, index) => (
        <motion.div
          key={`icon-${index}`}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            x: [0, index % 2 === 0 ? 10 : -10, 0],
            y: [0, index % 2 === 0 ? 10 : -10, 0]
          }}
          transition={{ 
            opacity: { duration: 5, repeat: Infinity, repeatType: "reverse" },
            x: { duration: 5 + index, repeat: Infinity, repeatType: "reverse" },
            y: { duration: 4 + index, repeat: Infinity, repeatType: "reverse" }
          }}
          className="absolute text-white"
          style={{
            left: `${Math.floor(Math.random() * 90)}%`,
            top: `${Math.floor(Math.random() * 90)}%`,
            fontSize: `${Math.floor(Math.random() * 20) + 10}px`
          }}
        >
          {index % 3 === 0 ? <Github /> : index % 3 === 1 ? <Heart /> : <Code />}
        </motion.div>
      ))}
    </div>
 
    <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div 
          className="flex items-center justify-center mb-6"
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Github className="text-white text-6xl mr-4" />
          <Heart className="text-red-500 text-4xl" style={{ animation: 'pulse 2s infinite' }} />
          <Code className="text-white text-6xl ml-4" />
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-7xl font-bold mb-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <span className="text-pink-500">git</span>Connected
        </motion.h1>

        <motion.p 
          className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Find your perfect pair programmer for life. Where code meets chemistry.
        </motion.p>

        <motion.div 
          className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <motion.button 
            className="px-8 py-3 bg-pink-600 text-white rounded-full font-semibold text-lg transition-all"
            whileHover={{ scale: 1.05, backgroundColor: "#db2777" }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up with GitHub
          </motion.button>
          <motion.button 
            className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg transition-all"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            Browse Matches
          </motion.button>
        </motion.div>

        <motion.div
          className="mt-12 text-white opacity-60 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <p>Already connecting over 10,000 developers worldwide</p>
        </motion.div>
      </motion.div>
    </div>
 
    <style jsx>{`
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.15); }
        100% { transform: scale(1); }
      }
    `}</style>
  </div>
  );
};

export default Hero;