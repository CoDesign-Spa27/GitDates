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
    { icon: <Instagram size={20} />, href: "https://instagram.com", label: "Instagram" },
    { icon: <Linkedin size={20} />, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-background border-t border-border/20 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12 mb-12">
          {/* Logo and description */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Logo />
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Find your perfect coding partner. Connect with developers who share your passion, style, and vision through our intelligent matching platform.
            </p>
            
            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="font-medium text-foreground mb-3">Stay up to date</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-4 py-2 rounded-l-md border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-r-md hover:bg-primary/90 transition-colors">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Footer navigation */}
          {footerLinks.map((section, index) => (
            <div key={index} className="lg:col-span-1">
              <h4 className="font-medium text-foreground mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.href} 
                      className="text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Social links and copyright */}
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
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail size={16} className="mr-2" />
            <a href="mailto:hello@GitDates.dev" className="hover:text-primary transition-colors">
              hello@GitDates.dev
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;