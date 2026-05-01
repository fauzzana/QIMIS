import "dotenv/config";
import { PrismaClient } from '../prisma/prisma/generated/client'
import { PrismaNeon } from "@prisma/adapter-neon"

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });
export { prisma };

// const prismaClientSingleton = () => {
//   const databaseUrl = process.env.POSTGRES_PRISMA_URL;

//   if (!databaseUrl) {
//     throw new Error("Database URL (POSTGRES_PRISMA_URL) is missing in .env file");
//   }

//   return new PrismaClient()
// }

// declare global {
//   var prisma: undefined | ReturnType<typeof prismaClientSingleton>
// }

// export const prisma = globalThis.prisma ?? prismaClientSingleton()

// if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma