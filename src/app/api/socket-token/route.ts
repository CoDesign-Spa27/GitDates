import { generateSocketToken } from '@/lib/socket-auth'
import { NextRequest, NextResponse } from 'next/server'
export async function GET(req: NextRequest) {
  try {
    const token = await generateSocketToken(req)
    if (!token) {
      return NextResponse.json(
        {
          error: 'Failed to generate socket token',
        },
        { status: 401 }
      )
    }
    return NextResponse.json({ token })
  } catch (err) {
    console.error('Error in socket token endpoint:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
