/**
 * 测试数据库设置脚本
 * 
 * 该脚本用于在运行测试前设置测试数据库
 * 1. 创建测试数据库（如果不存在）
 * 2. 应用Prisma迁移
 * 3. 清空所有表
 */

const { execSync } = require('child_process');
const { Client } = require('pg');
const dotenv = require('dotenv');

// 加载测试环境变量
dotenv.config({ path: '.env.test' });

async function setupTestDatabase() {
  console.log('🔧 设置测试数据库...');

  // 连接到PostgreSQL
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'test',
    password: 'test',
    database: 'postgres', // 连接到默认数据库
  });

  try {
    await client.connect();
    console.log('✅ 已连接到PostgreSQL');

    // 检查测试数据库是否存在
    const dbCheckResult = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'thai_massage_test'"
    );

    // 如果测试数据库不存在，则创建
    if (dbCheckResult.rowCount === 0) {
      console.log('🔧 创建测试数据库: thai_massage_test');
      await client.query('CREATE DATABASE thai_massage_test');
      console.log('✅ 测试数据库已创建');
    } else {
      console.log('✅ 测试数据库已存在');
    }

    // 关闭连接
    await client.end();
    console.log('✅ 已断开与PostgreSQL的连接');

    // 应用Prisma迁移
    console.log('🔧 应用Prisma迁移...');
    execSync('npx prisma migrate deploy', {
      env: { ...process.env, NODE_ENV: 'test' },
      stdio: 'inherit',
    });
    console.log('✅ Prisma迁移已应用');

    console.log('✅ 测试数据库设置完成');
  } catch (error) {
    console.error('❌ 设置测试数据库时出错:', error);
    process.exit(1);
  }
}

// 运行设置
setupTestDatabase(); 