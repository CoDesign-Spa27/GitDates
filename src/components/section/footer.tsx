"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "../designs/logo";
import { motion } from "motion/react";
import { 
  Github, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Heart, 
  ArrowRight, 
  Mail 
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Success Stories", href: "#stories" },
        { label: "How It Works", href: "#how-it-works" },
        { label: "FAQ", href: "#faq" },
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/careers" },
        { label: "Press", href: "/press" },
        { label: "Contact", href: "/contact" },
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Developer Docs", href: "/docs" },
        { label: "API", href: "/api" },
        { label: "Community", href: "/community" },
        { label: "Events", href: "/events" },
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "GDPR", href: "/gdpr" },
        { label: "Accessibility", href: "/accessibility" },
      ]
    }
  ];
  
  const socialLinks = [
    { icon: <Github size={20} />, href: "https://github.com", label: "GitHub" },
    { icon: <Twitter size={20} />, href: "https://twitter.com", label: "Twitter" },
    { icon: <Linkedin size={20} />, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-background border-t border-border/20 pb-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12 mb-12">
 
          <div className="flex lg:col-span-6 justify-center items-center flex-col">
            <Link href="/" className="inline-block mb-4">
              <Logo />
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Find your perfect coding partner. Connect with developers who share your passion, style, and vision through our intelligent matching platform.
            </p>
   
          </div>
 
        </div>
 
        <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex space-x-4">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-background border border-border hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
          
          <div className="text-muted-foreground text-sm flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <div className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart size={14} className="text-red-500 fill-red-500" />
              <span>for developers</span>
            </div>
            <div>© {currentYear} GitDates. All rights reserved.</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;