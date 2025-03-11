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
      expect(data.data.length).toBeGreaterThan(0);
      
      // 验证服务数据结构
      const service = data.data[0];
      expect(service).toHaveProperty('id');
      expect(service).toHaveProperty('price');
      expect(service).toHaveProperty('duration');
      expect(service).toHaveProperty('imageUrl');
      expect(service).toHaveProperty('name');
      expect(service).toHaveProperty('description');
      expect(service).toHaveProperty('slug');
    });

    it('应该根据locale参数返回正确的翻译', async () => {
      // 英文请求
      const reqEn = createMockNextRequest({
        url: 'http://localhost:3000/api/services?locale=en',
      });
      const responseEn = await GET(reqEn);
      const dataEn = await parseResponseJson(responseEn);
      
      // 中文请求
      const reqZh = createMockNextRequest({
        url: 'http://localhost:3000/api/services?locale=zh',
      });
      const responseZh = await GET(reqZh);
      const dataZh = await parseResponseJson(responseZh);
      
      // 验证翻译
      expect(dataEn.data[0].name).toBe('Test Service');
      expect(dataZh.data[0].name).toBe('测试服务');
    });
  });

  describe('POST /api/services', () => {
    it('应该创建新服务', async () => {
      // 创建模拟请求
      const req = createMockNextRequest({
        method: 'POST',
        url: 'http://localhost:3000/api/services',
        body: {
          price: 1500,
          duration: 90,
          imageUrl: '/images/services/new-service.jpg',
          translations: [
            {
              locale: 'en',
              name: 'New Service',
              description: 'This is a new service',
              slug: 'new-service',
            },
            {
              locale: 'zh',
              name: '新服务',
              description: '这是一个新服务',
              slug: 'new-service',
            },
          ],
        },
      });

      // 调用API处理函数
      const response = await POST(req);
      const data = await parseResponseJson(response);

      // 验证响应
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('id');
      expect(data.message).toBe('Service created successfully');
      
      // 验证服务已创建
      const service = await prisma.service.findUnique({
        where: { id: data.data.id },
        include: { translations: true },
      });
      
      expect(service).not.toBeNull();
      expect(service?.price).toBe(1500);
      expect(service?.duration).toBe(90);
      expect(service?.translations.length).toBe(2);
    });

    it('应该验证必填字段', async () => {
      // 创建缺少必填字段的模拟请求
      const req = createMockNextRequest({
        method: 'POST',
        url: 'http://localhost:3000/api/services',
        body: {
          price: 1500,
          // 缺少duration
          imageUrl: '/images/services/new-service.jpg',
          // 缺少translations
        },
      });

      // 调用API处理函数
      const response = await POST(req);
      const data = await parseResponseJson(response);

      // 验证响应
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('INVALID_INPUT');
    });
  });
}); 