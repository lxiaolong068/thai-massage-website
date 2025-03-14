import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';

// 获取所有按摩师
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    
    const therapists = await prisma.therapist.findMany({
      include: {
        translations: {
          where: {
            locale,
          },
        },
      },
    });

    // 格式化响应数据
    const formattedTherapists = therapists.map(therapist => {
      const translation = therapist.translations[0] || null;
      return {
        id: therapist.id,
        imageUrl: therapist.imageUrl,
        specialties: therapist.specialties,
        experienceYears: therapist.experienceYears,
        name: translation?.name || '',
        bio: translation?.bio || '',
        specialtiesTranslation: translation?.specialtiesTranslation || [],
        createdAt: therapist.createdAt,
        updatedAt: therapist.updatedAt,
      };
    });

    return apiSuccess(formattedTherapists);
  } catch (error) {
    console.error('Error fetching therapists:', error);
    return apiError('SERVER_ERROR', '获取按摩师列表失败', 500);
  }
}

// 创建新按摩师
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, specialties, experienceYears, translations } = body;

    // 验证必填字段
    if (!imageUrl || !specialties || !experienceYears || !translations || !Array.isArray(translations)) {
      return apiError('INVALID_INPUT', '缺少必填字段', 400);
    }

    // 创建按摩师及其翻译
    const therapist = await prisma.therapist.create({
      data: {
        imageUrl,
        specialties,
        experienceYears,
        translations: {
          create: translations.map((translation: any) => ({
            locale: translation.locale,
            name: translation.name,
            bio: translation.bio,
            specialtiesTranslation: translation.specialtiesTranslation || [],
          })),
        },
      },
      include: {
        translations: true,
      },
    });

    return apiSuccess(therapist, '按摩师创建成功');
  } catch (error) {
    console.error('Error creating therapist:', error);
    return apiError('SERVER_ERROR', '创建按摩师失败', 500);
  }
}

// 批量操作按摩师
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, therapistIds } = body;

    // 验证必填字段
    if (!action || !therapistIds || !Array.isArray(therapistIds) || therapistIds.length === 0) {
      return apiError('INVALID_INPUT', '缺少必填字段或格式不正确', 400);
    }

    // 根据操作类型执行不同的批量操作
    switch (action) {
      case 'delete':
        // 检查是否有关联的预约
        const relatedBookings = await prisma.booking.findMany({
          where: {
            therapistId: {
              in: therapistIds
            }
          },
          select: {
            therapistId: true
          }
        });

        // 获取有关联预约的按摩师ID
        const therapistIdsWithBookings = [...new Set(relatedBookings.map(booking => booking.therapistId))];
        
        if (therapistIdsWithBookings.length > 0) {
          return apiError(
            'RELATED_BOOKINGS',
            `无法删除部分按摩师，存在关联的预约记录`,
            400
          );
        }
        
        // 批量删除按摩师
        const deleteResult = await prisma.therapist.deleteMany({
          where: {
            id: {
              in: therapistIds,
            },
          },
        });

        return apiSuccess(
          { count: deleteResult.count },
          `成功删除 ${deleteResult.count} 个按摩师`
        );

      // 可以在这里添加其他批量操作类型
      default:
        return apiError('INVALID_ACTION', '不支持的操作类型', 400);
    }
  } catch (error) {
    console.error('Error performing batch operation:', error);
    return apiError('SERVER_ERROR', '批量操作失败', 500);
  }
}