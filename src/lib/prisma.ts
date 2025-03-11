import { PrismaClient } from '@prisma/client/index';

// 防止在开发环境中创建多个Prisma实例
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// 检查环境变量是否存在，如果不存在则输出警告
if (!process.env.POSTGRES_PRISMA_URL) {
  console.warn(
    'WARNING: POSTGRES_PRISMA_URL environment variable is not set. ' +
    'This may cause issues with database connections. ' +
    'Please make sure to set this variable in your environment or .env file.'
  );
}

// 创建Prisma客户端实例，添加连接配置
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: process.env.POSTGRES_PRISMA_URL
      ? {
          db: {
            url: process.env.POSTGRES_PRISMA_URL,
          },
        }
      : undefined, // 如果环境变量不存在，让Prisma使用schema.prisma中的默认配置
  });

// 在开发环境中保存Prisma实例到全局对象
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma; 