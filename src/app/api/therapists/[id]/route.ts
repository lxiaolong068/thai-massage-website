import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { apiSuccess, apiError } from '@/lib/api-response';

// 获取单个按摩师
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { searchParams } = new URL(request.url);
    // 始终使用英语
    const locale = 'en';

    const therapist = await prisma.therapist.findUnique({
      where: { id },
      include: {
        translations: {
          where: { locale },
        },
      },
    });

    if (!therapist) {
      return apiError(
        'NOT_FOUND', 
        'Therapist not found', 
        404
      );
    }

    // 格式化响应数据
    const translation = therapist.translations[0] || null;
    const formattedTherapist = {
      id: therapist.id,
      imageUrl: therapist.imageUrl,
      specialties: therapist.specialties,
      experienceYears: therapist.experienceYears,
      workStatus: therapist.workStatus,
      name: translation?.name || '',
      bio: translation?.bio || '',
      specialtiesTranslation: translation?.specialtiesTranslation || [],
      createdAt: therapist.createdAt,
      updatedAt: therapist.updatedAt,
    };

    return apiSuccess(formattedTherapist);
  } catch (error) {
    console.error('Error fetching therapist:', error);
    // 始终使用英语
    const locale = 'en';
    return apiError(
      'SERVER_ERROR', 
      'Failed to fetch therapist. Please try again later.',
      500
    );
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
    const { imageUrl, specialties, experienceYears, workStatus, translations } = body;
    // 始终使用英语
    const locale = 'en';

    // 验证按摩师是否存在
    const existingTherapist = await prisma.therapist.findUnique({
      where: { id },
    });

    if (!existingTherapist) {
      return apiError(
        'NOT_FOUND', 
        'Therapist not found', 
        404
      );
    }

    // 验证必填字段
    if (!imageUrl || !specialties || !experienceYears || !translations) {
      return apiError(
        'INVALID_INPUT', 
        'Missing required fields', 
        400
      );
    }

    // 验证英语翻译数据
    const translation = translations.find((t: any) => t.locale === 'en');
    if (!translation || !translation.name || !translation.bio) {
      return apiError(
        'INVALID_INPUT',
        'Missing English translation data',
        400
      );
    }

    // 使用事务更新按摩师及其翻译
    const updatedTherapist = await prisma.$transaction(async (tx) => {
      // 更新按摩师基本信息
      const updated = await tx.therapist.update({
        where: { id },
        data: {
          imageUrl,
          specialties,
          experienceYears,
          workStatus: workStatus || 'AVAILABLE',
        },
      });

      // 处理翻译
      if (translations && Array.isArray(translations)) {
        // 先删除所有现有翻译
        await tx.therapistTranslation.deleteMany({
          where: { therapistId: id }
        });

        // 创建新的英语翻译
        await tx.therapistTranslation.create({
          data: {
            therapistId: id,
            locale: 'en',
            name: translation.name,
            bio: translation.bio,
            specialtiesTranslation: translation.specialtiesTranslation || [],
          },
        });
      }

      // 获取更新后的按摩师（包括翻译）
      const therapistWithTranslations = await tx.therapist.findUnique({
        where: { id },
        include: {
          translations: true,
        },
      });

      return therapistWithTranslations;
    });

    return apiSuccess(
      updatedTherapist, 
      'Therapist updated successfully'
    );
  } catch (error) {
    console.error('Error updating therapist:', error);
    // 始终使用英语
    const locale = 'en';
    return apiError(
      'SERVER_ERROR', 
      'Failed to update therapist. Please try again later.',
      500
    );
  }
}

// 删除按摩师
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    // 始终使用英语
    const locale = 'en';

    // 验证按摩师是否存在
    const existingTherapist = await prisma.therapist.findUnique({
      where: { id },
    });

    if (!existingTherapist) {
      return apiError(
        'NOT_FOUND', 
        'Therapist not found', 
        404
      );
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
        `Cannot delete this therapist, there are ${relatedBookings} related bookings`,
        400
      );
    }

    // 使用事务删除按摩师及其翻译
    await prisma.$transaction([
      // 先删除翻译
      prisma.therapistTranslation.deleteMany({
        where: {
          therapistId: id
        }
      }),
      // 再删除按摩师
      prisma.therapist.delete({
        where: { id },
      })
    ]);

    return apiSuccess(
      null, 
      'Therapist deleted successfully'
    );
  } catch (error) {
    console.error('Error deleting therapist:', error);
    // 始终使用英语
    const locale = 'en';
    return apiError(
      'SERVER_ERROR', 
      'Failed to delete therapist. Please try again later.',
      500
    );
  }
}

// 所有错误消息已直接硬编码为英语