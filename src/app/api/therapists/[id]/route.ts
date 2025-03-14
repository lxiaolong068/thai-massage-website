import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';

// 获取单个按摩师
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    const therapist = await prisma.therapist.findUnique({
      where: { id },
      include: {
        translations: {
          where: { locale },
        },
      },
    });

    if (!therapist) {
      return apiError('NOT_FOUND', '按摩师不存在', 404);
    }

    // 格式化响应数据
    const translation = therapist.translations[0] || null;
    const formattedTherapist = {
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

    return apiSuccess(formattedTherapist);
  } catch (error) {
    console.error('Error fetching therapist:', error);
    return apiError('SERVER_ERROR', '获取按摩师失败', 500);
  }
}

// 更新按摩师
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { imageUrl, specialties, experienceYears, translations } = body;

    // 验证按摩师是否存在
    const existingTherapist = await prisma.therapist.findUnique({
      where: { id },
    });

    if (!existingTherapist) {
      return apiError('NOT_FOUND', '按摩师不存在', 404);
    }

    // 验证必填字段
    if (!imageUrl || !specialties || !experienceYears || !translations) {
      return apiError('INVALID_INPUT', '缺少必填字段', 400);
    }

    // 更新按摩师基本信息
    const updateData: any = {
      imageUrl,
      specialties,
      experienceYears,
    };

    // 更新按摩师
    const updatedTherapist = await prisma.therapist.update({
      where: { id },
      data: updateData,
    });

    // 如果提供了翻译，更新翻译
    if (translations && Array.isArray(translations)) {
      for (const translation of translations) {
        const { locale, name, bio, specialtiesTranslation } = translation;
        
        // 查找现有翻译
        const existingTranslation = await prisma.therapistTranslation.findFirst({
          where: {
            therapistId: id,
            locale,
          },
        });

        if (existingTranslation) {
          // 更新现有翻译
          await prisma.therapistTranslation.update({
            where: { id: existingTranslation.id },
            data: {
              name: name !== undefined ? name : existingTranslation.name,
              bio: bio !== undefined ? bio : existingTranslation.bio,
              specialtiesTranslation: specialtiesTranslation !== undefined 
                ? specialtiesTranslation 
                : existingTranslation.specialtiesTranslation,
            },
          });
        } else {
          // 创建新翻译
          await prisma.therapistTranslation.create({
            data: {
              therapistId: id,
              locale,
              name: name || '',
              bio: bio || '',
              specialtiesTranslation: specialtiesTranslation || [],
            },
          });
        }
      }
    }

    // 获取更新后的按摩师（包括翻译）
    const therapistWithTranslations = await prisma.therapist.findUnique({
      where: { id },
      include: {
        translations: true,
      },
    });

    return apiSuccess(therapistWithTranslations, '按摩师更新成功');
  } catch (error) {
    console.error('Error updating therapist:', error);
    return apiError('SERVER_ERROR', '更新按摩师失败', 500);
  }
}

// 删除按摩师
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // 验证按摩师是否存在
    const existingTherapist = await prisma.therapist.findUnique({
      where: { id },
    });

    if (!existingTherapist) {
      return apiError('NOT_FOUND', '按摩师不存在', 404);
    }

    // 检查是否有相关预约
    const relatedBookings = await prisma.booking.count({
      where: {
        therapistId: id,
      },
    });

    if (relatedBookings > 0) {
      return apiError(
        'RELATED_BOOKINGS',
        `无法删除此按摩师，存在 ${relatedBookings} 个相关预约记录`,
        400
      );
    }

    // 删除按摩师（级联删除翻译）
    await prisma.therapist.delete({
      where: { id },
    });

    return apiSuccess(null, '按摩师删除成功');
  } catch (error) {
    console.error('Error deleting therapist:', error);
    return apiError('SERVER_ERROR', '删除按摩师失败', 500);
  }
}