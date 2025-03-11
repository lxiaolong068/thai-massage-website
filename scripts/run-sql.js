const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// 获取环境变量
const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_DATABASE,
} = process.env;

// 构建连接字符串
const connectionString = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/${POSTGRES_DATABASE}?sslmode=require`;

// 获取要执行的SQL文件路径
const sqlFilePath = path.join(__dirname, '..', 'prisma', 'remove-thai.sql');

try {
  console.log('开始执行SQL脚本...');
  
  // 读取SQL文件内容
  const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
  console.log('SQL脚本内容:');
  console.log(sqlContent);
  
  // 执行SQL命令
  const command = `PGPASSWORD=${POSTGRES_PASSWORD} psql "${connectionString}" -f "${sqlFilePath}"`;
  console.log('执行命令:', command);
  
  const output = execSync(command, { encoding: 'utf8' });
  console.log('SQL执行结果:');
  console.log(output);
  
  console.log('SQL脚本执行完成');
} catch (error) {
  console.error('执行SQL脚本时出错:', error);
  process.exit(1);
} 