import { NextRequest } from 'next/server';
import { GET, PUT, DELETE } from '@/app/api/services/[id]/route';
import { clearDatabase, seedTestData } from './utils/db-utils';
import prisma from '@/lib/prisma';

// 模拟NextRequest
function createMockRequest(options: {
  url?: string;
  method?: string;
  body?: any;
  params?: { id: string };
}): NextRequest {
  const { url = 'http://localhost:3000/api/services/123', method = 'GET', body, params = { id: '123' } } = options;
  
  // @ts-ignore - 简化测试
  const req: NextRequest = {
    url,
    method,
    nextUrl: new URL(url),
    json: jest.fn().mockResolvedValue(body),
  };
  
  // @ts-ignore - 添加params
  req.params = params;
  
  return req;
}

describe('Single Service API', () => {
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

  describe('GET /api/services/[id]', () => {
    it('应该返回单个服务的详细信息', async () => {
      // 创建模拟请求
      const req = createMockRequest({
        url: `http://localhost:3000/api/services/${testData.service.id}?locale=en`,
        params: { id: testData.service.id },
      });

      // 调用API处理函数
      const response = await GET(req, { params: { id: testData.service.id } });
      const data = await response.json();

      // 验证响应
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('id', testData.service.id);
      expect(data.data).toHaveProperty('price');
      expect(data.data).toHaveProperty('duration');
      expect(data.data).toHaveProperty('name', 'Test Service');
    });

    it('应该返回404错误，如果服务不存在', async () => {
      // 创建模拟请求
      const req = createMockRequest({
        url: 'http://localhost:3000/api/services/non-existent-id',
        params: { id: 'non-existent-id' },
      });

      // 调用API处理函数
      const response = await GET(req, { params: { id: 'non-existent-id' } });
      const data = await response.json();

      // 验证响应
      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('NOT_FOUND');
    });
  });

  describe('PUT /api/services/[id]', () => {
    it('应该更新服务信息', async () => {
      // 创建模拟请求
      const req = createMockRequest({
        method: 'PUT',
        url: `http://localhost:3000/api/services/${testData.service.id}`,
        params: { id: testData.service.id },
        body: {
          price: 1200,
          duration: 75,
          imageUrl: '/images/services/updated-service.jpg',
          translations: [
            {
              locale: 'en',
              name: 'Updated Service',
              description: 'This is an updated service',
              slug: 'updated-service',
            },
          ],
        },
      });

      // 调用API处理函数
      const response = await PUT(req, { params: { id: testData.service.id } });
      const data = await response.json();

      // 验证响应
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('id', testData.service.id);
      expect(data.data).toHaveProperty('price', 1200);
      expect(data.data).toHaveProperty('duration', 75);
      expect(data.message).toBe('Service updated successfully');
      
      // 验证服务已更新
      const service = await prisma.service.findUnique({
        where: { id: testData.service.id },
        include: {
          translations: {
            where: { locale: 'en' },
          },
        },
      });
      
      expect(service).not.toBeNull();
      expect(service?.price).toBe(1200);
      expect(service?.duration).toBe(75);
      expect(service?.translations[0].name).toBe('Updated Service');
    });

    it('应该返回404错误，如果服务不存在', async () => {
      // 创建模拟请求
      const req = createMockRequest({
        method: 'PUT',
        url: 'http://localhost:3000/api/services/non-existent-id',
        params: { id: 'non-existent-id' },
        body: {
          price: 1200,
          duration: 75,
        },
      });

      // 调用API处理函数
      const response = await PUT(req, { params: { id: 'non-existent-id' } });
      const data = await response.json();

      // 验证响应
      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('NOT_FOUND');
    });
  });

  describe('DELETE /api/services/[id]', () => {
    it('应该删除服务', async () => {
      // 先创建一个新服务
      const newService = await prisma.service.create({
        data: {
          price: 800,
          duration: 45,
          imageUrl: '/images/services/to-delete.jpg',
          translations: {
            create: [
              {
                locale: 'en',
                name: 'Service To Delete',
                description: 'This service will be deleted',
                slug: 'service-to-delete',
              },
            ],
          },
        },
      });

      // 创建模拟请求
      const req = createMockRequest({
        method: 'DELETE',
        url: `http://localhost:3000/api/services/${newService.id}`,
        params: { id: newService.id },
      });

      // 调用API处理函数
      const response = await DELETE(req, { params: { id: newService.id } });
      const data = await response.json();

      // 验证响应
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Service deleted successfully');
      
      // 验证服务已删除
      const deletedService = await prisma.service.findUnique({
        where: { id: newService.id },
      });
      
      expect(deletedService).toBeNull();
    });

    it('应该返回404错误，如果服务不存在', async () => {
      // 创建模拟请求
      const req = createMockRequest({
        method: 'DELETE',
        url: 'http://localhost:3000/api/services/non-existent-id',
        params: { id: 'non-existent-id' },
      });

      // 调用API处理函数
      const response = await DELETE(req, { params: { id: 'non-existent-id' } });
      const data = await response.json();

      // 验证响应
      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('NOT_FOUND');
    });
  });
}); 