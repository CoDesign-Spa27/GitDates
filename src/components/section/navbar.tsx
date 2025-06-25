"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { navigation } from "@/constants";
import { MenuIcon, X } from "lucide-react";
import { Logo } from "../designs/logo";
import { motion, AnimatePresence } from "motion/react";

const Navbar = () => {
  const [hash, setHash] = useState("#home");
  const [openNavigation, setOpenNavigation] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const dynamicNavbarHighlight = () => {
      const sections = document.querySelectorAll("section[id]");

      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      sections.forEach((current) => {
        if (!current) return;

        const sectionId = current.getAttribute("id");
        const sectionHeight = (current as HTMLElement).offsetHeight;
        const sectionTop =
          current.getBoundingClientRect().top - sectionHeight * 0.2;

        if (
          sectionTop < 0 &&
          sectionTop + sectionHeight > 0 &&
          hash !== `#${sectionId}`
        ) {
          setHash(`#${sectionId as string}`);
        }
      });
    };

    window.addEventListener("scroll", dynamicNavbarHighlight);

    return () => window.removeEventListener("scroll", dynamicNavbarHighlight);
  }, [hash]);

  const toggleNavigation = () => setOpenNavigation(!openNavigation);

  const handleClick = () => {
    if (openNavigation) {
      setOpenNavigation(false);
    }
  };

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 font-riffic",
        scrolled
          ? "bg-[#0C0A09]/90 backdrop-blur-lg shadow-lg border-b border-border/20"
          : "bg-transparent"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex w-full items-center h-16 lg:h-20">
          {/* Logo Section - Left Side */}
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/#hero" className="flex items-center group">
              <div className="transition-transform duration-300 group-hover:scale-110">
                <Logo />
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation - Right Side */}
          <div className="flex-1 flex justify-end">
            <nav className="hidden md:block">
              <div className="flex items-center space-x-1">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      href={item.url}
                      className={cn(
                        "relative px-3 py-2 uppercase text-sm font-medium rounded-md transition-all duration-300 whitespace-nowrap",
                        hash === item.url
                          ? "text-neutral-200 font-semibold"
                          : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-100/5"
                      )}
                      onClick={handleClick}
                    >
                      {item.title}
                      {hash === item.url && (
                        <motion.div
                          className="absolute -bottom-1 left-0 h-0.5 w-full bg-primary rounded-full"
                          layoutId="navHighlight"
                          transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 30,
                          }}
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <motion.button
                onClick={toggleNavigation}
                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-300 relative z-[60]"
                aria-label={openNavigation ? "Close menu" : "Open menu"}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  {openNavigation ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X size={20} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MenuIcon size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {openNavigation && (
          <motion.div
            className="md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center min-h-screen p-4">
              <motion.div
                className="w-full max-w-sm bg-background/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl p-6"
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              >
                <nav className="flex flex-col space-y-1">
                  {navigation.map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                    >
                      <Link
                        href={item.url}
                        className={cn(
                          "block px-4 py-4 text-base uppercase font-medium rounded-xl transition-all duration-300 text-center",
                          hash === item.url
                            ? "bg-primary/15 text-primary font-bold shadow-sm border border-primary/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50 font-semibold"
                        )}
                        onClick={handleClick}
                      >
                        {item.title}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;