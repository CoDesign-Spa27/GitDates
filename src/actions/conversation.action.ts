'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '../lib/auth'
import prisma from '../lib/prisma'
import { revalidatePath } from 'next/cache'
import { SuccessResponse } from '@/lib/success'
import { ErrorHandler } from '@/lib/error'

export async function getConversations() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) throw new Error('Not authenticated')

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    if (!user) throw new Error('User not found')

    // Get all matches where the user is either sender or receiver and status is ACCEPTED
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { senderId: user.id, status: 'ACCEPTED' },
          { receiverId: user.id, status: 'ACCEPTED' },
        ],
      },
      include: {
        conversation: {
          include: {
            lastMessage: true,
          },
        },
        sender: {
          include: {
            gitDateProfile: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
        receiver: {
          include: {
            gitDateProfile: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    })

    // Format the conversations
    const conversations = matches.map((match: any) => {
      // Determine the other user (not the current user)
      const otherUser =
        match.senderId === user.id ? match.receiver : match.sender
      const profile = otherUser.gitDateProfile

      return {
        id: match.conversation?.id || null,
        matchId: match.id,
        otherUserId: otherUser.id,
        name: profile?.name || 'Unknown User',
        image: profile?.image || '/placeholder-avatar.png',
        lastMessage: match.conversation?.lastMessage || null,
        unreadCount: 0, // We'll implement this later
        createdAt: match.conversation?.createdAt || match.createdAt,
        updatedAt: match.conversation?.updatedAt || match.updatedAt,
      }
    })

    const formattedResponse = conversations.sort((a: any, b: any) => {
      const dateA = a.lastMessage?.createdAt || a.updatedAt
      const dateB = b.lastMessage?.createdAt || b.updatedAt
      return new Date(dateB).getTime() - new Date(dateA).getTime()
    })
    const response = new SuccessResponse(
      'Conversation Fetched SuccessFully',
      200,
      formattedResponse
    )
    return response.serialize()
  } catch (error) {
    throw new ErrorHandler(
      'Error while fetching conversations',
      'DATABASE_ERROR'
    )
  }
}

export async function getOrCreateConversation(matchId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) throw new Error('Not authenticated')

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    if (!user) throw new Error('User not found')
    // Check if match exists and user is part of it
    const match = await prisma.match.findFirst({
      where: {
        id: matchId,
        status: 'ACCEPTED',
        OR: [{ senderId: user.id }, { receiverId: user.id }],
      },
    })
    if (!match) throw new Error('Match not found or not accepted')

    // Get or create conversation for this match
    let conversation = await prisma.conversation.findUnique({
      where: { matchId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    })

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { matchId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      })
    }

    // Mark messages as read
    if (conversation.messages.length > 0) {
      await prisma.message.updateMany({
        where: {
          conversationId: conversation.id,
          senderId: { not: user.id },
          read: false,
        },
        data: { read: true },
      })
    }

    const data = {
      ...conversation,
      currentUserId: user.id,
      otherUserId:
        match.senderId === user.id ? match.receiverId : match.senderId,
    }

    const response = new SuccessResponse(
      'Conversation Fetched SuccessFully',
      200,
      data
    )
    return response.serialize()
  } catch (error) {
    throw new ErrorHandler('Error while fetching conversations', 'DATABASE_ERROR')

  }
}

export async function sendMessage(conversationId: string, content: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) throw new Error('Not authenticated')

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    if (!user) throw new Error('User not found')

    // Verify the conversation exists and user is part of it
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { match: true },
    })

    if (!conversation) throw new Error('Conversation not found')

    const { match } = conversation
    if (match.senderId !== user.id && match.receiverId !== user.id) {
      throw new Error('Not authorized to send messages in this conversation')
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: user.id,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    // Update the last message reference in the conversation
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageId: message.id,
        updatedAt: new Date(),
      },
    })
    const response = new SuccessResponse(
      'Messages sent successfully',
      200,
      message
    )
    return response.serialize()
  } catch (error) {
    throw new ErrorHandler(
      'Error while fetching sending message',
      'DATABASE_ERROR'
    )
  }
}

export async function markConversationAsRead(conversationId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) throw new Error('Not authenticated')

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    if (!user) throw new Error('User not found')

    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: user.id },
        read: false,
      },
      data: { read: true },
    })

    return { success: true }
  } catch (error) {
    throw error
  }
}

export async function getUnreadMessageCounts() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) throw new Error('Not authenticated')

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    if (!user)
      throw new Error('User not found for email: ' + session.user.email)

    const conversations = await prisma.conversation.findMany({
      where: {
        match: {
          OR: [{ senderId: user.id }, { receiverId: user.id }],
        },
      },
      include: {
        _count: {
          select: {
            messages: {
              where: {
                senderId: { not: user.id },
                read: false,
              },
            },
          },
        },
      },
    })

    const counts = Object.fromEntries(
      conversations.map((conversation: any) => [
        conversation.id,
        conversation._count.messages,
      ])
    )

    const totalUnread = Object.values(counts).reduce(
      (sum: any, count: any) => sum + count,
      0
    )
    const response = new SuccessResponse(
      'Fetching unread messages details successfull',
      200,
      {
        byConversation: counts,
        total: totalUnread,
      }
    )
    return response.serialize()
  } catch (error) {
    throw error
  }
}
