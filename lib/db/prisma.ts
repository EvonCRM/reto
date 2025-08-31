import { PrismaClient } from '@prisma/client';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let prismaInstance: PrismaClient;

try {
  prismaInstance = global.prisma || new PrismaClient();
  
  if (process.env.NODE_ENV !== 'production') {
    global.prisma = prismaInstance;
  }
} catch (error) {
  console.error('❌ Failed to initialize Prisma client:', error);
  throw error;
}

export const prisma = prismaInstance;
