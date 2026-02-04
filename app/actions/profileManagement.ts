// 'use server'

// import prisma from '@/lib/prisma'
// import { auth } from '@/lib/auth'
// import { headers } from 'next/headers'

// export async function getProfileInfo() {
//   const session = await auth.api.getSession({ headers: await headers() })
  
//   if (!session) {
//     throw new Error('Unauthorized')
//   }
  
//   const user = await prisma.user.findUnique({
//     where: { id: session.user.id },
//     select: {
//       username: true,
//       coins: true
//     }
//   })
  
//   return { user }
// }