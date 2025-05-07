"use client";
import { findMatches, PotentialMatch } from "@/actions/match.action";
import { useSession } from "next-auth/react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { getAllAccounts } from "@/actions/match.action";
import ExploreCard from "@/components/explore-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import useSWR from "swr";
import { findMatchesFetcher, getAllAccountsFetcher } from "@/fetchers/fetchers";

export default function Explore() {
  const { data: session } = useSession();
 
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"matches" | "developers">(
    "matches"
  );
  const email = session?.user?.email;
  const {
    data: matches,
    error: matchesError,
    isLoading: isMatchesLoading,
  } = useSWR(
    email ? ["matches", email] : null,
    () => findMatchesFetcher(email as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000,
    }
  );
  const {
    data: accounts,
    error: accountsError,
    isLoading: isAccountsLoading,
  } = useSWR(email ? ["accounts", email] : null, () => getAllAccountsFetcher(), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 300000,
  });

 
  const filteredMatches = useMemo(
    () => matches?.additional?.filter((match) => match?.score > 1) || [],
    [matches]
  );

  const SkeletonCards = useCallback(
    () => (
      <>
        {[...Array(6)].map((_, index) => (
          <div key={index} className="w-full">
            <Skeleton className="h-[280px] w-full rounded-lg" />
            <div className="mt-3 space-y-2">
              <Skeleton className="h-8 w-3/4" />
            </div>
          </div>
        ))}
      </>
    ),
    []
  );

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
        <Tabs defaultValue="matches" value={activeTab} onValueChange={(value) => setActiveTab(value as "matches" | "developers")}>
          <TabsList className="animate-fade-in">
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="developers">All Developers</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isAccountsLoading || isMatchesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCards />
        </div>
      ) : activeTab === "matches" ? (
        <div className="mb-12">
          {!filteredMatches || filteredMatches.length === 0 ? (
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
          {!accounts?.additional || accounts.additional.length === 0 ? (
            <div className="text-gray-500">No developers found</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
              {accounts.additional.map((account: any) => (
                <ExploreCard
                  key={account.id}
                  userId={account.id}
                  account={account.gitDateProfile}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
