'use server'

import { ErrorHandler } from "@/lib/error";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth"

export const profileSetupStatus = async () => {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      throw new ErrorHandler('User not found', 'UNAUTHORIZED');
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      throw new ErrorHandler('User not found', 'NOT_FOUND');
    }

    const gitDateProfile = await prisma.gitDateProfile.findUnique({
      where: { userId: user.id }
    });

    const matchPreference = await prisma.matchPreference.findUnique({
      where: { userId: user.id }
    });

    return {
      isProfileCreated: !!gitDateProfile,
      isMatchPreferenceCreated: !!matchPreference
    };

  } catch (err) {
    throw new ErrorHandler(
      err instanceof Error ? err.message : 'Failed to check profile setup',
      'DATABASE_ERROR'
    );
  }
}