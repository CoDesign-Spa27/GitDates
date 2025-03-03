"use client";

import React from "react";
import { Github, Search, Code, Heart, LucideProps } from "lucide-react";
import { motion } from "motion/react";

const steps = [
  {
    icon: <Github />,
    title: "Connect GitHub",
    description: "Link your GitHub account so we can analyze your repositories, coding style, and tech preferences."
  },
  {
    icon: <Search />,
    title: "Set Preferences",
    description: "Tell us what you're looking for in a coding partner and relationship, from tech stack to collaboration style."
  },
  {
    icon: <Code />,
    title: "Get Matched",
    description: "Our algorithm suggests compatible developers based on coding style, technical interests, and personal values."
  },
  {
    icon: <Heart />,
    title: "Start Coding Together",
    description: "Chat, share code, and meet up for pair programming sessions to see if there's a real connection."
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-riffic font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-[#748CFF] to-[#D4FFEA]">How It Works</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Find your perfect coding partner with our simple four-step process
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <div className="hidden lg:block absolute top-1/3 left-1/4 w-3/4 h-0.5 bg-gradient-to-r from-primary/30 to-primary/60 -z-10"></div>
          
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
                className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-gitdate border border-primary/30 flex items-center justify-center text-primary font-bold text-lg"
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, delay: index * 0.1 + 0.2 }}
              >
                {index + 1}
              </motion.div>
              
              <div className="backdrop-blur-sm bg-primary/10 border border-border/50 rounded-xl p-6 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
                <div className="mb-5 inline-flex p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  {React.cloneElement(step.icon, { size: 24, className: "stroke-2" })}
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

   
      </div>
    </section>
  );
};

export default HowItWorks;