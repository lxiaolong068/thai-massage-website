// 在所有测试之前运行的全局设置
// 这里可以添加全局的mock或者扩展expect

// 模拟环境变量
process.env.POSTGRES_PRISMA_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.POSTGRES_URL_NON_POOLING = 'postgresql://test:test@localhost:5432/test_db';

// 设置测试超时时间
jest.setTimeout(30000);

// 添加全局类型声明
global.jest = jest;
global.describe = describe;
global.it = it;
global.expect = expect;
global.beforeAll = beforeAll;
global.afterAll = afterAll;
global.beforeEach = beforeEach;
global.afterEach = afterEach;

// 添加自定义匹配器
expect.extend({
  toBeValidUUID(received) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const pass = uuidRegex.test(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid UUID`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid UUID`,
        pass: false,
      };
    }
  },
}); 