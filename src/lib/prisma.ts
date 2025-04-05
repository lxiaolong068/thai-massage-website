import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// 添加错误处理中间件
prisma.$use(async (params, next) => {
  try {
    return await next(params);
  } catch (error) {
    console.error(`Prisma 查询失败 [${params.model}.${params.action}]:`, error);
    throw error;
  }
});

export default prisma;