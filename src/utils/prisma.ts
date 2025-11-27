import { PrismaClient } from '@prisma/client'

// use `prisma` in your application to read and write data in your DB
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
    log: [
      {
        emit: 'stdout',
        level: 'query',
      },
      {
        emit: 'stdout',
        level: 'error',
      },
      {
        emit: 'stdout',
        level: 'info',
      },
      {
        emit: 'stdout',
        level: 'warn',
      },
    ],
  });

  prisma.$on("query", (e: any) => {
    console.log('Query: ' + e.query)
    console.log('Params: ' + e.params)
    console.log('Duration: ' + e.duration + 'ms')
  })



if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;


export default prisma;
