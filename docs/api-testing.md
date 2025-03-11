# API测试文档

本文档详细说明了如何运行和编写API测试。

## 测试环境设置

### 前提条件

- Node.js 18.17.0或更高版本
- PostgreSQL数据库
- 项目依赖已安装（`pnpm install`）

### 测试数据库设置

测试使用独立的测试数据库，以避免影响开发或生产数据库。测试数据库配置在`.env.test`文件中。

默认配置：
```
POSTGRES_PRISMA_URL="postgresql://test:test@localhost:5432/thai_massage_test"
POSTGRES_URL_NON_POOLING="postgresql://test:test@localhost:5432/thai_massage_test"
```

如果需要，可以修改这些配置以匹配您的环境。

### 设置测试数据库

运行以下命令设置测试数据库：

```bash
pnpm test:setup-db
```

这将：
1. 创建测试数据库（如果不存在）
2. 应用Prisma迁移
3. 准备测试环境

## 运行API测试

### 运行所有API测试

```bash
pnpm test:api:run
```

这将设置测试数据库并运行所有API测试。

### 运行特定的API测试

```bash
# 运行服务API测试
pnpm test -- src/__tests__/api/services.test.ts

# 运行按摩师API测试
pnpm test -- src/__tests__/api/therapists.test.ts

# 运行预约API测试
pnpm test -- src/__tests__/api/bookings.test.ts
```

### 监视模式运行测试

```bash
pnpm test:watch -- src/__tests__/api
```

## 编写API测试

### 测试文件结构

API测试文件位于`src/__tests__/api`目录下，按API端点分类：

```
src/__tests__/api/
├── services.test.ts       # 服务列表API测试
├── services-id.test.ts    # 单个服务API测试
├── therapists.test.ts     # 按摩师列表API测试
├── therapists-id.test.ts  # 单个按摩师API测试
├── bookings.test.ts       # 预约列表API测试
├── bookings-id.test.ts    # 单个预约API测试
└── utils/                 # 测试工具
    ├── test-client.ts     # 测试客户端工具
    └── db-utils.ts        # 数据库测试工具
```

### 测试工具

#### 创建模拟请求

使用`createMockNextRequest`函数创建模拟的Next.js请求对象：

```typescript
import { createMockNextRequest } from './utils/test-client';

// 创建GET请求
const req = createMockNextRequest({
  url: 'http://localhost:3000/api/services?locale=en',
});

// 创建POST请求
const req = createMockNextRequest({
  method: 'POST',
  url: 'http://localhost:3000/api/services',
  body: {
    // 请求体数据
  },
});
```

#### 解析响应

使用`parseResponseJson`函数解析API响应：

```typescript
import { parseResponseJson } from './utils/test-client';

const response = await GET(req);
const data = await parseResponseJson(response);

// 验证响应
expect(response.status).toBe(200);
expect(data.success).toBe(true);
```

#### 数据库工具

- `clearDatabase()`: 清空测试数据库中的所有表
- `seedTestData()`: 创建测试数据
- `getTestPrismaClient()`: 获取测试数据库的Prisma客户端

### 测试示例

```typescript
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/services/route';
import { clearDatabase, seedTestData } from './utils/db-utils';
import prisma from '@/lib/prisma';
import { createMockNextRequest, parseResponseJson } from './utils/test-client';

describe('Services API', () => {
  let testData: any;
  
  beforeAll(async () => {
    // 清空数据库并添加测试数据
    await clearDatabase();
    testData = await seedTestData();
  });

  afterAll(async () => {
    // 清空数据库
    await clearDatabase();
    await prisma.$disconnect();
  });

  describe('GET /api/services', () => {
    it('应该返回所有服务', async () => {
      // 创建模拟请求
      const req = createMockNextRequest({
        url: 'http://localhost:3000/api/services?locale=en',
      });

      // 调用API处理函数
      const response = await GET(req);
      const data = await parseResponseJson(response);

      // 验证响应
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });
  });
});
```

## 测试覆盖范围

API测试应覆盖以下方面：

1. **正常操作测试**：验证API在正常情况下的行为
   - 获取数据
   - 创建数据
   - 更新数据
   - 删除数据

2. **错误处理测试**：验证API在异常情况下的错误处理
   - 无效输入
   - 资源不存在
   - 权限不足

3. **数据验证测试**：验证API的输入验证功能
   - 必填字段验证
   - 数据类型验证
   - 数据格式验证

4. **多语言测试**：验证API的多语言支持
   - 不同语言的响应
   - 翻译正确性

## 最佳实践

1. **独立测试**：每个测试应该独立运行，不依赖其他测试的状态
2. **清理测试数据**：测试前后清理测试数据，避免测试之间相互影响
3. **模拟外部依赖**：使用Jest的mock功能模拟外部依赖，如翻译API
4. **测试边界条件**：测试各种边界条件和异常情况
5. **使用有意义的断言**：使用有意义的断言消息，便于理解测试失败的原因
6. **保持测试简单**：每个测试只测试一个功能点，避免复杂的测试逻辑 