import { PrismaClient } from '@prisma/client/index';
import prisma from '@/lib/prisma';

/**
 * 清空测试数据库中的所有表
 */
export async function clearDatabase() {
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"public"."${name}"`)
    .join(', ');

  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
  } catch (error) {
    console.log({ error });
  }
}

/**
 * 创建测试数据
 */
export async function seedTestData() {
  // 创建测试服务
  const service = await prisma.service.create({
    data: {
      price: 1000,
      duration: 60,
      imageUrl: '/images/services/test-service.jpg',
      translations: {
        create: [
          {
            locale: 'en',
            name: 'Test Service',
            description: 'This is a test service',
            slug: 'test-service',
          },
          {
            locale: 'zh',
            name: '测试服务',
            description: '这是一个测试服务',
            slug: 'test-service',
          },
        ],
      },
    },
  });

  // 创建测试按摩师
  const therapist = await prisma.therapist.create({
    data: {
      imageUrl: '/images/therapists/test-therapist.jpg',
      specialties: ['Swedish', 'Thai'],
      experienceYears: 5,
      translations: {
        create: [
          {
            locale: 'en',
            name: 'Test Therapist',
            bio: 'This is a test therapist',
            specialtiesTranslation: ['Swedish Massage', 'Thai Massage'],
          },
          {
            locale: 'zh',
            name: '测试按摩师',
            bio: '这是一个测试按摩师',
            specialtiesTranslation: ['瑞典按摩', '泰式按摩'],
          },
        ],
      },
    },
  });

  // 创建测试预约
  const booking = await prisma.booking.create({
    data: {
      serviceId: service.id,
      therapistId: therapist.id,
      date: new Date('2023-12-31'),
      time: '14:00',
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      customerPhone: '1234567890',
      status: 'PENDING',
    },
  });

  // 创建测试用户
  const user = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      passwordHash: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // 密码是 'password'
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  return {
    service,
    therapist,
    booking,
    user,
  };
}

/**
 * 获取一个独立的Prisma客户端实例，用于测试
 */
export function getTestPrismaClient() {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.POSTGRES_PRISMA_URL,
      },
    },
  });
} 