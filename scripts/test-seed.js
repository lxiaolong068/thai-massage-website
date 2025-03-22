const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.development' });

async function testSeed() {
  console.log('开始测试数据库连接和数据导入...');
  console.log('当前环境变量：', process.env.DATABASE_URL);
  
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    // 测试连接
    console.log('正在测试数据库连接...');
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log('数据库连接成功:', result);

    // 清理现有数据
    console.log('正在清理现有数据...');
    await prisma.booking.deleteMany({});
    await prisma.serviceTranslation.deleteMany({});
    await prisma.service.deleteMany({});
    await prisma.therapistTranslation.deleteMany({});
    await prisma.therapist.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.shopSettingTranslation.deleteMany({});
    await prisma.shopSetting.deleteMany({});
    await prisma.message.deleteMany({});
    console.log('已清理现有数据');

    // 创建一个简单的服务
    console.log('正在创建测试服务...');
    const service = await prisma.service.create({
      data: {
        price: 1000,
        duration: 60,
        imageUrl: 'https://example.com/test.jpg',
        translations: {
          create: [
            {
              locale: 'en',
              name: 'Test Service',
              description: 'Test service description',
              slug: 'test-service',
            },
          ],
        },
      },
    });
    console.log('已创建测试服务:', service.id);

    // 创建一个简单的按摩师
    console.log('正在创建测试按摩师...');
    const therapist = await prisma.therapist.create({
      data: {
        imageUrl: 'https://example.com/therapist.jpg',
        specialties: ['Test Service'],
        experienceYears: 5,
        workStatus: 'AVAILABLE',
        translations: {
          create: [
            {
              locale: 'en',
              name: 'Test Therapist',
              bio: 'Test therapist bio',
              specialtiesTranslation: ['Test Service'],
            },
          ],
        },
      },
    });
    console.log('已创建测试按摩师:', therapist.id);

    // 检查数据
    const servicesCount = await prisma.service.count();
    const therapistsCount = await prisma.therapist.count();
    console.log(`数据库中有 ${therapistsCount} 个按摩师记录`);
    console.log(`数据库中有 ${servicesCount} 个服务记录`);

  } catch (error) {
    console.error('测试过程中出错:', error);
  } finally {
    await prisma.$disconnect();
    console.log('数据库连接已关闭');
  }
}

testSeed()
  .catch(console.error);
