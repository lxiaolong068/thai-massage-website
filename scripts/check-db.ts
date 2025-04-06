import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

async function main() {
  try {
    console.log('正在检查数据库连接...');
    console.log('数据库 URL:', process.env.DATABASE_URL);

    // 检查数据库连接
    await prisma.$connect();
    console.log('数据库连接成功');

    // 检查表是否存在
    const tables = await prisma.$queryRaw`
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public';
    `;
    console.log('\n数据库表:');
    console.dir(tables, { depth: null });

    // 检查 therapists 表的数据
    const therapistsCount = await prisma.therapist.count();
    console.log('\n按摩师数量:', therapistsCount);

    if (therapistsCount > 0) {
      const therapists = await prisma.therapist.findMany({
        include: {
          translations: true
        }
      });

      therapists.forEach(therapist => {
        console.log(`\n按摩师 ${therapist.id}:`);
        console.log('- 图片:', therapist.imageUrl);
        console.log('- 专长:', therapist.specialties);
        console.log('- 工作状态:', therapist.workStatus);
        console.log('- 翻译:');
        therapist.translations.forEach(trans => {
          console.log(`  ${trans.locale}: ${trans.name}`);
        });
      });
    }

    // 检查 translations 表的数据
    const translationsCount = await prisma.therapistTranslation.count();
    console.log('\n翻译数量:', translationsCount);

    if (translationsCount > 0) {
      const translations = await prisma.therapistTranslation.findMany();
      console.log('\n翻译数据:');
      console.dir(translations, { depth: null });
    }

  } catch (error) {
    console.error('检查数据库时出错:', error);
    if (error instanceof Error) {
      console.error('错误详情:', error.message);
      console.error('错误堆栈:', error.stack);
    }
  } finally {
    await prisma.$disconnect();
    console.log('\n数据库连接已关闭');
  }
}

main(); 