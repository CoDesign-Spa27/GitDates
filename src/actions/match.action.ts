"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

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

export interface PotentialMatch{
  id:string;
  score:number;
  profile:GitDateProfileType;
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
  
    const { ageMin, ageMax, languages, city, state, country, gender, minContributions } = matchData;
    const existingPreference = await prisma.matchPreference.findUnique({  
      where:{userId:user.id}
    })
    const matchPreference = existingPreference ? await prisma.matchPreference.update({
      where:{userId:user.id},
      data:{
        userId: user.id,
        ageMin: ageMin,
        ageMax: ageMax, 
        languages: languages,
        city: city,
        state: state,
        country: country,
        gender: gender,
        minContributions: minContributions
      },
    }) : await prisma.matchPreference.create({
      data:{
        userId: user.id,
        ageMin: ageMin,
        ageMax: ageMax, 
        languages: languages,
        city: city,
        state: state,
        country: country,
        gender: gender,
        minContributions: minContributions
      },
    });
    return matchPreference;
  } catch (error) {
    console.error("Error creating match preference", error);
    throw error;
  }
};


export const getMatchPreference = async (email:string) => {
  try{
    if(!email){
      throw new Error("Email is required");
    }
    const user = await prisma.user.findUnique({
      where:{email:email}
    })
    if(!user){
      throw new Error("User not found");
    }

    const matchPreference = await prisma.matchPreference.findUnique({
      where:{userId:user.id}
    })
    return matchPreference;
  }catch(error){
    console.error("Error getting match preference",error);
    throw error;
  }
}


export const findMatches = async (email:string | undefined | null):Promise<PotentialMatch[]> => {

  console.log(email,"email");
  try {
    if (!email) {
      throw new Error("Email is required");
    }

    const user = await prisma.user.findUnique({
      where: {email: email}
    });
    if (!user) {
      throw new Error("User not found");
    }

    const userPreference = await prisma.matchPreference.findUnique({
      where: {userId: user.id}
    });
    if (!userPreference) {
      throw new Error("User preference not found");
    }

    const userProfile = await prisma.gitDateProfile.findUnique({
      where: {userId: user.id},
      include: {
        user: true
      }
    });
    if (!userProfile) {
      throw new Error("User profile not found");
    }

    const allProfiles = await prisma.gitDateProfile.findMany({
      where: {
        NOT: {
          userId: user.id
        }
      },
      include: {
        user: true
      }
    });

    const existingMatches = await prisma.match.findMany({
      where: {
        OR: [
          {senderId: user.id},
          {receiverId: user.id}
        ]
      }
    });

    const matchesWithScores: PotentialMatch[] = allProfiles
      .filter((profile) => {
        return !existingMatches.some(
          (match) => match.senderId === profile.userId || match.receiverId === profile.userId
        );
      })
      .map((profile) => {
        let score = 0;

        // Calculate language match score
        if (userPreference.languages?.length && profile.mainLanguages?.length) {
          const commonLanguages = profile.mainLanguages.filter((lang) => 
            userPreference.languages?.includes(lang)
          );
          score += (commonLanguages.length / userPreference.languages.length) * 40;
        }

        // Calculate contributions score
        if (userPreference.minContributions && profile.contributions >= userPreference.minContributions) {
          score += 30;
        }

        // Calculate location match score
        if (userPreference.city && profile.city && userPreference.city === profile.city) {
          score += 30;
        } else if (userPreference.state && profile.state && userPreference.state === profile.state) {
          score += 20;
        } else if (userPreference.country && profile.country && userPreference.country === profile.country) {
          score += 10;
        }

        // Calculate gender match score
        if (userPreference.gender && profile.user.gender && userPreference.gender === profile.user.gender) {
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
            image: profile.image || ""
          }
        };
      });

    const sortedMatches = matchesWithScores.sort((a, b) => b.score - a.score);
    return sortedMatches;

  } catch (error) {
    console.error("Error finding matches:", error);
    throw error;
  }
}

export const getAllAccounts=async()=>{
  const session = await getServerSession(authOptions);
  if(!session) return;
  const currentUser = await prisma.user.findUnique({
    where: {email: session.user?.email as string}
  });
  if(!currentUser) return;
  try{
    const allAccounts = await prisma.user.findMany({
      where: {
        NOT: {
          id: currentUser.id,
        },
      },
      include: {
        gitDateProfile: true,
      },
    });

    return allAccounts;
  }catch(error){
    console.error("Error getting all accounts",error);
    throw error;
  }
}
