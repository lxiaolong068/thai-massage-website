import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/therapists/route';
import { clearDatabase, seedTestData } from './utils/db-utils';
import prisma from '@/lib/prisma';

// 模拟NextRequest
function createMockRequest(options: {
  url?: string;
  method?: string;
  body?: any;
}): NextRequest {
  const { url = 'http://localhost:3000/api/therapists', method = 'GET', body } = options;
  
  // @ts-ignore - 简化测试
  const req: NextRequest = {
    url,
    method,
    nextUrl: new URL(url),
    json: jest.fn().mockResolvedValue(body),
  };
  
  return req;
}

describe('Therapists API', () => {
  beforeAll(async () => {
    // 清空数据库并添加测试数据
    await clearDatabase();
    await seedTestData();
  });

  afterAll(async () => {
    // 清空数据库
    await clearDatabase();
    await prisma.$disconnect();
  });

  describe('GET /api/therapists', () => {
    it('应该返回所有按摩师', async () => {
      // 创建模拟请求
      const req = createMockRequest({
        url: 'http://localhost:3000/api/therapists?locale=en',
      });

      // 调用API处理函数
      const response = await GET(req);
      const data = await response.json();

      // 验证响应
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBeGreaterThan(0);
      
      // 验证按摩师数据结构
      const therapist = data.data[0];
      expect(therapist).toHaveProperty('id');
      expect(therapist).toHaveProperty('imageUrl');
      expect(therapist).toHaveProperty('specialties');
      expect(therapist).toHaveProperty('experienceYears');
      expect(therapist).toHaveProperty('name');
      expect(therapist).toHaveProperty('bio');
    });

    it('应该根据locale参数返回正确的翻译', async () => {
      // 英文请求
      const reqEn = createMockRequest({
        url: 'http://localhost:3000/api/therapists?locale=en',
      });
      const responseEn = await GET(reqEn);
      const dataEn = await responseEn.json();
      
      // 中文请求
      const reqZh = createMockRequest({
        url: 'http://localhost:3000/api/therapists?locale=zh',
      });
      const responseZh = await GET(reqZh);
      const dataZh = await responseZh.json();
      
      // 验证翻译
      expect(dataEn.data[0].name).toBe('Test Therapist');
      expect(dataZh.data[0].name).toBe('测试按摩师');
    });
  });

  describe('POST /api/therapists', () => {
    it('应该创建新按摩师', async () => {
      // 创建模拟请求
      const req = createMockRequest({
        method: 'POST',
        body: {
          imageUrl: '/images/therapists/new-therapist.jpg',
          specialties: ['Deep Tissue', 'Aromatherapy'],
          experienceYears: 8,
          translations: [
            {
              locale: 'en',
              name: 'New Therapist',
              bio: 'This is a new therapist',
              specialtiesTranslation: ['Deep Tissue Massage', 'Aromatherapy Massage'],
            },
            {
              locale: 'zh',
              name: '新按摩师',
              bio: '这是一个新按摩师',
              specialtiesTranslation: ['深层组织按摩', '芳香疗法按摩'],
            },
          ],
        },
      });

      // 调用API处理函数
      const response = await POST(req);
      const data = await response.json();

      // 验证响应
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('id');
      expect(data.message).toBe('Therapist created successfully');
      
      // 验证按摩师已创建
      const therapist = await prisma.therapist.findUnique({
        where: { id: data.data.id },
        include: { translations: true },
      });
      
      expect(therapist).not.toBeNull();
      expect(therapist?.experienceYears).toBe(8);
      expect(therapist?.specialties).toContain('Deep Tissue');
      expect(therapist?.translations.length).toBe(2);
    });

    it('应该验证必填字段', async () => {
      // 创建缺少必填字段的模拟请求
      const req = createMockRequest({
        method: 'POST',
        body: {
          imageUrl: '/images/therapists/new-therapist.jpg',
          // 缺少specialties
          experienceYears: 8,
          // 缺少translations
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
  });
}); 