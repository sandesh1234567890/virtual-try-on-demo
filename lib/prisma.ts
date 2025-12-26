import "dotenv/config";
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// Fallback for Vercel/Production if env is missing
if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = "file:./dev.db";
}

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
