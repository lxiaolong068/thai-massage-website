import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '../../../../lib/api-response';

// 获取单个服务
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        translations: {
          where: { locale },
        },
      },
    });

    if (!service) {
      const errorMessage = getLocalizedText(locale, {
        en: 'Service not found',
        zh: '未找到服务',
        ko: '서비스를 찾을 수 없습니다'
      });
      return apiError('NOT_FOUND', errorMessage, 404);
    }

    // 格式化响应数据
    const translation = service.translations[0] || null;
    const formattedService = {
      id: service.id,
      price: service.price,
      duration: service.duration,
      imageUrl: service.imageUrl,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
      name: translation?.name || '',
      description: translation?.description || '',
      slug: translation?.slug || '',
    };

    return apiSuccess(formattedService);
  } catch (error) {
    console.error('Error fetching service:', error);
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale') || 'en';
    return apiError(
      'SERVER_ERROR', 
      getLocalizedErrorMessage(locale, 'fetch'),
      500
    );
  }
}

// 更新服务
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
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

    // 验证服务是否存在
    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return apiError(
        'NOT_FOUND',
        getLocalizedText(locale, {
          en: 'Service not found',
          zh: '未找到服务',
          ko: '서비스를 찾을 수 없습니다'
        }),
        404
      );
    }
    
    // 使用事务更新服务及其翻译
    const updatedService = await prisma.$transaction(async (tx) => {
      // 更新服务基本信息
      const updated = await tx.service.update({
        where: { id },
        data: {
          price,
          duration,
          imageUrl,
        },
      });
      
      // 更新翻译
      for (const translation of translations) {
        const { locale, name, description, slug } = translation;
        
        // 查找现有翻译
        const existingTranslation = await tx.serviceTranslation.findFirst({
          where: {
            serviceId: id,
            locale,
          },
        });

        if (existingTranslation) {
          // 更新现有翻译
          await tx.serviceTranslation.update({
            where: { id: existingTranslation.id },
            data: {
              name,
              description,
              slug: slug || generateSlug(name),
            },
          });
        } else {
          // 创建新翻译
          await tx.serviceTranslation.create({
            data: {
              serviceId: id,
              locale,
              name,
              description,
              slug: slug || generateSlug(name),
            },
          });
        }
      }
      
      // 获取更新后的完整服务数据
      return await tx.service.findUnique({
        where: { id },
        include: {
          translations: true,
        },
      });
    });

    return apiSuccess(
      updatedService, 
      getLocalizedText(locale, {
        en: 'Service updated successfully',
        zh: '服务更新成功',
        ko: '서비스가 성공적으로 업데이트되었습니다'
      })
    );
  } catch (error) {
    console.error('Error updating service:', error);
    const locale = request.headers.get('Accept-Language') || 'en';
    return apiError(
      'SERVER_ERROR',
      getLocalizedErrorMessage(locale, 'update'),
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
      en: 'Failed to fetch service',
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

// 删除服务
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const locale = request.headers.get('Accept-Language') || 'en';

    // 验证服务是否存在
    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return apiError(
        'NOT_FOUND',
        getLocalizedText(locale, {
          en: 'Service not found',
          zh: '未找到服务',
          ko: '서비스를 찾을 수 없습니다'
        }),
        404
      );
    }

    // 使用事务删除服务及其相关数据
    await prisma.$transaction([      
      // 先删除翻译
      prisma.serviceTranslation.deleteMany({
        where: {
          serviceId: id
        }
      }),
      // 再删除服务
      prisma.service.delete({
        where: { id },
      })
    ]);

    return apiSuccess(
      null, 
      getLocalizedText(locale, {
        en: 'Service deleted successfully',
        zh: '服务删除成功',
        ko: '서비스가 성공적으로 삭제되었습니다'
      })
    );
  } catch (error) {
    console.error('Error deleting service:', error);
    const locale = request.headers.get('Accept-Language') || 'en';
    return apiError(
      'SERVER_ERROR',
      getLocalizedErrorMessage(locale, 'delete'),
      500
    );
  }
} 