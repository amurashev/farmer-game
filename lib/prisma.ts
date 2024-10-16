import { PrismaClient } from '@prisma/client'

/* eslint-disable @typescript-eslint/no-explicit-any */

let prisma: PrismaClient | undefined

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!(global as any).prisma) {
    ;(global as any).prisma = new PrismaClient()
  }
  prisma = (global as any).prisma
}

export default prisma as PrismaClient
