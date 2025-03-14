import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { apiSuccess, apiError } from '../../../lib/api-response';

// 获取所有服务
export async function GET(request: NextRequest) {
  try {
    // 获取locale参数
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale') || 'en';
    
    // 从数据库获取所有服务及其翻译
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

    // 格式化返回数据
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

    // 如果没有找到服务，返回备用数据
    if (formattedServices.length === 0) {
      const fallbackServices = getFallbackServices(locale);
      return apiSuccess(fallbackServices);
    }

    return apiSuccess(formattedServices);
  } catch (error) {
    console.error('Error fetching services:', error);
    const locale = request.headers.get('Accept-Language') || 'en';
    return apiError(
      'SERVER_ERROR', 
      getLocalizedErrorMessage(locale, 'fetch'),
      500
    );
  }
}

// 创建新服务
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { price, duration, imageUrl, translations } = body;
    const locale = request.headers.get('Accept-Language') || 'en';

    // 验证必填字段
    if (!price || !duration || !imageUrl || !translations || !Array.isArray(translations)) {
      return apiError(
        'INVALID_INPUT', 
        getLocalizedText(locale, {
          en: 'Missing required fields',
          zh: '缺少必填字段',
          ko: '필수 필드가 누락되었습니다'
        }),
        400
      );
    }

    // 验证翻译数据
    const requiredLocales = ['zh', 'en', 'ko'];
    for (const requiredLocale of requiredLocales) {
      const translation = translations.find((t: any) => t.locale === requiredLocale);
      if (!translation || !translation.name || !translation.description) {
        return apiError(
          'INVALID_INPUT',
          getLocalizedText(locale, {
            en: `Missing ${requiredLocale} translation`,
            zh: `缺少${requiredLocale === 'zh' ? '中文' : requiredLocale === 'en' ? '英文' : '韩文'}翻译`,
            ko: `${requiredLocale === 'zh' ? '중국어' : requiredLocale === 'en' ? '영어' : '한국어'} 번역 누락`
          }),
          400
        );
      }
    }

    // 创建服务及其翻译（使用事务确保原子性）
    const newService = await prisma.$transaction(async (tx) => {
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

    // 返回成功响应
    return apiSuccess(newService, getLocalizedText(locale, {
      en: 'Service created successfully',
      zh: '服务创建成功',
      ko: '서비스가 성공적으로 생성되었습니다'
    }));
  } catch (error) {
    console.error('Error creating service:', error);
    const locale = request.headers.get('Accept-Language') || 'en';
    
    // 处理唯一约束错误
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return apiError(
        'DUPLICATE_ERROR',
        getLocalizedText(locale, {
          en: 'A service with this name already exists',
          zh: '具有此名称的服务已存在',
          ko: '이 이름의 서비스가 이미 존재합니다'
        }),
        409
      );
    }
    
    return apiError(
      'SERVER_ERROR',
      getLocalizedErrorMessage(locale, 'create'),
      500
    );
  }
}

// 批量操作服务
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, serviceIds } = body;
    const locale = request.headers.get('Accept-Language') || 'en';
    
    if (!action || !serviceIds || !Array.isArray(serviceIds) || serviceIds.length === 0) {
      return apiError(
        'INVALID_INPUT',
        getLocalizedText(locale, {
          en: 'Invalid batch operation request',
          zh: '无效的批量操作请求',
          ko: '잘못된 일괄 작업 요청'
        }),
        400
      );
    }
    
    // 根据操作类型执行不同的批量操作
    switch (action) {
      case 'delete':
        // 批量删除服务
        await prisma.$transaction([
          // 先删除翻译
          prisma.serviceTranslation.deleteMany({
            where: {
              serviceId: {
                in: serviceIds
              }
            }
          }),
          // 再删除服务
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
          getLocalizedText(locale, {
            en: `${serviceIds.length} services deleted successfully`,
            zh: `成功删除 ${serviceIds.length} 个服务`,
            ko: `${serviceIds.length}개의 서비스가 성공적으로 삭제되었습니다`
          })
        );
        
      default:
        return apiError(
          'INVALID_ACTION',
          getLocalizedText(locale, {
            en: 'Unsupported batch operation',
            zh: '不支持的批量操作',
            ko: '지원되지 않는 일괄 작업'
          }),
          400
        );
    }
  } catch (error) {
    console.error('Error in batch operation:', error);
    const locale = request.headers.get('Accept-Language') || 'en';
    
    return apiError(
      'SERVER_ERROR',
      getLocalizedText(locale, {
        en: 'Failed to perform batch operation',
        zh: '执行批量操作失败',
        ko: '일괄 작업을 수행하지 못했습니다'
      }),
      500
    );
  }
}

// 辅助函数：生成 slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 辅助函数：获取备用服务数据
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

// 根据语言获取本地化文本
function getLocalizedText(locale: string, texts: {en: string; zh?: string; ko?: string; [key: string]: string | undefined}): string {
  return (locale in texts && texts[locale]) ? texts[locale]! : texts.en; // 默认英文
}

// 根据语言获取本地化错误消息
function getLocalizedErrorMessage(locale: string, type: 'fetch' | 'create' | 'update' | 'delete'): string {
  interface ErrorMessages {
    [key: string]: {
      en: string;
      zh: string;
      ko: string;
    }
  }
  
  const errorMessages: ErrorMessages = {
    fetch: {
      en: 'Failed to fetch services',
      zh: '获取服务失败',
      ko: '서비스를 가져오지 못했습니다'
    },
    create: {
      en: 'Failed to create service',
      zh: '创建服务失败',
      ko: '서비스 생성 실패'
    },
    update: {
      en: 'Failed to update service',
      zh: '更新服务失败',
      ko: '서비스 업데이트 실패'
    },
    delete: {
      en: 'Failed to delete service',
      zh: '删除服务失败',
      ko: '서비스 삭제 실패'
    }
  };
  
  const messages = errorMessages[type];
  if (locale === 'zh') return messages.zh;
  if (locale === 'ko') return messages.ko;
  return messages.en;
}