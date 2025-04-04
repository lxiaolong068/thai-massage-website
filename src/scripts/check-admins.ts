import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

function log(message: string) {
  process.stdout.write(message + '\n');
}

async function main() {
  try {
    log('正在查询管理员用户...');
    const admins = await prisma.admin.findMany();
    
    if (admins.length === 0) {
      log('警告：数据库中没有管理员用户！');
    } else {
      log('管理员用户列表:');
      admins.forEach(admin => {
        log(`- ${admin.email} (${admin.name})`);
      });
      log(`共 ${admins.length} 个管理员用户`);
    }

    // 等待一会儿确保日志输出
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (error) {
    process.stderr.write('获取管理员用户失败: ' + error + '\n');
  } finally {
    await prisma.$disconnect();
  }
}

main(); 