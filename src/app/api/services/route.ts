import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { apiSuccess, apiError } from '../../../lib/api-response';

// Get all services
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale') || 'en';
    
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

    if (formattedServices.length === 0) {
      const fallbackServices = getFallbackServices(locale);
      return apiSuccess(fallbackServices);
    }

    return apiSuccess(formattedServices);
  } catch (error) {
    console.error('Error fetching services:', error);
    return apiError('SERVER_ERROR', 'Failed to fetch services', 500);
  }
}

// Create new service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { price, duration, imageUrl, translations } = body;

    // Validate required fields
    if (!price || !duration || !imageUrl || !translations || !Array.isArray(translations)) {
      return apiError('INVALID_INPUT', 'Missing required fields', 400);
    }

    // Validate translations
    const requiredLocales = ['zh', 'en', 'ko'];
    for (const requiredLocale of requiredLocales) {
      const translation = translations.find((t: any) => t.locale === requiredLocale);
      if (!translation || !translation.name || !translation.description) {
        return apiError('INVALID_INPUT', `Missing ${requiredLocale} translation`, 400);
      }
    }

    // Create service with translations
    const newService = await prisma.$transaction(async (tx) => {
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
              slug: translation.slug || generateSlug(translation.name)
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

// Helper function: Generate slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
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