import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client";
import dotenv from "dotenv";

dotenv.config();

// Pour éviter de recréer une connexion à chaque sauvegarde en DEV
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
  log: ["query", "info", "warn", "error"],
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;