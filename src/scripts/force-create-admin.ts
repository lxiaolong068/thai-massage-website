import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

function log(message: string) {
  process.stdout.write(message + '\n');
}

async function main() {
  try {
    log('开始创建管理员用户...');
    
    // 删除现有管理员
    await prisma.admin.deleteMany();
    log('已删除所有管理员用户');
    
    // 创建新管理员
    const password = await bcrypt.hash('admin123', 10);
    const admin = await prisma.admin.create({
      data: {
        email: 'admin@admin.com',
        password,
        name: 'Admin',
        role: 'admin',
      }
    });
    
    log('成功创建管理员用户:');
    log(JSON.stringify(admin, null, 2));

    // 等待一会儿确保日志输出
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (error) {
    process.stderr.write('创建管理员失败: ' + error + '\n');
  } finally {
    await prisma.$disconnect();
  }
}

main(); 