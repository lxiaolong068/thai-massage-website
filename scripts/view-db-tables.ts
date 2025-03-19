import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // 获取所有按摩师数据
    console.log('===== 按摩师数据 =====');
    const therapists = await prisma.therapist.findMany({
      include: {
        translations: true,
      },
    });
    console.log(`共有 ${therapists.length} 位按摩师`);
    if (therapists.length > 0) {
      console.log(JSON.stringify(therapists[0], null, 2));
    }

    // 获取所有服务数据
    console.log('\n===== 服务数据 =====');
    const services = await prisma.service.findMany({
      include: {
        translations: true,
      },
    });
    console.log(`共有 ${services.length} 个服务`);
    if (services.length > 0) {
      console.log(JSON.stringify(services[0], null, 2));
    }

    // 获取所有预约数据
    console.log('\n===== 预约数据 =====');
    const bookings = await prisma.booking.findMany();
    console.log(`共有 ${bookings.length} 个预约`);
    if (bookings.length > 0) {
      console.log(JSON.stringify(bookings[0], null, 2));
    }

    // 获取所有用户数据
    console.log('\n===== 用户数据 =====');
    const users = await prisma.user.findMany();
    console.log(`共有 ${users.length} 个用户`);
    if (users.length > 0) {
      // 出于安全考虑，不显示密码哈希
      const userWithoutPassword = { ...users[0], passwordHash: '******' };
      console.log(JSON.stringify(userWithoutPassword, null, 2));
    }

    // 获取所有商店设置数据
    console.log('\n===== 商店设置数据 =====');
    const shopSettings = await prisma.shopSetting.findMany({
      include: {
        translations: true,
      },
    });
    console.log(`共有 ${shopSettings.length} 个商店设置`);
    if (shopSettings.length > 0) {
      console.log(JSON.stringify(shopSettings[0], null, 2));
    }

    // 获取所有留言数据
    console.log('\n===== 留言数据 =====');
    const messages = await prisma.message.findMany();
    console.log(`共有 ${messages.length} 条留言`);
    if (messages.length > 0) {
      console.log(JSON.stringify(messages[0], null, 2));
    }

  } catch (error) {
    console.error('查询数据库时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
