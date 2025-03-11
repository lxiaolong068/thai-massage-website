import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/bookings/route';
import { clearDatabase, seedTestData } from './utils/db-utils';
import prisma from '@/lib/prisma';

// 模拟NextRequest
function createMockRequest(options: {
  url?: string;
  method?: string;
  body?: any;
}): NextRequest {
  const { url = 'http://localhost:3000/api/bookings', method = 'GET', body } = options;
  
  // @ts-ignore - 简化测试
  const req: NextRequest = {
    url,
    method,
    nextUrl: new URL(url),
    json: jest.fn().mockResolvedValue(body),
  };
  
  return req;
}

describe('Bookings API', () => {
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

  describe('GET /api/bookings', () => {
    it('应该返回所有预约', async () => {
      // 创建模拟请求
      const req = createMockRequest({
        url: 'http://localhost:3000/api/bookings',
      });

      // 调用API处理函数
      const response = await GET(req);
      const data = await response.json();

      // 验证响应
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBeGreaterThan(0);
      
      // 验证预约数据结构
      const booking = data.data[0];
      expect(booking).toHaveProperty('id');
      expect(booking).toHaveProperty('serviceId');
      expect(booking).toHaveProperty('therapistId');
      expect(booking).toHaveProperty('date');
      expect(booking).toHaveProperty('time');
      expect(booking).toHaveProperty('customerName');
      expect(booking).toHaveProperty('customerEmail');
      expect(booking).toHaveProperty('customerPhone');
      expect(booking).toHaveProperty('status');
    });

    it('应该支持按状态筛选预约', async () => {
      // 创建模拟请求
      const req = createMockRequest({
        url: 'http://localhost:3000/api/bookings?status=PENDING',
      });

      // 调用API处理函数
      const response = await GET(req);
      const data = await response.json();

      // 验证响应
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      
      // 验证所有返回的预约状态都是PENDING
      data.data.forEach((booking: any) => {
        expect(booking.status).toBe('PENDING');
      });
    });
  });

  describe('POST /api/bookings', () => {
    it('应该创建新预约', async () => {
      // 创建模拟请求
      const req = createMockRequest({
        method: 'POST',
        body: {
          serviceId: testData.service.id,
          therapistId: testData.therapist.id,
          date: '2023-12-25',
          time: '10:00',
          customerName: 'New Customer',
          customerEmail: 'new@example.com',
          customerPhone: '9876543210',
        },
      });

      // 调用API处理函数
      const response = await POST(req);
      const data = await response.json();

      // 验证响应
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('id');
      expect(data.message).toBe('Booking created successfully');
      
      // 验证预约已创建
      const booking = await prisma.booking.findUnique({
        where: { id: data.data.id },
      });
      
      expect(booking).not.toBeNull();
      expect(booking?.customerName).toBe('New Customer');
      expect(booking?.customerEmail).toBe('new@example.com');
      expect(booking?.status).toBe('PENDING');
    });

    it('应该验证必填字段', async () => {
      // 创建缺少必填字段的模拟请求
      const req = createMockRequest({
        method: 'POST',
        body: {
          serviceId: testData.service.id,
          // 缺少therapistId
          date: '2023-12-25',
          time: '10:00',
          // 缺少customerName
          customerEmail: 'new@example.com',
          customerPhone: '9876543210',
        },
      });

      // 调用API处理函数
      const response = await POST(req);
      const data = await response.json();

      // 验证响应
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('INVALID_INPUT');
    });

    it('应该验证日期和时间格式', async () => {
      // 创建日期格式错误的模拟请求
      const req = createMockRequest({
        method: 'POST',
        body: {
          serviceId: testData.service.id,
          therapistId: testData.therapist.id,
          date: 'invalid-date', // 无效日期
          time: '10:00',
          customerName: 'New Customer',
          customerEmail: 'new@example.com',
          customerPhone: '9876543210',
        },
      });

      // 调用API处理函数
      const response = await POST(req);
      const data = await response.json();

      // 验证响应
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('INVALID_DATE');
    });
  });
}); 