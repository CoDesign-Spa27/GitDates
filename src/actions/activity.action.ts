'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ErrorHandler } from "@/lib/error";
import { SuccessResponse } from "@/lib/success";

export const recordProfileView = async (viewedUserId: string) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new ErrorHandler("Not authenticated", "UNAUTHORIZED");
    }

    const viewer = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!viewer) {
      throw new ErrorHandler("Viewer not found", "NOT_FOUND");
    }

    if (viewer.id === viewedUserId) {
      return;
    }

    const lastHour = new Date(Date.now() - 60 * 60 * 1000);
    const existingView = await prisma.profileView.findFirst({
      where: {
        viewerId: viewer.id,
        viewedUserId: viewedUserId,
        createdAt: {
          gte: lastHour
        }
      }
    });

    if (!existingView) {
      await prisma.profileView.create({
        data: {
          viewerId: viewer.id,
          viewedUserId: viewedUserId
        }
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error recording profile view:", error);
    throw new ErrorHandler("Error recording profile view", "DATABASE_ERROR");
  }
}

export const getActivitySummary = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      throw new ErrorHandler("Not authenticated", "UNAUTHORIZED");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      throw new ErrorHandler("User not found", "NOT_FOUND");
    }
 
    const profileViews = await prisma.profileView.count({
      where: {
        viewedUserId: user.id,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)  
        }
      }
    });
 
    const newConnections = await prisma.match.count({
      where: {
        OR: [
          { senderId: user.id },
          { receiverId: user.id }
        ],
        status: "ACCEPTED",
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
        }
      }
    });
 
    const pendingRequests = await prisma.match.count({
      where: {
        receiverId: user.id,
        status: "PENDING"
      }
    });

    const activitySummary = {
      profileViews,
      newConnections,
      pendingRequests
    };

    const response = new SuccessResponse(
      "Activity summary fetched successfully",
      200,
      activitySummary
    );
    return response.serialize();
  } catch (error) {
    console.error("Error getting activity summary:", error);
    throw new ErrorHandler("Error getting activity summary", "DATABASE_ERROR");
  }
}