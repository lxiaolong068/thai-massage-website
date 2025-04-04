import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const admins = await prisma.admin.findMany();
    console.log('Admin users:', JSON.stringify(admins, null, 2));
    console.log('Total admin users:', admins.length);
  } catch (error) {
    console.error('Failed to fetch admin users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 