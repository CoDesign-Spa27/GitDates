"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How does your matching algorithm work?",
    answer: "Our algorithm analyzes GitHub repositories, commit patterns, language preferences, and coding style to identify compatibility between developers. We also consider communication style, work habits, and personal values from your profile to ensure well-rounded matches."
  },
  {
    question: "Is my code data secure?",
    answer: "Absolutely. We only analyze public repositories by default, and any private repository analysis requires explicit permission. We never store your actual code, only metadata and patterns. All data is encrypted and we comply with GDPR, CCPA, and other privacy regulations."
  },
  {
    question: "Can I match with developers outside my location?",
    answer: "Yes! You can set location preferences to match locally or globally. Remote collaboration is at the heart of modern development, and we support finding your perfect match regardless of geography."
  },
  {
    question: "What if I'm not looking for romantic connections?",
    answer: "gitConnected offers multiple relationship types: romantic partners, coding buddies, mentorship, and project collaborators. Just set your preferences and we'll match accordingly."
  },
  {
    question: "How much does it cost?",
    answer: "We offer a free basic tier with limited matches monthly. Our Pro tier at $14.99/month provides unlimited matches and advanced features. Enterprise plans are available for companies looking to foster team building."
  }
];

const FaqItem = ({ faq, index }:any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      className="border-b border-[#b4ff7f]/50 last:border-0"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-5 text-left focus:outline-none group"
      >
        <h3 className="text-lg font-medium text-neutral-400 group-hover:text-white transition-colors duration-300">
          {faq.question}
        </h3>
        <div className={`w-8 h-8 flex items-center justify-center rounded-full ${isOpen ? 'bg-[#b4ff7f] text-black' : 'bg-neutral-800 text-[#b4ff7f]'} transition-all duration-300`}>
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-neutral-400">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQSection = () => {
  return (
    <section id="faq" className="py-20 bg-[#0C0A09]">
    <div className="relative container mx-auto px-4 md:px-6 lg:px-8">
        
          <motion.div
            className="absolute right-20 left-10 w-44 h-44 rounded-full bg-gradient-to-r from-yellow-500/40 to-green-400/60 blur-[100px]"
            animate={{
              x: [0, 50, -20, 40, 0],
              y: [0, -30, 20, -20, 0],
              rotate: [0, 20, -50, 50, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
            />
      
            <motion.div
            className="absolute bottom-0 right-0 md:right-20 w-52 h-52 rounded-full bg-gradient-to-r from-yellow-500/40 to-green-400/60  blur-[90px] "
            animate={{
                x: [0, 10, -20, 10, 0],
                y: [0, -10, 20, -20, 0],
                rotate: [0, 20, -50, 50, 0],
              }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            />
             
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-neutral-300 font-medium">Questions & Answers</span>
        <h2 className="font-riffic text-4xl md:text-5xl font-bold py-2 mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#b4ff7f] to-[#ffdd88]">Frequently Asked Questions</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
        Everything you need to know about finding your perfect coding partner
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto  border bg-[#0C0A09] border-[#b4ff7f]/50 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-1 md:p-4">
        {faqs.map((faq, index) => (
          <FaqItem key={index} faq={faq} index={index} />
        ))}
        </div>
      </div>

      <motion.div 
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <p className="text-muted-foreground mb-4">Still have questions?</p>
        <motion.button 
        className="px-6 py-2 bg-neutral-700 text-[#b4ff7f] font-medium rounded-full hover:bg-[#b4ff7f] hover:text-black transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        >
        Contact Support
        </motion.button>
      </motion.div>
    </div>
    </section>
  );
};

export default FAQSection;