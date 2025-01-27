"use client";
import { findMatches, PotentialMatch } from "@/actions/match.action";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getAllAccounts } from "@/actions/match.action";

export default function Explore() {
  const { data: session } = useSession();
  const [matches, setMatches] = useState<PotentialMatch[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Recommended Matches</h2>
        {matches.length === 0 ? (
          <div>No matches found</div>
        ) : (
          matches.map((match: PotentialMatch) => (
            <div key={match.id} className="border p-4 mb-4 rounded-lg">
              <h3 className="text-xl font-bold">{match.profile.name}</h3>
              <p>Match Score: {match.score}%</p>
            </div>
          ))
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">All Developers</h2>
        {accounts.length === 0 ? (
          <div>No developers found</div>
        ) : (
          accounts.map((account) => (
            <div key={account.id} className="border p-4 mb-4 rounded-lg">
              <h3 className="text-xl font-bold">
                {account.gitDateProfile?.name ||
                  account.name ||
                  "Anonymous Developer"}
              </h3>
              {account.gitDateProfile && (
                <>
                  <p className="text-gray-600">{account.gitDateProfile.bio}</p>
                  <p>
                    Languages: {account.gitDateProfile.mainLanguages.join(", ")}
                  </p>
                  <p>
                    Location:{" "}
                    {[
                      account.gitDateProfile.city,
                      account.gitDateProfile.state,
                      account.gitDateProfile.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
