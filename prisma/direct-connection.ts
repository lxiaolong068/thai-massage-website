import { Client } from 'pg';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

async function main() {
  console.log('开始测试直接数据库连接...');
  
  // 创建客户端
  const client = new Client({
    connectionString: process.env.POSTGRES_PRISMA_URL,
  });

  try {
    console.log('正在连接到数据库...');
    await client.connect();
    console.log('数据库连接成功!');
    
    // 测试查询
    console.log('执行测试查询...');
    const result = await client.query('SELECT 1 as test');
    console.log('查询结果:', result.rows);
    
    // 获取表信息
    console.log('获取数据库表信息...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('数据库表:', tablesResult.rows);
    
    // 如果有表，尝试查询一些数据
    if (tablesResult.rows.length > 0) {
      for (const table of tablesResult.rows) {
        const tableName = table.table_name;
        console.log(`尝试查询表 ${tableName} 的数据...`);
        try {
          const countResult = await client.query(`SELECT COUNT(*) FROM "${tableName}"`);
          console.log(`表 ${tableName} 中有 ${countResult.rows[0].count} 条记录`);
          
          if (parseInt(countResult.rows[0].count) > 0) {
            const sampleResult = await client.query(`SELECT * FROM "${tableName}" LIMIT 2`);
            console.log(`表 ${tableName} 示例数据:`, sampleResult.rows);
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error(`查询表 ${tableName} 时出错:`, err.message);
          } else {
            console.error(`查询表 ${tableName} 时出错:`, err);
          }
        }
      }
    }
    
  } catch (error) {
    console.error('数据库操作失败:', error);
  } finally {
    console.log('关闭数据库连接...');
    await client.end();
    console.log('数据库连接已关闭');
  }
}

// 添加顶层错误处理
main()
  .then(() => console.log('脚本执行完成'))
  .catch(e => {
    console.error('脚本执行失败:', e);
    process.exit(1);
  }); 