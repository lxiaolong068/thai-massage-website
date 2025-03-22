// 加载环境变量
require('dotenv').config({ path: '.env.development' });

const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('正在连接数据库...');
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log('数据库连接成功:', result);
    
    // 检查数据库中的数据
    const therapistsCount = await prisma.therapist.count();
    const servicesCount = await prisma.service.count();
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
    
    // 检查按摩师数据
    if (therapistsCount > 0) {
      console.log('=== 按摩师数据示例 ===');
      const therapists = await prisma.therapist.findMany({
        take: 3,
        include: {
          translations: true
        }
      });
      therapists.forEach(t => {
        console.log(`- ID: ${t.id}, 工作状态: ${t.workStatus}, 经验年限: ${t.experienceYears}年`);
        const enTranslation = t.translations.find(tr => tr.locale === 'en');
        if (enTranslation) {
          console.log(`  名称(英文): ${enTranslation.name}`);
          console.log(`  专长: ${t.specialties.join(', ')}`);
        }
      });
      console.log('\n');
    }
    
    // 检查服务数据
    if (servicesCount > 0) {
      console.log('=== 服务数据示例 ===');
      const services = await prisma.service.findMany({
        take: 3,
        include: {
          translations: true
        }
      });
      services.forEach(s => {
        console.log(`- ID: ${s.id}, 价格: ${s.price}, 时长: ${s.duration}分钟`);
        const enTranslation = s.translations.find(tr => tr.locale === 'en');
        if (enTranslation) {
          console.log(`  名称(英文): ${enTranslation.name}`);
          console.log(`  描述: ${enTranslation.description.substring(0, 50)}${enTranslation.description.length > 50 ? '...' : ''}`);
        }
      });
      console.log('\n');
    }
    
    // 检查用户数据
    if (usersCount > 0) {
      console.log('=== 用户数据示例 ===');
      const users = await prisma.user.findMany({
        take: 3
      });
      users.forEach(u => {
        console.log(`- ID: ${u.id}, 邮箱: ${u.email}, 角色: ${u.role}`);
      });
      console.log('\n');
    }
    
    // 检查店铺设置数据
    if (shopSettingsCount > 0) {
      console.log('=== 店铺设置数据示例 ===');
      const settings = await prisma.shopSetting.findMany({
        take: 3,
        include: {
          translations: true
        }
      });
      settings.forEach(s => {
        console.log(`- 键: ${s.key}, 类型: ${s.type}`);
        const enTranslation = s.translations.find(tr => tr.locale === 'en');
        if (enTranslation) {
          console.log(`  值(英文): ${enTranslation.value}`);
        }
      });
      console.log('\n');
    }
    
    // 检查留言数据
    if (messagesCount > 0) {
      console.log('=== 留言数据示例 ===');
      const messages = await prisma.message.findMany({
        take: 3
      });
      messages.forEach(m => {
        console.log(`- 发送者: ${m.name}, 主题: ${m.subject}, 状态: ${m.status}`);
        console.log(`  内容: ${m.message.substring(0, 50)}${m.message.length > 50 ? '...' : ''}`);
      });
      console.log('\n');
    }
    
    // 检查预约数据
    if (bookingsCount > 0) {
      console.log('=== 预约数据示例 ===');
      const bookings = await prisma.booking.findMany({
        take: 3,
        include: {
          service: {
            include: {
              translations: true
            }
          },
          therapist: {
            include: {
              translations: true
            }
          }
        }
      });
      bookings.forEach(b => {
        const serviceTranslation = b.service?.translations.find(tr => tr.locale === 'en');
        const therapistTranslation = b.therapist?.translations.find(tr => tr.locale === 'en');
        const serviceName = serviceTranslation?.name || '未知服务';
        const therapistName = therapistTranslation?.name || '未知按摩师';
        console.log(`- 客户: ${b.customerName}, 日期: ${b.date.toISOString().split('T')[0]}, 时间: ${b.time}, 状态: ${b.status}`);
        console.log(`  服务: ${serviceName}, 按摩师: ${therapistName}`);
      });
      console.log('\n');
    }
  } catch (error) {
    console.error('数据库连接或查询失败:', error);
  } finally {
    await prisma.$disconnect();
    console.log('数据库连接已关闭');
  }
}

testConnection();
