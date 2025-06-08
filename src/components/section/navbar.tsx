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
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-[#0C0A09]/90 backdrop-blur-lg shadow-lg border-b border-border/20"
          : "bg-transparent"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
    >
      <div className="mx-auto px-2 lg:px-8 ">
        <div className="flex items-center justify-between h-16 md:h-20">
          <motion.div
            className="flex items-center"
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

          <nav className="hidden md:flex items-center space-x-1">
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
                    "relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-300",
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
          </nav>

          <div className="flex items-center space-x-1">
            <div className="flex md:hidden">
              <motion.button
                onClick={toggleNavigation}
                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-300 z-[60]"
                aria-label={openNavigation ? "Close menu" : "Open menu"}
                whileTap={{ scale: 0.9 }}
              >
                {openNavigation ? <X size={20} /> : <MenuIcon size={20} />}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {openNavigation && (
          <motion.div
            className="md:hidden h-screen w-screen fixed top-0 left-0 bg-background/90 z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mx-4 mt-2 px-4 py-6 shadow-xl rounded-xl border border-border/50">
              <nav className="flex flex-col space-y-2">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.url}
                      className={cn(
                        "block px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-300",
                        hash === item.url
                          ? "bg-primary/10 text-primary font-bold"
                          : "text-muted-foreground  hover:text-gitdate font-bold"
                      )}
                      onClick={handleClick}
                    >
                      {item.title}
                    </Link>
                  </motion.div>
                ))}
                
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
