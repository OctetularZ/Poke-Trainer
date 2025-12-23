import { PrismaClient } from '../app/generated/prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const globalForPrisma = global as unknown as { 
    prisma: PrismaClient
    directPrisma: PrismaClient
}

// Accelerate adapter for app runtime (cached queries)
const accelerateAdapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
})
const prisma = globalForPrisma.prisma || new PrismaClient({ 
  adapter: accelerateAdapter 
}).$extends(withAccelerate())

// Direct pg adapter for seeding/migrations (fast bulk operations)
const pool = new pg.Pool({ connectionString: process.env.DIRECT_DATABASE_URL })
const directAdapter = new PrismaPg(pool)
const directPrisma = globalForPrisma.directPrisma || new PrismaClient({ 
  adapter: directAdapter 
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
  globalForPrisma.directPrisma = directPrisma
}

export default prisma
export { directPrisma }