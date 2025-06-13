"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import prisma from "../lib/prisma";
import { UserData } from "../../types/user";
import { SuccessResponse } from "@/lib/success";
import { ErrorHandler } from "@/lib/error";

export const getUserProfile = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        image: true,
        gender: true,
        city: true,
        state: true,
        country: true,
        dob: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user profile", error);
    return null;
  }
};

export interface UpdateUserProfileData {
  name?: string;
  gender?: string;
  city?: string;
  state?: string;
  country?: string;
  dob?: Date;
}

export const updateUserProfile = async (data: UpdateUserProfileData) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new Error("Not authenticated");
    }

    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        name: data.name,
        gender: data.gender,
        city: data.city,
        state: data.state,
        country: data.country,
        dob: data.dob,
  
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        gender: true,
        city: true,
        state: true,
        country: true,
        dob: true,
      },
    });

    return updatedUser;
  } catch (error) {
    console.error(
      "Error updating user profile:",
      error instanceof Error ? error.message : "Unknown error"
    );
    throw new Error("Failed to update user profile");
  }
};

export const updateUserAvatar = async (email:string, image:string) =>{
  try{
    const existingUser = await prisma.user.findUnique({
      where:{
        email: email,
      }
    });
    if(!existingUser){
      throw new Error("User not found");
    }

   await prisma.user.update({
    where:{
      id:existingUser.id,
    },
    data:{
      image:image,
    }
    })

    return { success:"Avatar Updated Successfully " }
  }catch(err){
  return { error: "Failed to update avatar" };
  }
}

export const createGitDateProfile = async (githubData: UserData) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    const existingProfile = await prisma.gitDateProfile.findUnique({
      where: {
        userId: user.id,
      },
    });
    if (existingProfile) {
      throw new Error("Profile already exists");
    }
    const githubProfile = await prisma.gitDateProfile.create({
      data: {
        userId: user.id,
        githubUsername: githubData.basicInfo.login,
        name: githubData.basicInfo.name,
        repositories: githubData.activity.topRepositories.length,
        followers: githubData.socialStats.followers.length,
        following: githubData.socialStats.following.length,
        mainLanguages: Object.keys(githubData.codingProfile.topLanguages),
        contributions: githubData.basicInfo.totalContributions,
        image: githubData.basicInfo.avatar_url,
        bio: githubData.basicInfo.bio,
        city: githubData.basicInfo.city || "",
        state: githubData.basicInfo.state || "",
        country: githubData.basicInfo.country || "",
        blog: githubData.basicInfo.blog,
      },
    });
   const response = new SuccessResponse(
    'Successfully created gitdate profile',
    200,
    githubProfile
   )
   return response.serialize()
  } catch (error) {
   return new ErrorHandler('Error created Gitdate profile', 'DATABASE_ERROR')
  }
};

export const getGitDateProfile = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      include: {
        gitDateProfile: true,
      },
    });
    const response = new SuccessResponse(
      'Successfully created gitdate profile',
      200,
      user?.gitDateProfile
     )
     return response.serialize()
  } catch (error) {
    return new ErrorHandler('Error fetching Gitdate profile', 'DATABASE_ERROR')

  }
};

export const updateGitDateProfile = async (githubData: UserData & {
  name?: string;
  city?: string;
  state?: string;
  country?: string;
  bio?: string;
  blog?: string;
}) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }

    const updatedGithubProfile = await prisma.gitDateProfile.update({
      where: {
        userId: user.id,
      },
      data: {
        name: githubData.name,
        city: githubData.city,
        state: githubData.state,
        country: githubData.country,
        bio: githubData.bio,
        blog: githubData.blog,
      },
    });
    const response = new SuccessResponse(
      'Successfully updated gitdate profile',
      200,
      updatedGithubProfile
     )
     return response.serialize()
  } catch (error) {
    return new ErrorHandler('Error updating Gitdate profile', 'DATABASE_ERROR')

  }
};
