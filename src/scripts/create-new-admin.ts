import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@admin.com';
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    // 先检查是否已存在此邮箱的管理员
    const existingAdmin = await prisma.admin.findFirst({
      where: { email }
    });
    
    if (existingAdmin) {
      console.log('管理员用户已存在:', existingAdmin.email);
      return;
    }
    
    // 创建新管理员用户
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name: 'Admin',
        role: 'admin',
      }
    });
    
    console.log('新管理员用户创建成功:', admin.email);
  } catch (error) {
    console.error('创建管理员用户失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 