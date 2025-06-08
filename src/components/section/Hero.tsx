"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useAnimation,
  useScroll,
  useTransform,
  AnimatePresence,
} from "motion/react";
import {
  Github,
  Heart,
  Code,
  Star,
  Command,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { undermark } from "../../../public/assets";
import { FeatureCard } from "../feature-card";
import { useRouter } from "next/navigation";

const Hero = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { scrollY } = useScroll();
  const containerRef = useRef(null);
  const controls = useAnimation();
  const navigate = useRouter();
 
  const y1 = useTransform(scrollY, [0, 500], [0, -100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    });
  }, [controls]);

  const codeSnippets = [
    "if (youCode && iCode) { return match(); }",
    "git commit -m 'Found my perfect match'",
    "function findLove() { return you.merge(me); }",
    "try { us(); } catch (feelings) { embrace(feelings); }",
    "while(true) { commit(love); push(affection); }",
    "for(let i = 0; i < infinity; i++) { loveCoding(with: you); }",
    "class Relationship extends Perfect { constructor(you, me) {...} }",
  ];

 
  const patternVariants: any = {
    animate: {
      backgroundPosition: ["0% 0%", "100% 100%"],
      transition: {
        duration: 20,
        ease: "linear",
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

 

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#0C0A09]  to-[#0C0A09]"
    >
      <motion.div
        
        className="absolute inset-0 opacity-10"
        variants={patternVariants}
        animate="animate"
        style={{
          background:
            "radial-gradient(circle at 25% 25%, rgba(255, 0, 128, 0.2) 2px, transparent 0), radial-gradient(circle at 75% 75%, rgba(90, 90, 255, 0.2) 2px, transparent 0)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-pink-500/30 to-purple-500/30 blur-[120px]"
          animate={{
            x: [0, 80, -20, 70, -10, 0],
            y: [0, -40, 30, -20, 40, 0],
            scale: [1, 1.2, 0.9, 1.1, 0.8, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-[120px]"
          animate={{
            x: [0, -40, 30, -20, 40, 0],
            y: [0, 30, -40, 20, -30, 0],
            scale: [1, 0.8, 1.2, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute bottom-10 -right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-pink-500/30 to-purple-500/30 blur-[120px]"
          animate={{
            x: [0, 80, -20, 70, -10, 0],
            y: [0, -40, 30, -20, 40, 0],
            scale: [1, 1.2, 0.9, 1.1, 0.8, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 -right-1/3 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-[120px]"
          animate={{
            x: [0, -40, 30, -20, 40, 0],
            y: [0, 30, -40, 20, -30, 0],
            scale: [1, 0.8, 1.2, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {codeSnippets.map((snippet, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 0.15,
              x: [0, 10, -5, 0],
              y: [0, 5, -10, 0],
            }}
            transition={{
              x: {
                duration: 7 + index * 0.5,
                repeat: Infinity,
                repeatType: "reverse",
              },
              y: {
                duration: 9 + index * 0.7,
                repeat: Infinity,
                repeatType: "reverse",
              },
              opacity: { duration: 1 },
            }}
            className="absolute text-green-400 font-mono text-xs md:text-sm lg:text-base"
            style={{
              left: `${5 + index * 14}%`,
              top: `${10 + ((index * 12) % 80)}%`,
              transform: `rotate(${index * 3 - 5}deg)`,
            }}
          >
            {snippet}
          </motion.div>
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, index) => (
          <motion.div
            key={`icon-${index}`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.08, 0.2, 0.08],
              x: [0, index % 2 === 0 ? 15 : -15, 0],
              y: [0, index % 2 === 0 ? 15 : -15, 0],
              rotate: [0, index % 2 === 0 ? 10 : -10, 0],
            }}
            transition={{
              opacity: { duration: 5, repeat: Infinity, repeatType: "reverse" },
              x: {
                duration: 7 + index * 0.3,
                repeat: Infinity,
                repeatType: "reverse",
              },
              y: {
                duration: 8 + index * 0.5,
                repeat: Infinity,
                repeatType: "reverse",
              },
              rotate: {
                duration: 10 + index * 0.2,
                repeat: Infinity,
                repeatType: "reverse",
              },
            }}
            className="absolute text-white/30"
            style={{
              left: `${Math.floor(Math.random() * 90)}%`,
              top: `${Math.floor(Math.random() * 90)}%`,
              fontSize: `${Math.floor(Math.random() * 24) + 14}px`,
            }}
          >
            {index % 6 === 0 ? (
              <Github />
            ) : index % 6 === 1 ? (
              <Heart className="text-pink-500/40" />
            ) : index % 6 === 2 ? (
              <Code />
            ) : index % 6 === 3 ? (
              <Star className="text-yellow-400/40" />
            ) : index % 6 === 4 ? (
              <Command />
            ) : (
              <MessageSquare />
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center"
        style={{ y: y1, opacity }}
      >
        <div className="mt-24 mb-8">
          <motion.div
            className="flex items-center justify-center mb-6"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <motion.div
              className="relative"
              animate={{
                rotate: [0, 360],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 blur-md opacity-70"></div>
              <Github className="relative text-white text-6xl" />
            </motion.div>
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="mx-4 z-10"
            >
              <Heart className="text-pink-500 text-5xl drop-shadow-lg" />
            </motion.div>
            <motion.div
              className="relative"
              animate={{
                rotate: [0, -360],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 blur-md opacity-70"></div>
              <Code className="relative text-white text-6xl" />
            </motion.div>
          </motion.div>

          <motion.h1
            className="font-riffic text-5xl md:text-7xl lg:text-8xl font-bold mb-8 text-white relative tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span className="text-transparent bg-clip-text bg-gitdate ">
              git
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-white">
              Connected
            </span>
            <div
              className="absolute w-full flex justify-center"
              style={{ top: "100%", left: "0" }}
            >
              <Image
                src={undermark}
                width={300}
                height={300}
                alt="undermark"
                className="w-[200px] md:w-[290px] sm:-mt-24 -mt-16"
              />
            </div>
          </motion.h1>

          <motion.p
            className="text-md md:text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Find your perfect{" "}
            <span className="text-pink-400">pair programmer</span> for life.
            <br className="hidden md:block" /> Where code meets chemistry.
          </motion.p>

          <motion.div
            className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6    justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <motion.button
              onClick={() => navigate.push('/dashboard')}
              className="group relative px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full font-semibold text-lg transition-all overflow-hidden shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ x: "-100%" }}
                animate={isHovered ? { x: 0 } : { x: "-100%" }}
                transition={{ duration: 0.4 }}
              />
              <motion.span
                className="relative flex items-center justify-center gap-3"
                animate={isHovered ? { x: [0, 5, 0] } : {}}
                transition={{ duration: 0.3, repeat: isHovered ? 1 : 0 }}
              >
                <Github className="w-6 h-6" /> 
                <span className="tracking-wide">Let's Date</span>
              </motion.span>
            </motion.button>
            {/* <motion.button
              className="px-6 py-4 bg-transparent border-2 border-white/30 backdrop-blur-sm text-white rounded-full font-semibold text-lg transition-all"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255,255,255,0.1)",
                borderColor: "rgba(255,255,255,0.5)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Matches
            </motion.button> */}
          </motion.div>

          <motion.div
            className="absolute bottom-10 left-0 right-0 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <motion.div
              className="text-white/60 cursor-pointer flex flex-col items-center"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              whileHover={{ color: "#ffffff" }}
            >
              <p className="text-sm mb-2">Scroll to discover</p>
              <ChevronDown />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
 

      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes glow {
          0% {
            box-shadow: 0 0 5px rgba(255, 0, 128, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(255, 0, 128, 0.8);
          }
          100% {
            box-shadow: 0 0 5px rgba(255, 0, 128, 0.5);
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
