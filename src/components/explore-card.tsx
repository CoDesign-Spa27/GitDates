import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Users, GitFork, Star, MapPin, Link as LinkIcon, Heart, Check, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { getMatchStatus, sendMatchRequest } from "@/actions/match.action";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
export interface GitDateProfileType {
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

interface MatchStatusType {
  id?: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "NONE" ;
  isSender?: boolean;
}
 const ExploreCard = ({
  account,
  matchScore,
  userId,
}: {
  account: GitDateProfileType;
  matchScore?: number;
  userId:string;
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const router = useRouter()
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);
  const [matchStatus,setMatchStatus] = useState<MatchStatusType | null>(null);
  const [isLoading,setIsLoading] = useState(false);


  useEffect(()=>{
    const checkMatchStatus = async() => {
      const status:any = await getMatchStatus(userId);
      setMatchStatus(status);
    }
    checkMatchStatus();
  },[userId])
 
const handleSendMatchRequest = async () => { 
       try{
        setIsLoading(true);
        await sendMatchRequest(userId);
        toast({
          title:`Match request sent successfully!`,
          variant:'success'
        })
       }
       catch(error){
        toast({
          title:`An error occurred while sending match request!`,
          variant:'destructive'
        })
    }finally{
      setIsLoading(false);
    }
}

const getMatchButton = () =>{
  if (!matchStatus){
    return (
      <Button disabled={isLoading} onClick={handleSendMatchRequest}>
        {isLoading ? "Sending..." : "Send Match Request"}
      </Button>
    );
  }

  switch (matchStatus.status){
    case "NONE": 
    return (
      <Button disabled={isLoading} onClick={handleSendMatchRequest}>
      {isLoading ? "Sending..." : "Send Match Request"}
    </Button>
    )
    case "PENDING":
      if (matchStatus.isSender) {
        return (
          <Button disabled variant="secondary" className="bg-amber-500/20 text-amber-500">
          <span className="mr-1">Request Sent</span>
          <Heart size={16} fill="currentColor" />
        </Button>
      );
    } else {
      // This will be handled in the Notifications/Requests section
      return (
        <Button disabled variant="secondary" className="bg-amber-500/20 text-amber-500">
          <span className="mr-1">Response Pending</span>
          <Heart size={16} />
        </Button>
      );
    }
    case "ACCEPTED":
      return (
        <Button disabled variant="secondary" className="bg-green-500/20 text-green-500">
          <span className="mr-1">Matched</span>
          <Check size={16} />
        </Button>
      );
    case "REJECTED":
      return (
        <Button onClick={handleSendMatchRequest}>
          Try Again
        </Button>
      );
      default:
        return (
          <Button disabled={isLoading} onClick={handleSendMatchRequest}>
            {isLoading ? "Sending..." : "Send Match Request"}
          </Button>
        );
  }


}

const handleProfileClick= (userId:string) =>{
  router.push(`/dashboard/profile/${userId}`)
}

  if (!account) return null;
 
  
  return (
    <motion.div
      onClick={()=>handleProfileClick(userId)}
      className="w-full h-auto relative group cursor-pointer bg-white dark:bg-neutral-900 rounded-xl shadow-sm hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-neutral-800 hover:border-gitdate dark:hover:border-gitdate"
    >
 
      <div className="relative p-5 h-full flex flex-col">
        {matchScore !== undefined && (
          <div className="absolute -top-3 -right-3 w-14 h-14 rounded-full bg-gradient-to-br from-gitdate to-purple-600 flex items-center justify-center shadow-lg">
            <p className="text-white font-bold text-sm">
              {matchScore}%
            </p>
          </div>
        )}

        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-gitdate to-purple-600 p-0.5">
              {account.image ? (
                <img
                  src={account.image}
                  alt={account.name}
                  className="w-full h-full rounded-full object-cover border-2 border-white/10"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                  <Users className="w-7 h-7 text-gray-400" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-gitdate to-purple-500 text-[10px] px-2 py-0.5 rounded-full text-white shadow-sm">
              {account.contributions}+
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold truncate text-gray-900 dark:text-white">
              {account.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
              {account.bio || "No bio available"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-5">
          <StatItem value={account.followers} label="Followers" icon="👥" />
          <StatItem value={account.following} label="Following" icon="🔄" />
          <StatItem value={account.repositories} label="Repos" icon="📦" />
          <StatItem value={account.contributions} label="Contribs" icon="✨" />
        </div>

        <div className="py-3 flex flex-col items-start space-y-2 justify-between text-xs">
          {account.city || account.state || account.country ? (
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span className="truncate max-w-[120px]">
                {[account.city, account.state, account.country]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          ) : null}
          <div className="flex gap-1 flex-wrap justify-end">
            {account.mainLanguages.slice(0, 3).map((lang, i) => (
              <motion.span
                key={i}
                className="px-2 py-1 rounded-full bg-gitdate/10 dark:bg-gitdate/20 text-xs font-medium text-gitdate dark:text-gitdate/90"
                whileHover={{ scale: 1.05 }}
              >
                {lang}
              </motion.span>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-100 dark:border-neutral-800">
          {account.blog && (
            <motion.a
              href={account.blog}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-purple-500 hover:text-purple-600 transition-colors"
              whileHover={{ x: 2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <LinkIcon className="w-4 h-4" />
              <span className="truncate">Visit Blog</span>
            </motion.a>
          )}
          <div onClick={(e) => e.stopPropagation()}>
            {getMatchButton()}
          </div>
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
  <div className="flex flex-col items-center py-2 px-4 bg-gray-50 dark:bg-neutral-800/50 rounded-lg">
    <div className="flex items-center gap-1">
      <span className="text-sm">{icon}</span>
      <span className="font-semibold text-sm">{value}</span>
    </div>
    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-0.5">
      {label}
    </span>
  </div>
);

export default ExploreCard;
