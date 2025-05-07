import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Users, GitFork, Star, MapPin, Link as LinkIcon, Heart, Check } from "lucide-react";
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
      className="w-[350px] h-[280px] relative group cursor-pointer bg-neutral-100 dark:bg-transparent rounded-xl"
      style={{ perspective: 1000, rotateX, rotateY }}
      whileHover={{ scale: 1.05, z: 50 }}
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
 {getMatchButton()}
       </div> 
 
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
