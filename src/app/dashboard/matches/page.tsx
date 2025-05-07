"use client";
import { useEffect, useState } from "react";
import {
  getMyMatches,
  getMatchRequests,
  respondToMatchRequest,
} from "@/actions/match.action";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Check, X, Heart } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import useSWR from "swr";
import { useRouter } from "next/navigation";

interface Profile {
  name: string;
  image: string;
  bio: string;
  // other properties from GitDateProfile
}

interface Match {
  matchId: string;
  userId: string;
  profile: Profile;
  createdAt: Date;
}

interface MatchRequest {
  id: string;
  sender: {
    gitDateProfile: Profile;
  };

  createdAt: Date;
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [requests, setRequests] = useState<MatchRequest[]>([]);
  const [activeTab, setActiveTab] = useState("matches");
  const [loading, setLoading] = useState(true);


  const loadData = async () => {
    try {
      setLoading(true);
      const [matchesData, requestsData] = await Promise.all([
        getMyMatches(),
        getMatchRequests(),
      ]);
      //@ts-ignore
      setMatches(matchesData || []);
      //@ts-ignore
      setRequests(requestsData || []);
    } catch (error) {
      console.error("Error loading match data:", error);
      toast({
        title: "Failed to load matches",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAccept = async (matchId: string) => {
    try {
      await respondToMatchRequest(matchId, "ACCEPT");
      toast({
        title: "Match request accepted",
        variant: "destructive",
      });
      loadData(); // Refresh data
    } catch (error) {
      toast({
        title: "Failed to accept match request",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (matchId: string) => {
    try {
      await respondToMatchRequest(matchId, "REJECT");
      toast({
        title: "Match request rejected",
        variant: "destructive",
      });
      loadData(); // Refresh data
    } catch (error) {
      toast({
        title: "Failed to reject match request",
        variant: "destructive",
      });
    }
  };

  const renderLoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Matches</h1>

      <Tabs
        defaultValue="matches"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="matches">
            Matches
            {matches.length > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                {matches.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="requests">
            Requests
            {requests.length > 0 && (
              <span className="ml-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                {requests.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matches">
          {loading ? (
            renderLoadingSkeleton()
          ) : matches.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No matches yet</h3>
              <p className="text-muted-foreground">
                When you match with someone, they'll appear here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matches.map((match) => (
                <MatchCard key={match.matchId} match={match} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests">
          {loading ? (
            renderLoadingSkeleton()
          ) : requests.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No pending requests</h3>
              <p className="text-muted-foreground">
                When someone sends you a match request, it will appear here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onAccept={() => handleAccept(request.id)}
                  onReject={() => handleReject(request.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MatchCard({ match }: { match: Match }) {
  const router = useRouter();
  
  if (!match.profile) return null;

  const handleMessage = () => {
    router.push(`/dashboard/messages/new?matchId=${match.matchId}`);
  };

  const handleViewProfile = () => {
    router.push(`/dashboard/profile/${match.userId}`);
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden flex flex-col">
      <div className="p-4 flex gap-4">
        <div className="relative">
          <img
            src={match.profile.image || "/placeholder-avatar.png"}
            alt={match.profile.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-primary"
          />
          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-5 h-5 flex items-center justify-center">
            <Check className="w-3 h-3 text-white" />
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg">{match.profile.name}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {match.profile.bio || "No bio available"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Matched {new Date(match.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mt-auto p-4 pt-0 flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={handleViewProfile}
        >
          View Profile
        </Button>
        <Button 
          variant="pressed" 
          className="flex-1"
          onClick={handleMessage}
        >
          Message
        </Button>
      </div>
    </div>
  );
}

function RequestCard({
  request,
  onAccept,
  onReject,
}: {
  request: MatchRequest;
  onAccept: () => void;
  onReject: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = async () => {
    setIsLoading(true);
    await onAccept();
    setIsLoading(false);
  };

  const handleReject = async () => {
    setIsLoading(true);
    await onReject();
    setIsLoading(false);
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="p-4 flex gap-4">
        <img
          src={
            request.sender.gitDateProfile?.image || "/placeholder-avatar.png"
          }
          alt={request.sender.gitDateProfile?.name}
          className="w-16 h-16 rounded-full object-cover"
        />

        <div>
          <h3 className="font-bold">{request.sender.gitDateProfile?.name}</h3>
          <p className="text-muted-foreground text-sm">
            {request.sender.gitDateProfile?.bio?.substring(0, 60) ||
              "No bio available"}
            {request.sender.gitDateProfile?.bio?.length > 60 ? "..." : ""}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Sent request {new Date(request.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleReject}
          disabled={isLoading}
        >
          <X className="mr-1 w-4 h-4" /> Reject
        </Button>
        <Button
          variant="default"
          className="flex-1"
          onClick={handleAccept}
          disabled={isLoading}
        >
          <Check className="mr-1 w-4 h-4" /> Accept
        </Button>
      </div>
    </div>
  );
}
