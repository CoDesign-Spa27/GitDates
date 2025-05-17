"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import prisma from "../lib/prisma";
import { SuccessResponse } from "@/lib/success";
import { ErrorHandler } from "@/lib/error";
import { GitDateProfile } from "@prisma/client";

export interface MatchPreference {
  ageMin: number;
  ageMax: number;
  languages: string[];
  city: string;
  state: string;
  country: string;
  gender: string;
  minContributions: number;
}

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

export interface PotentialMatch {
  id: string;
  score: number;
  profile: GitDateProfileType;
}
export const createMatchPreference = async (matchData: MatchPreference) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user?.email as string,
      },
    });

    if (!user) {
      return null;
    }

    const {
      ageMin,
      ageMax,
      languages,
      city,
      state,
      country,
      gender,
      minContributions,
    } = matchData;
    const existingPreference = await prisma.matchPreference.findUnique({
      where: { userId: user.id },
    });
    const matchPreference = existingPreference
      ? await prisma.matchPreference.update({
          where: { userId: user.id },
          data: {
            userId: user.id,
            ageMin: ageMin,
            ageMax: ageMax,
            languages: languages,
            city: city,
            state: state,
            country: country,
            gender: gender,
            minContributions: minContributions,
          },
        })
      : await prisma.matchPreference.create({
          data: {
            userId: user.id,
            ageMin: ageMin,
            ageMax: ageMax,
            languages: languages,
            city: city,
            state: state,
            country: country,
            gender: gender,
            minContributions: minContributions,
          },
        });
    const response = new SuccessResponse(
      "Match preference created successfully",
      200,
      matchPreference
    );
    return response.serialize();
  } catch (error) {
    throw new ErrorHandler("Error finding matches", "DATABASE_ERROR");
  }
};

export const getMatchPreference = async (email: string) => {
  try {
    if (!email) {
      throw new Error("Email is required");
    }
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      throw new Error("User not found");
    }

    const matchPreference = await prisma.matchPreference.findUnique({
      where: { userId: user.id },
    });

    if (!matchPreference || matchPreference === null) {
      const response = new SuccessResponse(
        "No match preference found",
        404,
        null
      );
      return response.serialize();
    }

    const response = new SuccessResponse(
      "Match preference fetched successfully",
      200,
      matchPreference
    );
    return response.serialize();
  } catch (error) {
    throw new ErrorHandler("Error fetching match preference", "DATABASE_ERROR");
  }
};
export const findMatches = async (email: string | undefined | null) => {
  try {
    if (!email) {
      throw new Error("Email is required");
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      throw new Error("User not found");
    }

    const userPreference = await prisma.matchPreference.findUnique({
      where: { userId: user.id },
    });
    if (!userPreference) {
      throw new Error("User preference not found");
    }

    const userProfile = await prisma.gitDateProfile.findUnique({
      where: { userId: user.id },
      include: {
        user: true,
      },
    });
    if (!userProfile) {
      throw new Error("User profile not found");
    }

    const allProfiles = await prisma.gitDateProfile.findMany({
      where: {
        NOT: {
          userId: user.id,
        },
      },
      include: {
        user: true,
      },
    });

    const existingMatches = await prisma.match.findMany({
      where: {
        OR: [{ senderId: user.id }, { receiverId: user.id }],
      },
    });

    const matchesWithScores: PotentialMatch[] = allProfiles
      .filter((profile) => {
        return !existingMatches.some(
          (match) =>
            match.senderId === profile.userId ||
            match.receiverId === profile.userId
        );
      })
      .map((profile) => {
        let score = 0;

        // Calculate language match score
        if (userPreference.languages?.length && profile.mainLanguages?.length) {
          const commonLanguages = profile.mainLanguages.filter((lang) =>
            userPreference.languages?.includes(lang)
          );
          score +=
            (commonLanguages.length / userPreference.languages.length) * 40;
        }

        // Calculate contributions score
        if (
          userPreference.minContributions &&
          profile.contributions >= userPreference.minContributions
        ) {
          score += 30;
        }

        // Calculate location match score
        if (
          userPreference.city &&
          profile.city &&
          userPreference.city === profile.city
        ) {
          score += 30;
        } else if (
          userPreference.state &&
          profile.state &&
          userPreference.state === profile.state
        ) {
          score += 20;
        } else if (
          userPreference.country &&
          profile.country &&
          userPreference.country === profile.country
        ) {
          score += 10;
        }

        // Calculate gender match score
        if (
          userPreference.gender &&
          profile.user.gender &&
          userPreference.gender === profile.user.gender
        ) {
          score += 30;
        }

        return {
          id: profile.userId,
          score: score,
          profile: {
            githubUsername: profile.githubUsername,
            repositories: profile.repositories,
            name: profile.name || "",
            followers: profile.followers,
            following: profile.following,
            mainLanguages: profile.mainLanguages,
            contributions: profile.contributions,
            bio: profile.bio || "",
            city: profile.city || "",
            state: profile.state || "",
            country: profile.country || "",
            blog: profile.blog || "",
            image: profile.image || "",
          },
        };
      });

    const sortedMatches = matchesWithScores.sort((a, b) => b.score - a.score);
    const response = new SuccessResponse(
      "Matches found successfully",
      200,
      sortedMatches
    );
    return response.serialize();
  } catch (error) {
    throw new ErrorHandler("Error finding matches", "DATABASE_ERROR");
  }
};

export const getAllAccounts = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return;
  const currentUser = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
  });
  if (!currentUser) return;
  try {
    //added any for future fix
    const allAccounts: any = await prisma.user.findMany({
      where: {
        NOT: {
          id: currentUser.id,
        },
      },
      include: {
        gitDateProfile: true,
      },
    });

    const response = new SuccessResponse(
      "All accounts fetched successfully",
      200,
      allAccounts
    );
    return response.serialize();
  } catch (error) {
    console.error("Error getting all accounts", error);
    throw new ErrorHandler("Error getting all accounts", "DATABASE_ERROR");
  }
};

export const sendMatchRequest = async (receiverId: string) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Not Authenticated");

    const sender = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!sender) throw new Error("Sender not found");

    const existingMatch = await prisma.match.findFirst({
      where: {
        OR: [
          { senderId: sender.id, receiverId },
          { senderId: receiverId, receiverId: sender.id },
        ],
      },
    });

    if (existingMatch) {
      if (existingMatch.senderId === sender.id) {
        throw new Error("Match request already sent");
      } else if (existingMatch.status === "PENDING") {
        throw new Error("Match request already received");
      } else if (existingMatch.status === "ACCEPTED") {
        throw new Error("Match already exists");
      } else {
        await prisma.match.delete({
          where: {
            id: existingMatch.id,
          },
        });
      }
    }
    const match = await prisma.match.create({
      data: {
        senderId: sender.id,
        receiverId: receiverId,
        status: "PENDING",
      },
    });

    return match;
  } catch (error) {
    console.error("Error sending match request", error);
    throw error;
  }
};

export const getMatchRequests = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Not Authenticated");

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) throw new Error("User not found");

    const pendingRequests = await prisma.match.findMany({
      where: {
        receiverId: user.id,
        status: "PENDING",
      },
      include: {
        sender: {
          select: {
            gitDateProfile: true,
          },
        },
      },
    });

    console.log(pendingRequests, "pendingReuqests")
    const response = new SuccessResponse(
     "All request fetched successfully",
      200,
      pendingRequests
     )
     return response.serialize()
  } catch (error) {
    console.error("Error getting match requests", error);
    throw new ErrorHandler("Error getting all accounts", "DATABASE_ERROR");
  }
};

export const getMatchStatus = async (otherUserId: string) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Not Authenticated");

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) return null;

    const match = await prisma.match.findFirst({
      where: {
        OR: [
          { senderId: user.id, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: user.id },
        ],
      },
    });
    if (!match) return { status: "NONE" };

    return {
      id: match.id,
      status: match.status,
      isSender: match.senderId === user.id,
    };
  } catch (error) {
    console.error("Error getting match status", error);
    return null;
  }
};

export const respondToMatchRequest = async (
  matchId: string,
  action: "ACCEPT" | "REJECT"
) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) throw new Error("Not Authenticated");

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) throw new Error("User not found");

    const match = await prisma.match.findFirst({
      where: {
        id: matchId,
        receiverId: user.id,
      },
    });

    if (!match) throw new Error("Match not found");

    const status = action === "ACCEPT" ? "ACCEPTED" : "REJECTED";

    const updateMatch = await prisma.match.update({
      where: { id: matchId },
      data: { status: status },
    });
    return updateMatch;
  } catch (error) {
    console.error("Error getting match requests:", error);
    throw error;
  }
};

export const getMyMatches = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      throw new Error("User not found");
    }
    // Get all accepted matches
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { senderId: user.id, status: "ACCEPTED" },
          { receiverId: user.id, status: "ACCEPTED" },
        ],
      },
      include: {
        sender: {
          include: {
            gitDateProfile: true,
          },
        },
        receiver: {
          include: {
            gitDateProfile: true,
          },
        },
      },
    });
    if (!matches) {
      throw new Error("No matches found");
    }
    return matches.map((match) => {
      const isUserSender = match.senderId === user.id;
      const otherPerson = isUserSender ? match.receiver : match.sender;

      return {
        matchId: match.id,
        userId: otherPerson.id,
        profile: otherPerson.gitDateProfile,
        createdAt: match.createdAt,
      };
    });
  } catch (error) {
    console.error("Error getting matches:", error);
    throw error;
  }
};
