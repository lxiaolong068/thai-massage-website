import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  try {
    // 先检查是否已存在管理员
    const existingAdmin = await prisma.admin.findFirst({
      where: { email: 'admin@example.com' }
    });
    
    if (existingAdmin) {
      console.log('管理员用户已存在:', existingAdmin.email);
      return;
    }
    
    // 创建管理员用户
    const admin = await prisma.admin.create({
      data: {
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Admin',
        role: 'admin',
      }
    });
    
    console.log('管理员用户创建成功:', admin);
  } catch (error) {
    console.error('创建管理员用户失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 