// 直接运行 seed 脚本的内容
require('dotenv').config({ path: '.env.development' });
const { PrismaClient, BookingStatus, UserRole, MessageStatus } = require('@prisma/client');
const crypto = require('crypto');

async function main() {
  console.log('开始添加示例数据...');
  
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  
  try {
    // 测试连接
    console.log('正在测试数据库连接...');
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log(`数据库连接成功: ${JSON.stringify(result)}`);
    
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

    // 创建管理员用户
    console.log('正在创建管理员用户...');
    const adminPassword = crypto.createHash('sha256').update('admin123').digest('hex');
    const admin = await prisma.user.create({
      data: {
        email: 'admin@admin.com',
        passwordHash: adminPassword,
        name: 'Admin User',
        role: UserRole.ADMIN,
      },
    });
    console.log(`已创建管理员用户: ${admin.email}`);
    
    // 创建服务数据
    console.log('正在创建服务数据...');
    const service1 = await prisma.service.create({
      data: {
        price: 1500,
        duration: 60,
        imageUrl: 'https://example.com/thai-massage.jpg',
        translations: {
          create: [
            {
              locale: 'en',
              name: 'Thai Massage',
              description: 'Traditional Thai massage therapy',
              slug: 'thai-massage',
            },
            {
              locale: 'zh',
              name: '泰式按摩',
              description: '传统泰式按摩疗法',
              slug: 'thai-massage-zh',
            },
            {
              locale: 'ko',
              name: '타이 마사지',
              description: '전통적인 타이 마사지 요법',
              slug: 'thai-massage-ko',
            },
          ],
        },
      },
    });
    console.log(`已创建服务: ${service1.id}`);

    const service2 = await prisma.service.create({
      data: {
        price: 2000,
        duration: 90,
        imageUrl: 'https://example.com/oil-massage.jpg',
        translations: {
          create: [
            {
              locale: 'en',
              name: 'Oil Massage',
              description: 'Relaxing oil massage therapy',
              slug: 'oil-massage',
            },
            {
              locale: 'zh',
              name: '精油按摩',
              description: '放松精油按摩疗法',
              slug: 'oil-massage-zh',
            },
            {
              locale: 'ko',
              name: '오일 마사지',
              description: '편안한 오일 마사지 요법',
              slug: 'oil-massage-ko',
            },
          ],
        },
      },
    });
    console.log(`已创建服务: ${service2.id}`);
    
    // 创建按摩师数据
    console.log('正在创建按摩师数据...');
    const therapist1 = await prisma.therapist.create({
      data: {
        imageUrl: 'https://example.com/therapist1.jpg',
        specialties: ['Thai Massage', 'Oil Massage'],
        experienceYears: 5,
        workStatus: 'AVAILABLE',
        translations: {
          create: [
            {
              locale: 'en',
              name: 'Somchai',
              bio: 'Experienced massage therapist from Chiang Mai',
              specialtiesTranslation: ['Thai Massage', 'Oil Massage'],
            },
            {
              locale: 'zh',
              name: '宋猜',
              bio: '来自清迈的经验丰富的按摩师',
              specialtiesTranslation: ['泰式按摩', '精油按摩'],
            },
            {
              locale: 'ko',
              name: '솜차이',
              bio: '치앙마이 출신의 경험이 풍부한 마사지 치료사',
              specialtiesTranslation: ['타이 마사지', '오일 마사지'],
            },
          ],
        },
      },
    });
    console.log(`已创建按摩师: ${therapist1.id}`);

    const therapist2 = await prisma.therapist.create({
      data: {
        imageUrl: 'https://example.com/therapist2.jpg',
        specialties: ['Oil Massage'],
        experienceYears: 3,
        workStatus: 'WORKING',
        translations: {
          create: [
            {
              locale: 'en',
              name: 'Nattaya',
              bio: 'Skilled oil massage specialist',
              specialtiesTranslation: ['Oil Massage'],
            },
            {
              locale: 'zh',
              name: '娜塔雅',
              bio: '精通精油按摩的专家',
              specialtiesTranslation: ['精油按摩'],
            },
            {
              locale: 'ko',
              name: '나타야',
              bio: '숙련된 오일 마사지 전문가',
              specialtiesTranslation: ['오일 마사지'],
            },
          ],
        },
      },
    });
    console.log(`已创建按摩师: ${therapist2.id}`);
    
    // 创建店铺设置
    console.log('正在创建店铺设置...');
    const shopName = await prisma.shopSetting.create({
      data: {
        key: 'shop_name',
        type: 'TEXT',
        translations: {
          create: [
            {
              locale: 'en',
              value: 'Thai Massage Spa',
            },
            {
              locale: 'zh',
              value: '泰式按摩水疗中心',
            },
            {
              locale: 'ko',
              value: '타이 마사지 스파',
            },
          ],
        },
      },
    });
    console.log(`已创建店铺设置: ${shopName.key}`);

    const shopAddress = await prisma.shopSetting.create({
      data: {
        key: 'shop_address',
        type: 'TEXT',
        translations: {
          create: [
            {
              locale: 'en',
              value: '123 Spa Street, Bangkok, Thailand',
            },
            {
              locale: 'zh',
              value: '泰国曼谷水疗街123号',
            },
            {
              locale: 'ko',
              value: '태국 방콕 스파 거리 123',
            },
          ],
        },
      },
    });
    console.log(`已创建店铺设置: ${shopAddress.key}`);
    
    // 创建预约示例
    console.log('正在创建预约示例...');
    const booking1 = await prisma.booking.create({
      data: {
        customerName: 'John Smith',
        customerEmail: 'john@example.com',
        customerPhone: '+1 123-456-7890',
        date: new Date('2023-05-15'),
        time: '14:00',
        status: BookingStatus.CONFIRMED,
        serviceId: service1.id,
        therapistId: therapist1.id,
        notes: 'First time visitor',
      },
    });
    console.log(`已创建预约: ${booking1.id}`);
    
    // 创建留言示例
    console.log('正在创建留言示例...');
    const message1 = await prisma.message.create({
      data: {
        name: 'Robert Johnson',
        email: 'robert@example.com',
        phone: '+1 123 456 7890',
        subject: 'Question about services',
        message: 'I would like to know more about your aromatherapy massage. What essential oils do you use?',
        status: MessageStatus.UNREAD,
      },
    });
    console.log(`已创建留言: ${message1.id}`);
    
    // 检查数据
    const servicesCount = await prisma.service.count();
    const therapistsCount = await prisma.therapist.count();
    const usersCount = await prisma.user.count();
    const shopSettingsCount = await prisma.shopSetting.count();
    const messagesCount = await prisma.message.count();
    const bookingsCount = await prisma.booking.count();
    
    console.log('\n=== 数据库统计信息 ===');
    console.log(`按摩师: ${therapistsCount} 条记录`);
    console.log(`服务: ${servicesCount} 条记录`);
    console.log(`用户: ${usersCount} 条记录`);
    console.log(`店铺设置: ${shopSettingsCount} 条记录`);
    console.log(`留言: ${messagesCount} 条记录`);
    console.log(`预约: ${bookingsCount} 条记录`);
    console.log('===========================\n');
    
    console.log('示例数据添加完成！');
  } catch (error) {
    console.error(`添加示例数据时出错: ${error}`);
    console.error(`错误详情: ${JSON.stringify(error, null, 2)}`);
    throw error;
  } finally {
    await prisma.$disconnect();
    console.log('数据库连接已关闭');
  }
}

main()
  .catch((e) => {
    console.error(`添加示例数据时出错: ${e}`);
    process.exit(1);
  });
