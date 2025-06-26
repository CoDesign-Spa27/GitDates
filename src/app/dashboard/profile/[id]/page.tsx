'use client'
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getSelectedUserByIdFetcher } from "@/fetchers/fetchers";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { recordProfileView } from "@/actions/activity.action";
import { 
  User, 
  Github, 
  MapPin, 
  Globe, 
  Calendar, 
  Book, 
  Users, 
  Code,
  ExternalLink,
  Moon,
  Sun,
  ArrowLeft,
  GitBranch,
  GitCommit
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Profile() {
 
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const { id: userId } = useParams();
  const email = session?.user?.email;
  const router = useRouter();

  // Record profile view when the profile is loaded
  useEffect(() => {
    if (userId && session?.user?.email) {
      recordProfileView(userId as string).catch(console.error);
    }
  }, [userId, session?.user?.email]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const { 
    data: userProfile,
    error: userProfileError,
    isLoading: isUserProfileLoading,
  } = useSWR(
    userId ? ["userProfile", userId] : null,
    () => getSelectedUserByIdFetcher(userId as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000,
    }
  );

  // Ensure theme works properly
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (userProfileError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h2 className="mb-4 text-2xl font-bold text-red-500">Error Loading Profile</h2>
        <p className="mb-6">We couldn't load this profile. Please try again later.</p>
        <button 
          className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  const userData = userProfile?.additional;
  
  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold">No profile data found</h2>
      </div>
    );
  }

  const {
    name,
    image,
    bio,
    githubUsername,
    blog,
    city,
    country,
    createdAt,
    followers,
    following,
    contributions,
    repositories,
    mainLanguages,
  } = userData;

  const location = [city, country].filter(Boolean).join(", ");
  const joinDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const contributionOverview = [
    {
      icon: Calendar,
      title: "Joined GitHub",
      description: joinDate,
      subtext: null
    },
    {
      icon: GitBranch,
      title: `Created ${repositories} Repositories`,
      description: `Working with ${mainLanguages?.length > 0 ? mainLanguages?.join(', ') : '0 Languages'}`,
      subtext: null
    },
    {
      icon: GitCommit,
      title: `Made ${contributions} Contributions`,
      description: "Active developer in the community",
      subtext: null
    }
  ]

  return (
    <div className='flex items-start justify-center gap-4 py-4'>
      <div>

      <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push("/dashboard/explore")}
            
            >
            <ArrowLeft className="h-5 w-5" />
          </Button>
            </div>
      <div className="container px-4 mx-auto max-w-6xl">
        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
          variants={containerVariants as any}
          initial="hidden"
          animate="visible"
        >
   
          <motion.div
            className="md:col-span-1 h-full"
            variants={itemVariants as any}
          >
            <div className="p-6 overflow-hidden bg-white rounded-2xl shadow-md dark:bg-neutral-900">
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="relative mb-4"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gitdate to-purple-500 blur-md opacity-70"></div>
                  <img
                    src={image || "/api/placeholder/150/150"}
                    alt={name || "User"}
                    className="relative z-10 object-cover w-32 h-32 border-4 border-white rounded-full dark:border-gray-700"
                  />
                </motion.div>
                
                <h1 className="mb-1 text-2xl font-bold">{name}</h1>
                
                {githubUsername && (
                  <div className="flex items-center mb-4 space-x-1 text-gray-500 dark:text-gray-400">
                    <Github size={16} />
                    <a 
                      href={`https://github.com/${githubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-500 transition-colors"
                    >
                      @{githubUsername}
                    </a>
                  </div>
                )}
                
                {bio && (
                  <p className="px-4 mb-6 text-center text-gray-600 dark:text-gray-300">
                    {bio}
                  </p>
                )}
                
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                
                <div className="w-full mt-4 space-y-3">
                  {blog && (
                    <div className="flex items-center space-x-3">
                      <Globe size={18} className="text-gray-500 dark:text-gray-400" />
                      <a 
                        href={blog.startsWith('http') ? blog : `https://${blog}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate hover:text-blue-500 transition-colors flex items-center"
                      >
                        {blog}
                        <ExternalLink size={14} className="ml-1" />
                      </a>
                    </div>
                  )}
                  
                  {location && (
                    <div className="flex items-center space-x-3">
                      <MapPin size={18} className="text-gray-500 dark:text-gray-400" />
                      <span>{location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <Calendar size={18} className="text-gray-500 dark:text-gray-400" />
                    <span>Joined {joinDate}</span>
                  </div>
                </div>
                
                <div className="flex justify-between w-full mt-6 text-sm">
                  <motion.div 
                    className="flex flex-col items-center p-2 rounded-lg  transition-colors"
             
                  >
                    <span className="font-semibold text-lg">{followers}</span>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <Users size={14} className="mr-1" />
                      <span>Followers</span>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex flex-col items-center p-2 rounded-lg   transition-colors"
                >
                    <span className="font-semibold text-lg">{following}</span>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <User size={14} className="mr-1" />
                      <span>Following</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
           
          <div className="md:col-span-2 space-y-6">
            <motion.div 
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2"
              variants={itemVariants as any}
            >
              <motion.div 
                className="p-6 bg-white rounded-2xl shadow-md dark:bg-neutral-900"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium">Repositories</h3>
                  <Book size={20} className="text-blue-500" />
                </div>
                <p className="text-3xl font-bold">{repositories}</p>
              </motion.div>
              
              <motion.div 
                className="p-6 bg-white rounded-2xl shadow-md dark:bg-neutral-900"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-medium">Contributions</h3>
                  <Code size={20} className="text-green-500" />
                </div>
                <p className="text-3xl font-bold">{contributions}</p>
              </motion.div>
            </motion.div>
            
 
            <motion.div
              className="p-6 bg-white rounded-2xl shadow-md dark:bg-neutral-900"
              variants={itemVariants as any}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Main Languages</h2>
                <Code size={20} className="text-blue-500" />
              </div>
              
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {mainLanguages?.length === 0 ? (
                  <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
                    No languages found
                  </div>
                ) : (
                  mainLanguages?.map((lang: any, index: any) => (
                    <motion.div
                      key={index}
                      className="px-4 py-3 text-center bg-gray-100 rounded-lg dark:bg-neutral-800"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { delay: 0.1 * index }
                      }}
                    >
                      <span className="font-medium">{lang}</span>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
            
 
            <motion.div
              className="p-6 bg-white rounded-2xl shadow-md dark:bg-neutral-900"
              variants={itemVariants as any}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Contributions Overview</h2>
                <Calendar size={20} className="text-blue-500" />
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {contributionOverview?.map((item: any, index: any) => (
                  <motion.div 
                    key={index}
                    className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gitdate rounded-lg">
                        <item.icon size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{item.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}