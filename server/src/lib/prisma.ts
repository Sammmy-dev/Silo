import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient | undefined;
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured");
}

const adapter = new PrismaPg(databaseUrl);

const prisma = global.__prisma__ ?? new PrismaClient({
  adapter,
});

if (process.env.NODE_ENV !== "production") {
  global.__prisma__ = prisma;
}

export default prisma;