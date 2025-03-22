const { execSync } = require('child_process');
const path = require('path');

try {
  console.log('开始运行 seed 脚本...');
  
  // 运行 seed 脚本并捕获输出
  const output = execSync('npx ts-node prisma/seed/index.ts', {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'pipe',
    encoding: 'utf-8'
  });
  
  console.log('Seed 脚本输出:');
  console.log(output);
  
  // 检查数据库中的记录数
  const checkOutput = execSync('node scripts/test-db-connection.js', {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'pipe',
    encoding: 'utf-8'
  });
  
  console.log('数据库检查输出:');
  console.log(checkOutput);
  
  console.log('Seed 脚本运行完成');
} catch (error) {
  console.error('运行 seed 脚本时出错:', error.message);
  if (error.stdout) {
    console.log('标准输出:', error.stdout.toString());
  }
  if (error.stderr) {
    console.error('错误输出:', error.stderr.toString());
  }
}
