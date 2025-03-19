import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径（ESM兼容）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 初始化Prisma客户端
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('开始执行数据库迁移...');
    
    // 读取SQL迁移文件
    const sqlPath = path.join(__dirname, 'migrations', 'add_therapist_status.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // 分割SQL语句并逐条执行
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      console.log(`执行SQL: ${statement}`);
      // 使用Prisma执行原始SQL
      await prisma.$executeRawUnsafe(`${statement};`);
    }
    
    console.log('数据库迁移成功完成！');
    
    // 更新所有现有按摩师的状态为"空闲"
const updatedCount = await prisma.therapist.updateMany({
  data: {
    workStatus: 'AVAILABLE' as const
  }
});
    
    console.log(`已更新 ${updatedCount.count} 名按摩师的状态为"空闲"`);
    
  } catch (error) {
    console.error('数据库迁移失败:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
