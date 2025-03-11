import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client/index';

// 创建一个新的Prisma客户端实例，避免使用全局单例
const createPrismaClient = () => {
  try {
    return new PrismaClient({
      datasources: process.env.POSTGRES_PRISMA_URL
        ? {
            db: {
              url: process.env.POSTGRES_PRISMA_URL,
            },
          }
        : undefined, // 如果环境变量不存在，让Prisma使用schema.prisma中的默认配置
    });
  } catch (error) {
    console.error('创建Prisma客户端失败:', error);
    throw error;
  }
};

export async function GET(request: NextRequest) {
  const prisma = createPrismaClient();
  
  try {
    // 获取表信息
    const tablesResult = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    const tables = Array.isArray(tablesResult) ? tablesResult : [];
    
    // 存储计数和示例数据
    const counts: Record<string, number> = {};
    const examples: Record<string, any[]> = {};
    
    // 对每个表执行查询
    for (const table of tables) {
      const tableName = table.table_name;
      
      try {
        // 构建安全的SQL查询 - 使用动态SQL
        // 注意：我们需要使用Prisma.raw来安全地构建包含表名的SQL
        const countQuery = Prisma.sql`SELECT COUNT(*) as count FROM "${Prisma.raw(tableName)}"`;
        const countResult: any[] = await prisma.$queryRaw(countQuery);
        
        counts[tableName] = parseInt(countResult[0]?.count || '0');
        
        // 获取示例数据
        if (counts[tableName] > 0) {
          const sampleQuery = Prisma.sql`SELECT * FROM "${Prisma.raw(tableName)}" LIMIT 2`;
          const sampleResult: any[] = await prisma.$queryRaw(sampleQuery);
          
          examples[tableName] = sampleResult;
        }
      } catch (err) {
        console.error(`查询表 ${tableName} 时出错:`, err);
      }
    }
    
    return NextResponse.json({
      success: true,
      tables,
      counts,
      examples,
    });
  } catch (error) {
    console.error('API路由出错:', error);
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 