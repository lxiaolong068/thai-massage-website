import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  try {
    console.log('===== 开始查询数据库 =====');
    console.log('数据库连接URL:', process.env.POSTGRES_PRISMA_URL ? '已设置' : '未设置');
    
    // 检查数据库连接
    console.log('正在测试数据库连接...');
    await prisma.$connect();
    console.log('数据库连接成功！');
    
    // 查询用户数据
    console.log('正在查询用户数据...');
    const users = await prisma.user.findMany();
    
    console.log('查询完成，结果如下:');
    if (users.length === 0) {
      console.log('数据库中没有用户数据');
      
      // 如果没有用户，尝试创建一个测试用户
      console.log('尝试创建测试管理员用户...');
      const bcrypt = await import('bcrypt');
      const adminPassword = await bcrypt.hash('admin123', 10);
      
      const admin = await prisma.user.create({
        data: {
          email: 'admin@admin.com',
          passwordHash: adminPassword,
          name: 'Admin User',
          role: 'ADMIN',
        },
      });
      
      console.log('测试管理员用户创建成功:', admin);
    } else {
      console.log(`数据库中有 ${users.length} 个用户:`);
      users.forEach(user => {
        console.log(`- ID: ${user.id}, 邮箱: ${user.email}, 名称: ${user.name}, 角色: ${user.role}`);
      });
    }
    
    // 延迟一下，确保所有输出都被显示
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('===== 查询结束 =====');
    
  } catch (error) {
    console.error('查询数据库时出错:', error);
  } finally {
    await prisma.$disconnect();
    console.log('数据库连接已断开');
  }
}

// 确保异步错误被正确处理
main()
  .catch(e => {
    console.error('脚本执行出错:', e);
    process.exit(1);
  })
  .finally(() => {
    console.log('脚本执行完毕');
  });
