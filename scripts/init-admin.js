// 简单的JavaScript脚本，使用console.log确保输出可见
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('===== 开始初始化管理员数据 =====');
    
    // 清理现有用户
    await prisma.user.deleteMany({});
    console.log('已清理现有用户数据');
    
    // 创建管理员密码
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    // 创建管理员用户
    const admin = await prisma.user.create({
      data: {
        email: 'admin@admin.com',
        passwordHash: adminPassword,
        name: '管理员',
        role: 'ADMIN',
      },
    });
    
    console.log('管理员创建成功:');
    console.log(JSON.stringify(admin, null, 2));
    console.log('登录凭据:');
    console.log('- 邮箱: admin@admin.com');
    console.log('- 密码: admin123');
    
  } catch (error) {
    console.error('创建管理员时出错:', error);
  } finally {
    await prisma.$disconnect();
    console.log('===== 初始化完成 =====');
  }
}

main();
