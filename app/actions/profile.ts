'use server'

import { profileSchema } from '@/lib/validations/profile'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function updateProfile(formData: FormData) {
  // Get authenticated session
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  // Validate form data
  const data = profileSchema.parse({
    username: formData.get('username'),
    name: formData.get('name')
  })
  
  // Update in DB
  const updateUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      username: data.username,
      name: data.name
    }
  })
  
  return { success: true }
}

export async function getUserProfile() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      username: true,
      name: true,
      coins: true,
      email: true
    }
  })

  if (!user) {
    throw new Error('User not found')
  }

  return user
}