import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 创建默认管理员用户
  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123'; // 请在生产环境中使用更强的密码

  // 检查管理员是否已存在
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    // 对密码进行哈希处理
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // 创建管理员用户
    await prisma.admin.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin',
        role: 'admin',
      },
    });

    console.log('Default admin user created');
  } else {
    console.log('Default admin user already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 