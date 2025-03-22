// 加载环境变量
require('dotenv').config({ path: '.env.development' });

// 打印数据库相关环境变量
console.log('环境变量检查:');
console.log('POSTGRES_PRISMA_URL:', process.env.POSTGRES_PRISMA_URL ? '已设置 ✓' : '未设置 ✗');
console.log('POSTGRES_URL_NON_POOLING:', process.env.POSTGRES_URL_NON_POOLING ? '已设置 ✓' : '未设置 ✗');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '已设置 ✓' : '未设置 ✗');

// 打印其他重要环境变量
console.log('\n其他重要环境变量:');
console.log('NODE_ENV:', process.env.NODE_ENV || '未设置');
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL || '未设置');
