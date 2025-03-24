import { PrismaClient } from '@prisma/client';

// 全局声明以避免开发环境中的连接池问题
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 创建或复用Prisma客户端实例
const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['error', 'warn'],
});

// 在开发环境中保存客户端实例
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

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