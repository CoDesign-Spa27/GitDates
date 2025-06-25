import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const waitlistSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = waitlistSchema.parse(body)

    // Check if email already exists
    const existingEntry = await prisma.waitlist.findUnique({
      where: { email },
    })

    if (existingEntry) {
      return NextResponse.json(
        { error: 'Email already registered for waitlist' },
        { status: 400 }
      )
    }

    // Create waitlist entry
    const waitlistEntry = await prisma.waitlist.create({
      data: {
        email,
      },
    })

    return NextResponse.json({
      message: 'Successfully joined waitlist!',
      id: waitlistEntry.id,
    })
  } catch (error) {
    console.error('Waitlist signup error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const email = url.searchParams.get('email')

    if (!email) {
      const totalCount = await prisma.waitlist.count()
      return NextResponse.json({ total: totalCount })
    }

    // Get specific user's position
    const user = await prisma.waitlist.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Email not found in waitlist' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt
    })
  } catch (error) {
    console.error('Waitlist get error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
