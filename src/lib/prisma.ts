import { PrismaClient } from '@prisma/client';

// 防止在开发环境中创建多个Prisma实例
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// 创建Prisma客户端实例，添加连接配置
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.POSTGRES_PRISMA_URL,
      },
    },
  });

// 在开发环境中保存Prisma实例到全局对象
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma; 