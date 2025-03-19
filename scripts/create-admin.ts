import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('开始创建管理员用户...');
    
    // 先删除所有现有用户（可选，谨慎使用）
    console.log('清理现有用户数据...');
    await prisma.user.deleteMany({});
    console.log('现有用户数据已清理');
    
    // 创建管理员密码哈希
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    // 创建管理员用户
    const admin = await prisma.user.create({
      data: {
        email: 'admin@admin.com',
        passwordHash: adminPassword,
        name: 'Admin User',
        role: UserRole.ADMIN,
      },
    });
    
    console.log('管理员用户创建成功:');
    console.log(`- ID: ${admin.id}`);
    console.log(`- 邮箱: ${admin.email}`);
    console.log(`- 名称: ${admin.name}`);
    console.log(`- 角色: ${admin.role}`);
    console.log('请使用以下凭据登录:');
    console.log('邮箱: admin@admin.com');
    console.log('密码: admin123');
    
  } catch (error) {
    console.error('创建管理员用户时出错:', error);
  } finally {
    await prisma.$disconnect();
    console.log('数据库连接已断开');
  }
}

// 执行主函数
main()
  .catch((e) => {
    console.error('脚本执行出错:', e);
    process.exit(1);
  })
  .finally(() => {
    console.log('脚本执行完毕');
  });
