import { PrismaClient } from '@prisma/client/index';

async function main() {
  process.stdout.write('开始直接查询数据库...\n');
  
  // 每次创建新的Prisma客户端实例
  const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
  });
  
  try {
    process.stdout.write('连接到数据库...\n');
    
    // 执行简单查询测试连接
    const testResult = await prisma.$queryRaw`SELECT 1 as test`;
    process.stdout.write(`测试查询结果: ${JSON.stringify(testResult)}\n`);
    
    // 获取表信息
    const tablesResult = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    process.stdout.write(`数据库表: ${JSON.stringify(tablesResult)}\n`);
    
    // 尝试查询服务表
    try {
      const servicesCount = await prisma.$queryRaw`SELECT COUNT(*) FROM "services"`;
      process.stdout.write(`服务数量: ${JSON.stringify(servicesCount)}\n`);
      
      const services = await prisma.$queryRaw`SELECT * FROM "services" LIMIT 2`;
      process.stdout.write(`服务示例: ${JSON.stringify(services)}\n`);
    } catch (err) {
      process.stdout.write(`查询服务表失败: ${err instanceof Error ? err.message : String(err)}\n`);
    }
    
    // 尝试查询按摩师表
    try {
      const therapistsCount = await prisma.$queryRaw`SELECT COUNT(*) FROM "therapists"`;
      process.stdout.write(`按摩师数量: ${JSON.stringify(therapistsCount)}\n`);
      
      const therapists = await prisma.$queryRaw`SELECT * FROM "therapists" LIMIT 2`;
      process.stdout.write(`按摩师示例: ${JSON.stringify(therapists)}\n`);
    } catch (err) {
      process.stdout.write(`查询按摩师表失败: ${err instanceof Error ? err.message : String(err)}\n`);
    }
    
    process.stdout.write('查询完成\n');
  } catch (error) {
    process.stdout.write(`查询出错: ${error instanceof Error ? error.message : String(error)}\n`);
  } finally {
    await prisma.$disconnect();
    process.stdout.write('断开数据库连接\n');
  }
}

main()
  .then(() => {
    process.stdout.write('脚本执行完成\n');
    process.exit(0);
  })
  .catch(e => {
    process.stderr.write(`脚本执行失败: ${e}\n`);
    process.exit(1);
  }); 