import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Users, GitFork, Star, MapPin, Link as LinkIcon } from "lucide-react";
import { Button } from "./ui/button";

interface GitDateProfileType {
  githubUsername: string;
  repositories: number;
  name: string;
  followers: number;
  following: number;
  mainLanguages: string[];
  contributions: number;
  bio: string;
  city: string;
  state: string;
  country: string;
  blog: string;
  image: string;
}
const ExploreCard = ({
  account,
  matchScore,
}: {
  account: GitDateProfileType;
  matchScore?: number;
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  if (!account) return null;
 
  
  return (
    <motion.div
      className="w-[350px] h-[280px] relative group bg-neutral-100 dark:bg-transparent  rounded-xl"
      style={{ perspective: 1000, rotateX, rotateY }}
      whileHover={{ scale: 1 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="absolute inset-0 rounded-2xl blur-[2px] transition-all" />

      <div className="relative bg-white/5 rounded-xl p-4 h-full">
    
        {matchScore !== undefined && (
          <div className="flex justify-between items-center  ">
                <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gitdate flex items-center justify-center">
            <p className="text-white font-bold text-sm">
              {matchScore}%
            </p>
          </div>
           
          </div>
        )}

        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-gitdate to-purple-600 p-0.5">
              {account.image ? (
                <img
                  src={account.image}
                  alt={account.name}
                  className="w-full h-full rounded-full object-cover border-2 border-white/10"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-gitdate to-purple-500 text-[10px] px-2 py-0.5 rounded-full text-white">
              {account.contributions}+
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold truncate text-gray-900 dark:text-white">
              {account.name}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate-2-lines h-[2.5em]">
              {account.bio || "No bio available"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mt-4">
          <StatItem value={account.followers} label="Followers" icon="👥" />
          <StatItem value={account.following} label="Following" icon="🔄" />
          <StatItem value={account.repositories} label="Repos" icon="📦" />
          <StatItem value={account.contributions} label="Contribs" icon="✨" />
        </div>

        {/* Location & Languages */}
        <div className="mt-4 flex items-center justify-between text-xs">
          {account.city ||
            account.state ||
            (account.country && (
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="truncate max-w-[120px]">
                  {[account.city, account.state, account.country]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            ))}
          <div className="flex gap-1">
            {account.mainLanguages.slice(0, 3).map((lang, i) => (
              <motion.span
                key={i}
                className="px-2 py-1 rounded-full bg-gitdate dark:bg-gitdate/10 text-xs font-bold text-white"
                whileHover={{ scale: 1.05 }}
              >
                {lang}
              </motion.span>
            ))}
          </div>
        </div>
<div className="flex justify-between items-center py-2">

        {/* Blog Link */}
        {account.blog && (
          <motion.a
            href={account.blog}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-1 text-sm text-purple-400 transition-colors"
            whileHover={{ x: 2 }}
            >
            <LinkIcon className="w-4 h-4" />
            <span className="truncate">Visit Blog</span>
          </motion.a>
        )}

        <Button>
       Send Match Request
        </Button>
       </div> 

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute -inset-[1px] border border-gitdate rounded-xl " />
        </div>
      </div>
    </motion.div>
  );
};

const StatItem = ({
  value,
  label,
  icon,
}: {
  value: number;
  label: string;
  icon: string;
}) => (
  <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-neutral-800 rounded-lg">
    <div className="flex items-center gap-1">
      <span className="text-sm">{icon}</span>
      <span className="font-bold text-sm">{value}</span>
    </div>
    <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-0.5">
      {label}
    </span>
  </div>
);

export default ExploreCard;
