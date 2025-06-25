"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How does your matching algorithm work?",
    answer: "Our unique algorithm is the secret sauce behind GitDates. It analyzes your GitHub activity—commit patterns, language preferences, and coding style—to find developers whose passion and work ethic truly complement yours."
  },
  {
    question: "Is my code data secure?",
    answer: "Absolutely. Your privacy is paramount. We only analyze public repository metadata and require explicit permission for private repos. We never store your code, and all data is encrypted and handled in compliance with strict privacy standards."
  },
  {
    question: "Can I match with developers outside my location?",
    answer: "Yes! Code and chemistry know no borders. You can set your preferences to find matches in your city or across the globe, embracing the remote-first culture of modern development."
  },
  {
    question: "What if I'm not looking for romantic connections?",
    answer: "GitDates is for all kinds of connections! Whether you're seeking a 'pair programmer for life,' a coding buddy, a mentor, or a project collaborator, you can set your intent and we'll find your match."
  },
  {
    question: "How much does it cost?",
    answer: "Getting started on GitDates is free! Our basic tier lets you explore and make initial connections. For unlimited matches and advanced features, you can upgrade to our Pro plan."
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
    <section id="faq" className="bg-[#0C0A09] py-20">
      <div className="container relative mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          className="absolute left-10 right-20 h-44 w-44 rounded-full bg-gradient-to-r from-yellow-500/40 to-green-400/60 blur-[100px]"
          animate={{
            x: [0, 50, -20, 40, 0],
            y: [0, -30, 20, -20, 0],
            rotate: [0, 20, -50, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        <motion.div
          className="absolute bottom-10 right-10 h-52 w-52 rounded-full bg-gradient-to-r from-yellow-500/40 to-green-400/60 blur-[90px] md:right-20"
          animate={{
            x: [0, 10, -20, 10, 0],
            y: [0, -10, 20, -20, 0],
            rotate: [0, 20, -50, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}>
          <span className="font-medium text-neutral-300">
            Questions & Answers
          </span>
          <h2 className="mb-2 bg-gradient-to-r from-[#b4ff7f] to-[#ffdd88] bg-clip-text py-2 font-riffic text-4xl font-bold text-transparent md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Everything you need to know about finding your perfect coding
            partner
          </p>
        </motion.div>

        <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-[#b4ff7f]/50 bg-[#0C0A09] shadow-lg">
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
          transition={{ duration: 0.5, delay: 0.3 }}>
          <p className="mb-4 text-muted-foreground">Still have questions?</p>
          <motion.button
            onClick={() => window.open('mailto:codeesignspa@gmail.com','_blank')}
            className="rounded-full bg-neutral-700 px-6 py-2 font-medium text-[#b4ff7f] transition-all duration-300 hover:bg-[#b4ff7f] hover:text-black"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}>
            Contact Support
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
};

export default FAQSection;