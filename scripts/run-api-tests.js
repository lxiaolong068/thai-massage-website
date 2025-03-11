/**
 * API测试运行脚本
 * 
 * 该脚本用于运行API测试
 * 1. 设置测试数据库
 * 2. 运行API测试
 * 3. 输出测试结果
 */

const { execSync } = require('child_process');
const dotenv = require('dotenv');

// 加载测试环境变量
dotenv.config({ path: '.env.test' });

// 设置环境变量
process.env.NODE_ENV = 'test';

console.log('🚀 开始运行API测试...');

try {
  // 设置测试数据库
  console.log('🔧 设置测试数据库...');
  execSync('node scripts/setup-test-db.js', { stdio: 'inherit' });
  
  // 运行API测试
  console.log('🧪 运行API测试...');
  execSync('npx jest --testPathPattern=src/__tests__/api', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'test' }
  });
  
  console.log('✅ API测试完成');
} catch (error) {
  console.error('❌ API测试失败:', error);
  process.exit(1);
} 