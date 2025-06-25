'use server'
import { authOptions } from "@/lib/auth";
import { ErrorHandler } from "@/lib/error";
import prisma from "@/lib/prisma";
import { SuccessResponse } from "@/lib/success";
import { getServerSession } from "next-auth";


export const getSelectedUserById = async (userId: string) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new ErrorHandler("Not authenticated", "UNAUTHORIZED");
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      email: session?.user?.email
    }
  });
  if (!currentUser) {
    throw new ErrorHandler("User not found", "NOT_FOUND");
  }

  try {
    const selectedUser = await prisma.gitDateProfile.findUnique({
      where: {
        userId: userId
      }
    });

    if (!selectedUser) {
      throw new ErrorHandler("User not found", "NOT_FOUND");
    }

    const response = new SuccessResponse(
      "User profile fetched successfully",
      200,
      selectedUser
    );
    return response.serialize();
  } catch (error) {
    throw new ErrorHandler("Error getting user profile", "DATABASE_ERROR");
  }
}