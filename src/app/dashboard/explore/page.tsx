"use client";
import { findMatches, PotentialMatch } from "@/actions/match.action";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getAllAccounts } from "@/actions/match.action";
import ExploreCard from "@/components/explore-card";

export default function Explore() {
  const { data: session } = useSession();
  const [matches, setMatches] = useState<PotentialMatch[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"matches" | "developers">(
    "matches"
  );

  useEffect(() => {
    async function loadData() {
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
        console.log(accountsResponse);
        setMatches(matchesResponse);
        setAccounts(accountsResponse || []);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [session?.user?.email]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

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
        <button
          className={`px-4 py-2 ${
            activeTab === "matches" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("matches")}
        >
          Matches
        </button>
        <button
          className={`px-4 py-2 ml-2 ${
            activeTab === "developers"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("developers")}
        >
          All Developers
        </button>
      </div>

      {activeTab === "matches" ? (
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Recommended Matches</h2>
          {matches.filter((match) => match.score > 1).length === 0 ? (
            <div className="text-gray-500">No matches found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches
                .filter((match) => match.score > 1)
                .map((match: PotentialMatch) => (
                  <ExploreCard
                    key={match.id}
                    account={match.profile}
                    matchScore={match.score}
                  />
                ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-3xl font-bold mb-6">All Developers</h2>
          {accounts.length === 0 ? (
            <div className="text-gray-500">No developers found</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
              {accounts.map((account) => (
                <ExploreCard
                  key={account.id}
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
