import "dotenv/config";
import { PrismaClient } from "@prisma/client"
import path from "path";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// Robust absolute path for Vercel/Production
const dbPath = path.join(process.cwd(), "prisma", "dev.db");
(process.env as any).DATABASE_URL = `file:${dbPath}`;

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
