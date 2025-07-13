import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import prisma from './prisma'

const TOKEN_SECRET =
  process.env.SOCKET_TOKEN_SECRET! || process.env.NEXTAUTH_SECRET!
const TOKEN_EXPIRATION = 60 * 60 * 24 * 30 // 30 days
export async function generateSocketToken(req: NextRequest) {
  try {
    const authToken = await getToken({
      req: req,
      secret: process.env.NEXTAUTH_SECRET,
    })
    if (!authToken?.sub) {
      return null
    }
    const user = await prisma.user.findUnique({
      where: { id: authToken.sub },
      select: { id: true, email: true, name: true, image: true },
    })
    if (!user) {
      return null
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
      },
      TOKEN_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    )
    return token
  } catch (error) {
 
    return null
  }
}

export function verifySocketToken(token: string): {
  userId: string
  email: string
  name: string
} | null {
  try {
    const decoded = jwt.verify(token, TOKEN_SECRET) as {
      userId: string
      email: string
      name: string
    }
    return decoded
  } catch (error) {
 
    return null
  }
}
