import { PrismaClient, Prisma } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

async function main() {
  try {
    console.log('开始执行 SQL 种子脚本 (v3 - 逐条执行)...');
    console.log('数据库 URL:', process.env.DATABASE_URL);

    // 检查数据库连接
    await prisma.$connect();
    console.log('数据库连接成功');

    // 读取 SQL 文件内容
    const sqlFilePath = path.join(process.cwd(), 'prisma', 'seed', 'therapists.sql');
    console.log('尝试读取 SQL 文件路径 (基于 process.cwd()):', sqlFilePath);

    if (!fs.existsSync(sqlFilePath)) {
      console.error(`错误: SQL 文件未找到: ${sqlFilePath}`);
      throw new Error(`SQL 文件未找到: ${sqlFilePath}`);
    }
    console.log('SQL 文件存在，开始读取...');

    const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');
    console.log('SQL 文件读取成功.');

    if (!sqlContent || sqlContent.trim().length === 0) {
      console.error('错误: SQL 文件为空或只包含空白字符.');
      throw new Error('SQL 文件内容为空.');
    }

    // 改进 SQL 语句分割：先移除注释行和空行，再按分号分割
    const sqlStatements = sqlContent
      .split('\n') // 1. 按行分割
      .map(line => line.trim()) // 2. 去除每行首尾空格
      .filter(line => line.length > 0 && !line.startsWith('--')) // 3. 过滤空行和注释行
      .join('\n') // 4. 将有效行重新连接成一个字符串
      .split(';') // 5. 按分号分割语句
      .map(sql => sql.trim()) // 6. 去除每个语句的首尾空格
      .filter(sql => sql.length > 0); // 7. 过滤掉最终的空语句

    console.log(`共找到 ${sqlStatements.length} 条有效 SQL 语句进行执行`);

    // 逐条执行 SQL 语句
    console.log('开始逐条执行 SQL 语句...');
    for (let i = 0; i < sqlStatements.length; i++) {
      const sql = sqlStatements[i];
      // 注意：这里不再添加 trim()，因为上面 map 时已经处理过
      console.log(`\n正在执行语句 ${i + 1}/${sqlStatements.length}:\n${sql}`);
      try {
        // 使用 $executeRawUnsafe 执行单条语句
        const result = await prisma.$executeRawUnsafe(sql);
        console.log(`语句 ${i + 1} 执行成功，影响行数:`, result);
      } catch (error) {
        console.error(`执行语句 ${i + 1} 时出错: ${sql}`, error);
        // 遇到错误时抛出并停止
        throw error;
      }
    }

    console.log('\nSQL 种子脚本 (v3 - 逐条执行) 完成！');

  } catch (error) {
    console.error('执行 SQL 种子脚本 (v3) 时出错:', error);
    if (error instanceof Error) {
      console.error('错误详情:', error.message);
      console.error('错误堆栈:', error.stack);
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('数据库错误代码:', error.code);
      console.error('错误元数据:', error.meta);
    }
    throw error;
  } finally {
    await prisma.$disconnect();
    console.log('数据库连接已关闭');
  }
}

main()
  .catch((e) => {
    process.exit(1);
  }); 