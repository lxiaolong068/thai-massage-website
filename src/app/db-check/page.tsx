import { cache } from 'react';
import { PrismaClient, Prisma } from '@prisma/client';

// 创建一个新的Prisma客户端实例，避免使用全局单例
const createPrismaClient = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.POSTGRES_URL_NON_POOLING, // 使用非连接池URL
      },
    },
  });
};

// 定义返回数据类型
type DataResult = {
  success: true;
  tables: any[];
  counts: Record<string, number>;
  examples: Record<string, any[]>;
} | {
  success: false;
  error: string;
};

// 使用React的cache函数来缓存数据库查询
const getData = cache(async (): Promise<DataResult> => {
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
    
    return {
      success: true,
      tables,
      counts,
      examples,
    };
  } catch (error) {
    console.error('数据库查询出错:', error);
    return {
      success: false,
      error: String(error),
    };
  } finally {
    await prisma.$disconnect();
  }
});

export default async function DbCheckPage() {
  const data = await getData();
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">数据库检查</h1>
      
      {data.success ? (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">数据库表</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.tables.map((table: any) => (
                <div key={table.table_name} className="bg-white p-4 rounded shadow">
                  <div className="text-lg font-medium">{table.table_name}</div>
                  <div className="text-2xl font-bold">{data.counts[table.table_name] || 0}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">表数据示例</h2>
            {Object.entries(data.examples).map(([tableName, examples]) => (
              <div key={tableName} className="mb-4">
                <h3 className="text-lg font-medium mb-2">{tableName}</h3>
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                  {JSON.stringify(examples, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-red-100 text-red-700 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">错误</h2>
          <pre className="whitespace-pre-wrap">{data.error}</pre>
        </div>
      )}
    </div>
  );
} 