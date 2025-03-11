import { PrismaClient } from '@prisma/client';

// 初始化Prisma客户端
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function removeThaiTranslations() {
  console.log('开始删除泰语翻译记录...');

  try {
    // 检查数据库连接
    await prisma.$connect();
    console.log('数据库连接成功');

    // 先检查各表中泰语记录的数量
    const therapistCount = await prisma.therapistTranslation.count({
      where: { locale: 'th' },
    });
    console.log(`TherapistTranslation表中有 ${therapistCount} 条泰语记录`);

    const serviceCount = await prisma.serviceTranslation.count({
      where: { locale: 'th' },
    });
    console.log(`ServiceTranslation表中有 ${serviceCount} 条泰语记录`);

    const shopSettingCount = await prisma.shopSettingTranslation.count({
      where: { locale: 'th' },
    });
    console.log(`ShopSettingTranslation表中有 ${shopSettingCount} 条泰语记录`);

    // 1. 删除TherapistTranslation表中的泰语记录
    const deletedTherapistTranslations = await prisma.therapistTranslation.deleteMany({
      where: {
        locale: 'th',
      },
    });
    console.log(`已删除 ${deletedTherapistTranslations.count} 条按摩师泰语翻译记录`);

    // 2. 删除ServiceTranslation表中的泰语记录
    const deletedServiceTranslations = await prisma.serviceTranslation.deleteMany({
      where: {
        locale: 'th',
      },
    });
    console.log(`已删除 ${deletedServiceTranslations.count} 条服务泰语翻译记录`);

    // 3. 删除ShopSettingTranslation表中的泰语记录
    const deletedShopSettingTranslations = await prisma.shopSettingTranslation.deleteMany({
      where: {
        locale: 'th',
      },
    });
    console.log(`已删除 ${deletedShopSettingTranslations.count} 条店铺设置泰语翻译记录`);

    console.log('所有泰语翻译记录已成功删除');
  } catch (error) {
    console.error('删除泰语翻译记录时出错:', error);
    throw error;
  } finally {
    // 关闭Prisma连接
    await prisma.$disconnect();
    console.log('数据库连接已关闭');
  }
}

// 执行删除操作
removeThaiTranslations()
  .then(() => {
    console.log('脚本执行完成');
    process.exit(0);
  })
  .catch((error) => {
    console.error('脚本执行失败:', error);
    process.exit(1);
  });