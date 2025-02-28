"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { navigation } from "@/constants";
import { MenuIcon } from "lucide-react";
import { HamburgerMenu } from "../designs/navbar";
import { ModeToggle } from "../ui/mode-toggle";
import { Logo } from "../designs/logo";

type Props = {};

const Navbar = (props: Props) => {
  const [hash, setHash] = useState<string>("hero");
  const [openNavigation, setOpenNavigation] = useState<boolean>(false);

  useEffect(() => {
    const dynamicNavbarHighlight = () => {
      const sections = document.querySelectorAll("section[id]");

      sections.forEach((current) => {
        if (current === null) return;

        const sectionId = current.getAttribute("id");
        // @ts-ignore
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.getBoundingClientRect().top - sectionHeight * 0.2;

        if (sectionTop < 0 && sectionTop + sectionHeight > 0 && hash !== sectionId) {
          setHash(`#${sectionId as string}`);
        }
      });
    };

    window.addEventListener("scroll", dynamicNavbarHighlight);

    return () => window.removeEventListener("scroll", dynamicNavbarHighlight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleNavigation = () => setOpenNavigation(!openNavigation);
  const handleClick = () => {
    if (!openNavigation) return;

    setOpenNavigation(false);
  };



  return (
    <div
      className={cn(
        `fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm`,
        openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
      )}
    >
      <div className={cn(`flex items-center px-5 max-lg:py-4 lg:px-7.5 xl:px-10`)}>
        
        <div>
            <Logo />
        </div>

        <nav
          className={cn(
            `fixed inset-x-0 bottom-0 top-20 hidden bg-n-8 lg:static lg:mx-auto lg:flex lg:bg-transparent`,
            openNavigation ? "flex" : "hidden"
          )}
        >
          <div
            className={cn(
              "relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row"
            )}
          >
            {navigation.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                onClick={handleClick}
                className={cn(
                  `block relative font-mono text-2xl uppercase transition-colors hover:text-pink-500`,
                  "px-6 lg:text-sm lg:font-semibold",
                  item.onlyMobile && "lg:hidden",
                  item.url === hash ? "z-10 lg:text-pink-500" : "lg:text-black/50 dark:lg:text-white/50",
                  "lg:leading-5 dark:text-white text-black lg:hover:text-black dark:lg:hover:text-white xl:px-12"
                )}
              >
                {item.title}
              </Link>
            ))}
          </div>
    <HamburgerMenu />
        </nav>

        <div
          className="button mr-8 hidden text-n-1/50 transition-colors hover:text-n-1 lg:block"
        >
   
        </div>
        <Button className="hidden lg:flex" onClick={() => {
          window.location.href = "#login";
        }}>
        Let's Date
        </Button>

        <Button className="ml-auto lg:hidden" onClick={toggleNavigation}>
          <MenuIcon />
        </Button>
      </div>
    </div>
  );
};

export default Navbar;