"use client";
import { findMatches, PotentialMatch } from "@/actions/match.action";
import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { getAllAccounts } from "@/actions/match.action";
import ExploreCard from "@/components/explore-card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton";
import Chat from "@/components/socket-text";
// Performance optimizations:
// 1. Using useCallback for loadData to prevent unnecessary re-renders
// 2. Using useMemo for filteredMatches to memoize expensive filtering
// 3. Using Promise.all to fetch data in parallel
// 4. Conditional rendering with early returns for loading/error states
// 5. Memoized components with proper key props for efficient list rendering

export default function Explore() {
  const { data: session } = useSession();
  const [matches, setMatches] = useState<PotentialMatch[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"matches" | "developers">("matches");

  const loadData = useCallback(async () => {
    if (!session?.user?.email) {
      setIsLoading(false);
      return;
    }
    try {
      const [matchesResponse, accountsResponse] = await Promise.all([
        findMatches(session.user.email),
        getAllAccounts(),
      ]);

      if (!matchesResponse) {
        throw new Error("Failed to fetch matches");
      }
      setMatches(matchesResponse);
      setAccounts(accountsResponse || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredMatches = useMemo(() => 
    matches.filter((match) => match.score > 1),
    [matches]
  );

  const SkeletonCards = useCallback(() => (
    <>
      {[...Array(6)].map((_, index) => (
        <div key={index} className="w-full ">
          <Skeleton className="h-[280px] w-full rounded-lg" />
          <div className="mt-3 space-y-2">
            <Skeleton className="h-8 w-3/4" />
        
          </div>
        </div>
      ))}
    </>
  ), []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
      <Chat />
        <Tabs defaultValue="matches">
          <TabsList className="animate-fade-in">
            <TabsTrigger 
              onClick={() => setActiveTab("matches")} 
              value="matches"
            >
              Matches
            </TabsTrigger>
            <TabsTrigger 
              onClick={() => setActiveTab("developers")} 
              value="developers"
            >
              All Developers
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCards />
        </div>
      ) : (
        activeTab === "matches" ? (
          <div className="mb-12">
            {filteredMatches.length === 0 ? (
              <div className="text-gray-500 text-center">No matches found</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
                {filteredMatches.map((match: PotentialMatch) => (
                  <ExploreCard
                    key={match.id}
                    account={match.profile}
                    matchScore={match.score}
                    userId={match.id}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {accounts.length === 0 ? (
              <div className="text-gray-500">No developers found</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
                {accounts.map((account) => (
                  <ExploreCard
                    key={account.id}
                    userId={account.id}
                    account={account.gitDateProfile}
                  />
                ))}
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
