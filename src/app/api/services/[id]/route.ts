import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { generateSlug } from '@/utils/string';

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
      return apiError('NOT_FOUND', 'Service not found', 404);
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
    return apiError('SERVER_ERROR', 'Failed to fetch service', 500);
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

    // 验证必填字段
    if (!price || !duration || !imageUrl || !translations || !Array.isArray(translations)) {
      return apiError('INVALID_INPUT', 'Missing required fields', 400);
    }

    // 验证服务是否存在
    const existingService = await prisma.service.findUnique({
      where: { id },
      include: {
        translations: true,
      },
    });

    if (!existingService) {
      return apiError('NOT_FOUND', 'Service not found', 404);
    }

    // 验证翻译数据
    const requiredLocales = ['en', 'zh', 'ko'];
    const missingLocales = requiredLocales.filter(
      locale => !translations.some((t: any) => t.locale === locale)
    );

    if (missingLocales.length > 0) {
      return apiError(
        'INVALID_INPUT',
        `Missing translations for: ${missingLocales.join(', ')}`,
        400
      );
    }

    // 使用事务更新服务及其翻译
    const updatedService = await prisma.$transaction(async (tx) => {
      // 更新服务基本信息
      const service = await tx.service.update({
        where: { id },
        data: {
          price,
          duration,
          imageUrl,
        },
      });

      // 更新翻译
      for (const translation of translations) {
        const { locale, name, description } = translation;
        // 始终使用英文名称生成slug
        const isEnglish = locale === 'en';
        if (isEnglish) {
          const baseSlug = generateSlug(name);
          
          // 检查slug是否已存在（排除当前服务）
          const existingSlug = await tx.serviceTranslation.findFirst({
            where: {
              AND: [
                { locale: 'en' },
                { slug: baseSlug },
                { serviceId: { not: id } },
              ],
            },
          });

          // 如果slug已存在，添加随机字符串
          const slug = existingSlug ? `${baseSlug}-${Date.now().toString(36)}` : baseSlug;

          // 更新所有语言版本使用相同的slug
          for (const loc of requiredLocales) {
            const localeTranslation = translations.find(t => t.locale === loc);
            if (localeTranslation) {
              await tx.serviceTranslation.upsert({
                where: {
                  serviceId_locale: {
                    serviceId: id,
                    locale: loc,
                  },
                },
                create: {
                  serviceId: id,
                  locale: loc,
                  name: localeTranslation.name,
                  description: localeTranslation.description,
                  slug: slug, // 使用相同的slug
                },
                update: {
                  name: localeTranslation.name,
                  description: localeTranslation.description,
                  slug: slug, // 使用相同的slug
                },
              });
            }
          }
          break; // 处理完英文版本后退出循环
        }
      }

      return await tx.service.findUnique({
        where: { id },
        include: {
          translations: true,
        },
      });
    });

    return apiSuccess(updatedService, 'Service updated successfully');
  } catch (error) {
    console.error('Error updating service:', error);
    if (error instanceof Error) {
      return apiError('SERVER_ERROR', error.message, 500);
    }
    return apiError('SERVER_ERROR', 'Failed to update service', 500);
  }
}

// 删除服务
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // 验证服务是否存在
    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return apiError('NOT_FOUND', 'Service not found', 404);
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

    return apiSuccess(null, 'Service deleted successfully');
  } catch (error) {
    console.error('Error deleting service:', error);
    return apiError('SERVER_ERROR', 'Failed to delete service', 500);
  }
} 