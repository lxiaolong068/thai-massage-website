import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { apiSuccess, apiError } from '../../../lib/api-response';
import { generateSlug } from '@/utils/string';

// Get all services
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale') || 'en';
    
    console.log(`[API] [services] Fetching services for locale: ${locale}`);
    console.log(`[API] [services] DATABASE_URL prefix: ${process.env.DATABASE_URL?.substring(0, 20)}...`);
    console.log(`[API] [services] Environment: ${process.env.NODE_ENV}`);
    
    try {
      // 测试数据库连接
      await prisma.$queryRaw`SELECT 1`;
      console.log(`[API] [services] Database connection test successful`);
      
      const services = await prisma.service.findMany({
        include: {
          translations: {
            where: {
              locale: locale
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      });

      console.log(`[API] [services] Found ${services.length} services`);
      
      // 检查数据有效性
      const invalidServices = services.filter(service => !service.translations || service.translations.length === 0);
      if (invalidServices.length > 0) {
        console.warn(`[API] [services] Warning: ${invalidServices.length} services have no translations for locale: ${locale}`);
        console.warn(`[API] [services] Service IDs without translations: ${invalidServices.map(s => s.id).join(', ')}`);
      }
      
      const formattedServices = services.map(service => {
        const translation = service.translations[0] || { name: '', description: '', slug: '' };
        return {
          id: service.id,
          price: service.price,
          duration: service.duration,
          imageUrl: service.imageUrl,
          createdAt: service.createdAt,
          updatedAt: service.updatedAt,
          name: translation.name,
          description: translation.description,
          slug: translation.slug
        };
      });

      return apiSuccess(formattedServices);
    } catch (error: any) {
      // 详细记录数据库错误
      console.error('=====================================================');
      console.error('[API] [services] Database error details:');
      console.error('[API] [services] Request URL:', request.url);
      console.error('[API] [services] Error name:', error.name);
      console.error('[API] [services] Error message:', error.message);
      console.error('[API] [services] Error stack:', error.stack);
      
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error('[API] [services] Prisma error code:', error.code);
        console.error('[API] [services] Prisma error meta:', error.meta);
      }
      
      if (error instanceof Prisma.PrismaClientInitializationError) {
        console.error('[API] [services] Database initialization error');
        console.error('[API] [services] Client version:', error.clientVersion);
      }
      
      console.error('=====================================================');
      
      // 直接抛出错误，不使用回退机制，以便更好地诊断
      return apiError(
        'DATABASE_ERROR', 
        `Database error: ${error.message || 'Unknown database error'}`, 
        500
      );
    }
  } catch (error) {
    console.error('=====================================================');
    console.error('[API] [services] General error fetching services:');
    console.error('[API] [services] Request URL:', request.url);
    console.error('[API] [services] Error type:', typeof error);
    console.error('[API] [services] Error:', error);
    
    if (error instanceof Error) {
      console.error('[API] [services] Error name:', error.name);
      console.error('[API] [services] Error message:', error.message);
      console.error('[API] [services] Error stack:', error.stack);
    }
    console.error('=====================================================');
    
    if (error instanceof Error) {
      return apiError('SERVER_ERROR', `Failed to fetch services: ${error.message}`, 500);
    }
    return apiError('SERVER_ERROR', 'Failed to fetch services', 500);
  }
}

// Create new service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { price, duration, imageUrl, translations } = body;

    // 验证必填字段
    if (!price || !duration || !imageUrl || !translations || !Array.isArray(translations)) {
      return apiError('INVALID_INPUT', 'Missing required fields', 400);
    }

    // 验证翻译数据
    const requiredLocales = ['en', 'zh', 'ko'];
    const missingLocales = requiredLocales.filter(
      locale => !translations.some((t: any) => t.locale === locale && t.name && t.description)
    );

    if (missingLocales.length > 0) {
      return apiError(
        'INVALID_INPUT',
        `Missing translations for: ${missingLocales.join(', ')}`,
        400
      );
    }

    // 使用事务创建服务及其翻译
    const newService = await prisma.$transaction(async (tx) => {
      // 从英文翻译中获取名称并生成slug
      const englishTranslation = translations.find((t: any) => t.locale === 'en');
      if (!englishTranslation) {
        throw new Error('English translation is required');
      }

      // 生成基础slug
      const baseSlug = generateSlug(englishTranslation.name);

      // 检查slug是否已存在
      const existingSlug = await tx.serviceTranslation.findFirst({
        where: {
          locale: 'en',
          slug: baseSlug
        }
      });

      // 如果slug已存在，添加随机字符串
      const slug = existingSlug ? `${baseSlug}-${Date.now().toString(36)}` : baseSlug;

      // 创建服务
      const service = await tx.service.create({
        data: {
          price,
          duration,
          imageUrl,
          translations: {
            create: translations.map((translation: any) => ({
              locale: translation.locale,
              name: translation.name,
              description: translation.description,
              slug // 所有语言版本使用相同的slug
            }))
          }
        },
        include: {
          translations: true
        }
      });
      
      return service;
    });

    return apiSuccess(newService, 'Service created successfully');
  } catch (error) {
    console.error('Error creating service:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return apiError('DUPLICATE_ERROR', 'A service with this name already exists', 409);
    }

    if (error instanceof Error) {
      return apiError('SERVER_ERROR', error.message, 500);
    }
    
    return apiError('SERVER_ERROR', 'Failed to create service', 500);
  }
}

// Batch operations for services
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, serviceIds } = body;
    
    if (!action || !serviceIds || !Array.isArray(serviceIds) || serviceIds.length === 0) {
      return apiError('INVALID_INPUT', 'Invalid batch operation request', 400);
    }
    
    switch (action) {
      case 'delete':
        await prisma.$transaction([
          prisma.serviceTranslation.deleteMany({
            where: {
              serviceId: {
                in: serviceIds
              }
            }
          }),
          prisma.service.deleteMany({
            where: {
              id: {
                in: serviceIds
              }
            }
          })
        ]);
        
        return apiSuccess(
          { deletedCount: serviceIds.length },
          `${serviceIds.length} services deleted successfully`
        );
        
      default:
        return apiError('INVALID_ACTION', 'Unsupported batch operation', 400);
    }
  } catch (error) {
    console.error('Error in batch operation:', error);
    return apiError('SERVER_ERROR', 'Failed to perform batch operation', 500);
  }
}

// Helper function: Get fallback services
function getFallbackServices(locale: string) {
  return [
    {
      id: 'fallback-1',
      price: 1200,
      duration: 60,
      imageUrl: '/images/traditional-thai-new.jpg',
      name: locale === 'zh' ? '传统泰式按摩' : locale === 'ko' ? '전통 태국 마사지' : 'Traditional Thai Massage',
      description: locale === 'zh' ? '使用正宗技术的古老按摩方法，缓解身体紧张。' : 
                 locale === 'ko' ? '정통 기법을 사용한 고대 마사지 방법으로 신체 긴장을 풀어줍니다.' : 
                 'Ancient massage method using authentic techniques to relieve body tension.',
      slug: 'traditional-thai-massage',
    },
    {
      id: 'fallback-2',
      price: 1500,
      duration: 90,
      imageUrl: '/images/oil-massage-new.jpg',
      name: locale === 'zh' ? '精油按摩' : locale === 'ko' ? '오일 마사지' : 'Oil Massage',
      description: locale === 'zh' ? '使用芳香精油的放松按摩，舒缓您的身心。' : 
                 locale === 'ko' ? '향기로운 오일을 사용하는 편안한 마사지로 신체와 마음을 위로합니다.' : 
                 'Relaxing massage using aromatic oils to soothe your body and mind.',
      slug: 'oil-massage',
    }
  ];
}