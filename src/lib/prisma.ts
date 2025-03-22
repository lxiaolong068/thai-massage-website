import { PrismaClient } from '@prisma/client/index';

// Prevent creating multiple Prisma instances in development environment
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// 详细记录数据库连接信息，便于调试
if (process.env.NODE_ENV === 'development') {
  console.log('=== 数据库连接详细信息 ===');
  // 显示完整的连接字符串，但隐藏密码部分
  const maskConnectionString = (url?: string) => {
    if (!url) return '[未设置]';
    try {
      return url.replace(/(:.[^:@]*)@/, ':****@');
    } catch (e) {
      return '[已设置但格式不正确]';
    }
  };
  
  console.log('POSTGRES_PRISMA_URL:', maskConnectionString(process.env.POSTGRES_PRISMA_URL));
  console.log('POSTGRES_URL:', maskConnectionString(process.env.POSTGRES_URL));
  console.log('POSTGRES_URL_NON_POOLING:', maskConnectionString(process.env.POSTGRES_URL_NON_POOLING));
  console.log('POSTGRES_HOST:', process.env.POSTGRES_HOST || '[未设置]');
  console.log('POSTGRES_USER:', process.env.POSTGRES_USER || '[未设置]');
  console.log('POSTGRES_DATABASE:', process.env.POSTGRES_DATABASE || '[未设置]');
  console.log('========================');
}

// 检查关键环境变量
if (!process.env.POSTGRES_PRISMA_URL) {
  console.warn(
    '警告: POSTGRES_PRISMA_URL 环境变量未设置。' +
    '这可能导致数据库连接问题。' +
    '请确保在环境或 .env 文件中设置此变量。'
  );
}

// 创建 Prisma 客户端实例并配置详细日志
let prismaInstance: PrismaClient;

// 使用环境变量中的连接字符串

try {
  // 使用全局变量或创建新实例
  prismaInstance =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      datasources: process.env.POSTGRES_PRISMA_URL
        ? {
            db: {
              url: process.env.POSTGRES_PRISMA_URL,
            },
          }
        : undefined, // 如果环境变量不存在，让 Prisma 使用 schema.prisma 中的默认配置
    });

  // 添加额外的错误处理中间件
  prismaInstance.$use(async (params, next) => {
    try {
      return await next(params);
    } catch (error) {
      console.error(`Prisma 查询失败 [${params.model}.${params.action}]:`, error);
      throw error;
    }
  });

  // 在开发环境中保存 Prisma 实例到全局对象
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaInstance;
  
  console.log('Prisma 客户端初始化成功');
} catch (error) {
  console.error('Prisma 客户端初始化失败:', error);
  // 创建一个错误 Prisma 实例，在调用时抛出有用的错误信息
  prismaInstance = new Proxy({} as PrismaClient, {
    get() {
      throw new Error('Prisma 客户端初始化失败，无法执行数据库操作');
    },
  });
  // 也更新全局实例，保持一致性
  globalForPrisma.prisma = prismaInstance;
}

export const prisma = prismaInstance;
export default prismaInstance;