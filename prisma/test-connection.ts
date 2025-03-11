import { PrismaClient } from '@prisma/client';

// 启用详细日志
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  try {
    console.log('正在测试数据库连接...');
    
    // 尝试执行一个简单的查询
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('数据库连接成功!', result);
    
    // 尝试获取表信息
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('数据库表:', tables);
    
  } catch (error) {
    console.error('数据库连接失败:', error);
  } finally {
    await prisma.$disconnect();
    console.log('已断开数据库连接');
  }
}

// 添加顶层错误处理
main()
  .then(() => console.log('脚本执行完成'))
  .catch(e => {
    console.error('脚本执行失败:', e);
    process.exit(1);
  }); 