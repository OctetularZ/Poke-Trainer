'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function addCoins(coins: number) {
  const session = await auth.api.getSession({ headers: await headers() })
  
  if (!session) {
    throw new Error('Unauthorized')
  }
  
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { coins: { increment: coins } }
  })
  
  return { coins: user.coins }
}