import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

async function main() {
  try {
    console.log('正在检查按摩师数据...');
    console.log('数据库 URL:', process.env.DATABASE_URL);
    
    // 检查数据库连接
    await prisma.$connect();
    console.log('数据库连接成功');
    
    // 检查表是否存在
    const tables = await prisma.$queryRaw`
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public';
    `;
    console.log('数据库表:');
    console.dir(tables, { depth: null });
    
    // 检查 therapists 表的结构
    const tableInfo = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'therapists';
    `;
    console.log('therapists 表结构:');
    console.dir(tableInfo, { depth: null });
    
    const therapists = await prisma.therapist.findMany({
      include: {
        translations: true
      }
    });
    
    console.log(`数据库中共有 ${therapists.length} 个按摩师记录`);
    
    if (therapists.length > 0) {
      console.log('按摩师数据:');
      console.dir(therapists, { depth: null });
    } else {
      console.log('数据库中没有按摩师数据');
      
      // 检查是否有其他表的数据
      const serviceCount = await prisma.service.count();
      const userCount = await prisma.user.count();
      const translationCount = await prisma.therapistTranslation.count();
      
      console.log('其他表的数据统计:');
      console.log('- 服务数量:', serviceCount);
      console.log('- 用户数量:', userCount);
      console.log('- 按摩师翻译数量:', translationCount);
      
      // 检查最近的数据库操作
      const recentLogs = await prisma.$queryRaw`
        SELECT 
          sequence_name,
          last_value,
          is_called
        FROM 
          pg_sequences
        WHERE 
          schemaname = 'public';
      `;
      console.log('序列信息:');
      console.dir(recentLogs, { depth: null });
    }
  } catch (error) {
    console.error('检查数据时出错:', error);
    if (error instanceof Error) {
      console.error('错误详情:', error.message);
      console.error('错误堆栈:', error.stack);
    }
  } finally {
    await prisma.$disconnect();
    console.log('数据库连接已关闭');
  }
}

main(); 