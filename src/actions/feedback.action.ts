'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { ErrorHandler } from '@/lib/error'
import { SuccessResponse } from '@/lib/success'
import { z } from 'zod'

const feedbackSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be less than 1000 characters'),
  type: z.enum(['BUG', 'FEATURE_REQUEST', 'IMPROVEMENT', 'OTHER']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
})

export type FeedbackFormData = z.infer<typeof feedbackSchema>

export const submitFeedback = async (data: FeedbackFormData) => {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      throw new ErrorHandler('Authentication required', 'UNAUTHORIZED')
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      throw new ErrorHandler('User not found', 'NOT_FOUND')
    }

    const validatedData = feedbackSchema.parse(data)

    const feedback = await prisma.feedback.create({
      data: {
        userId: user.id,
        title: validatedData.title,
        description: validatedData.description,
        type: validatedData.type,
        priority: validatedData.priority,
      },
    })
    const response = new SuccessResponse(
      'Feedback submitted successfully',
      201,
      {
        id: feedback.id,
        title: feedback.title,
        type: feedback.type,
        status: feedback.status,
        createdAt: feedback.createdAt,
      }
    )
    return response.serialize()
  } catch (error) {
    console.log(error)
    throw new ErrorHandler('Error submitting feedback', 'DATABASE_ERROR')
  }
}

export const getUserFeedback = async () => {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      throw new ErrorHandler('Authentication required', 'UNAUTHORIZED')
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      throw new ErrorHandler('User not found', 'NOT_FOUND')
    }

    const feedbacks = await prisma.feedback.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    const response = new SuccessResponse(
      'User feedback retrieved successfully',
      200,
      feedbacks
    )
    return response.serialize()
  } catch (error) {
    console.log(error)
    throw new ErrorHandler('Error fetching user feedback', 'DATABASE_ERROR')
  }
}
