"use client";

import React from "react";
import { Github, Search, Code, Heart } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: <Github />,
    title: "Connect GitHub",
    description: "Link your GitHub account so we can analyze your repositories, coding style, and tech preferences.",
  },
  {
    icon: <Search />,
    title: "Set Preferences",
    description: "Tell us what you're looking for in a coding partner, from tech stack to collaboration style.",
  },
  {
    icon: <Code />,
    title: "Get Matched",
    description: "Our AI suggests compatible developers based on your coding style, technical interests, and values.",
  },
  {
    icon: <Heart />,
    title: "Start Coding Together",
    description: "Chat, share code, and pair program to see if there's a real connection.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative py-20 overflow-hidden bg-[#0C0A09]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        
      <motion.div
          className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-[100px]"
          animate={{
            x: [0, -60, 30, -50, 20, 0],
            y: [0, 30, -40, 20, -30, 0],
            scale: [1, 0.9, 1.1, 0.8, 1.2, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute  left-20 w-72 h-72 rounded-full bg-gradient-to-r from-[#FF88DC]/30 to-pink-500/20 blur-[90px]"
          animate={{
            x: [0, 50, -40, 30, -20, 0],
            y: [0, -30, 20, -40, 30, 0],
            scale: [1, 1.1, 0.8, 1.2, 3, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
           
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-riffic text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#7FBAFF] to-[#FF88DC]">
            How It Works
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Find your perfect coding partner in just four steps.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <div className="hidden lg:block absolute top-1/3 left-1/4 w-3/4 h-0.5 bg-gradient-to-r from-[#7FBAFF]/30 to-[#FF88DC]/60 -z-10"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
        
              <motion.div
                className="absolute -top-9 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-[#7FBAFF] to-[#FF88DC] border border-primary/30 flex items-center justify-center text-white font-bold text-lg shadow-xl"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, delay: index * 0.1 + 0.2 }}
              >
                {index + 1}
              </motion.div>

          
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="backdrop-blur-lg bg-gradient-to-br from-[#1E1E2E]/30 to-[#151515]/50 border border-white/10 rounded-xl p-6 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group"
              >
          
                <motion.div
                  className="mb-5 inline-flex p-3 rounded-lg bg-[#7FBAFF]/20 text-[#7FBAFF] group-hover:bg-gradient-to-br from-purple-400 via-blue-400 to-indigo-400 group-hover:text-white transition-colors duration-300"
                  initial={{ scale: 0.9 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                >
                  {React.cloneElement(step.icon, { size: 28, className: "stroke-2" })}
                </motion.div>
 
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-[#7FBAFF] transition-colors duration-300">
                  {step.title}
                </h3>
 
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
 
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-1/2 w-40 h-40 bg-[#7FBAFF]/20 blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-1/2 w-32 h-32 bg-[#FF88DC]/30 blur-2xl opacity-25 animate-pulse"></div>
      </div>
    </section>
  );
};

export default HowItWorks;
