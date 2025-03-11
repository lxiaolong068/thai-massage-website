import { PrismaClient } from '@prisma/client/index';
import * as fs from 'fs';

// 创建一个日志文件
const logFile = fs.createWriteStream('./prisma-check.log', { flags: 'w' });

// 重定向输出到文件
const log = (message: string) => {
  logFile.write(message + '\n');
  process.stdout.write(message + '\n');
};

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  log('开始检查数据...');
  
  try {
    log('连接到数据库...');
    
    // 检查服务数据
    const servicesCount = await prisma.service.count();
    log(`服务数量: ${servicesCount}`);

    // 检查按摩师数据
    const therapistsCount = await prisma.therapist.count();
    log(`按摩师数量: ${therapistsCount}`);

    // 检查用户数据
    const usersCount = await prisma.user.count();
    log(`用户数量: ${usersCount}`);

    // 检查预约数据
    const bookingsCount = await prisma.booking.count();
    log(`预约数量: ${bookingsCount}`);

    // 检查留言数据
    const messagesCount = await prisma.message.count();
    log(`留言数量: ${messagesCount}`);

    // 检查店铺设置数据
    const shopSettingsCount = await prisma.shopSetting.count();
    log(`店铺设置数量: ${shopSettingsCount}`);

    // 获取一些示例数据
    if (servicesCount > 0) {
      const services = await prisma.service.findMany({
        take: 2,
        include: {
          translations: {
            where: {
              locale: 'zh',
            },
          },
        },
      });
      log('服务示例: ' + JSON.stringify(services.map(s => ({
        id: s.id,
        price: s.price,
        name: s.translations[0]?.name,
      })), null, 2));
    }

    if (therapistsCount > 0) {
      const therapists = await prisma.therapist.findMany({
        take: 2,
        include: {
          translations: {
            where: {
              locale: 'zh',
            },
          },
        },
      });
      log('按摩师示例: ' + JSON.stringify(therapists.map(t => ({
        id: t.id,
        name: t.translations[0]?.name,
        experienceYears: t.experienceYears,
      })), null, 2));
    }
    
    log('数据检查完成！');
  } catch (error) {
    log('检查数据时出错: ' + JSON.stringify(error));
  } finally {
    log('断开数据库连接...');
    await prisma.$disconnect();
  }
}

// 添加顶层错误处理
main()
  .then(() => {
    log('脚本执行完成');
    logFile.end();
  })
  .catch(e => {
    log('脚本执行失败: ' + JSON.stringify(e));
    logFile.end();
    process.exit(1);
  }); 