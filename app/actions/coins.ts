'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

// Add coins to a user's profile
export async function addCoins(coins: number) {
  // Gets the user's session
  const session = await auth.api.getSession({ headers: await headers() })
  
  // If the user isn't logged in, this error is thrown
  if (!session) {
    throw new Error('Unauthorized')
  }
  
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { coins: { increment: coins } }
  })
  
  return { coins: user.coins }
}