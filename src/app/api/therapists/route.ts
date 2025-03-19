import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { apiSuccess, apiError } from '@/lib/api-response';

// 获取所有按摩师
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // 始终使用英语
    const locale = 'en';
    
    const therapists = await prisma.therapist.findMany({
      include: {
        translations: {
          where: {
            locale,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // 格式化响应数据
    const formattedTherapists = therapists.map(therapist => {
      const translation = therapist.translations[0] || null;
      return {
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
    });

    // 如果没有找到按摩师，返回备用数据
    if (formattedTherapists.length === 0) {
      const fallbackTherapists = getFallbackTherapists(locale);
      return apiSuccess(fallbackTherapists);
    }

    return apiSuccess(formattedTherapists);
  } catch (error) {
    console.error('Error fetching therapists:', error);
    // 始终使用英语
    const locale = 'en';
    return apiError(
      'SERVER_ERROR', 
      'Error fetching therapists. Please try again later.',
      500
    );
  }
}

// 创建新按摩师
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, specialties, experienceYears, workStatus, translations } = body;
    // 始终使用英语
    const locale = 'en';

    // 验证必填字段
    if (!imageUrl || !specialties || !experienceYears || !translations || !Array.isArray(translations)) {
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

    // 创建按摩师及其英语翻译（使用事务确保原子性）
    const therapist = await prisma.$transaction(async (tx) => {
      // 创建按摩师
      const newTherapist = await tx.therapist.create({
        data: {
          imageUrl,
          specialties,
          experienceYears,
          workStatus: workStatus || 'AVAILABLE',
          translations: {
            create: {
              locale: 'en',
              name: translation.name,
              bio: translation.bio,
              specialtiesTranslation: translation.specialtiesTranslation || [],
            }
          }
        },
        include: {
          translations: true
        }
      });
      
      return newTherapist;
    });

    // 返回成功响应
    return apiSuccess(therapist, 'Therapist created successfully');
  } catch (error) {
    console.error('Error creating therapist:', error);
    // 始终使用英语
    const locale = 'en';
    
    return apiError(
      'SERVER_ERROR',
      'Error creating therapist. Please try again later.',
      500
    );
  }
}

// 批量操作按摩师 - 更新
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, data } = body;
    // 始终使用英语
    const locale = 'en';

    // 验证必填字段
    if (!ids || !Array.isArray(ids) || ids.length === 0 || !data) {
      return apiError(
        'INVALID_INPUT',
        'Invalid batch operation request',
        400
      );
    }
    
    // 验证 workStatus 值
    if (data.workStatus && !['AVAILABLE', 'WORKING'].includes(data.workStatus)) {
      return apiError(
        'INVALID_INPUT',
        'Invalid work status value. Must be either AVAILABLE or WORKING',
        400
      );
    }

    // 验证 ID 是否存在
    const existingTherapists = await prisma.therapist.findMany({
      where: {
        id: {
          in: ids
        }
      },
      select: {
        id: true
      }
    });

    const existingIds = existingTherapists.map(t => t.id);
    const nonExistingIds = ids.filter(id => !existingIds.includes(id));

    if (existingIds.length === 0) {
      return apiError(
        'NOT_FOUND',
        'None of the specified therapists were found',
        404
      );
    }

    // 批量更新按摩师
    const updateResult = await prisma.therapist.updateMany({
      where: {
        id: {
          in: existingIds
        }
      },
      data: data
    });

    // 构建响应消息
    let message;
    if (nonExistingIds.length > 0) {
      message = `Successfully updated ${updateResult.count} therapists. ${nonExistingIds.length} therapists were not found.`;
    } else {
      message = `Successfully updated ${updateResult.count} therapists`;
    }

    return apiSuccess({
      count: updateResult.count,
      notFound: nonExistingIds.length > 0 ? nonExistingIds : undefined
    }, message);
  } catch (error) {
    console.error('Error performing batch update operation:', error);
    try {
      const body = request.clone().json(); // 克隆请求以避免多次读取body
      body.then(data => console.error('Request body:', data));
    } catch (e) {
      console.error('Failed to log request body:', e);
    }
    // 始终使用英语
    const locale = 'en';
    return apiError(
      'SERVER_ERROR', 
      'Failed to update therapist. Please try again later.',
      500
    );
  }
}

// 批量操作按摩师 - 删除
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = body;
    // 始终使用英语
    const locale = 'en';

    // 验证必填字段
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return apiError(
        'INVALID_INPUT',
        'Invalid batch delete request',
        400
      );
    }

    // 检查是否有关联的预约
    const relatedBookings = await prisma.booking.findMany({
      where: {
        therapistId: {
          in: ids
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
        'Cannot delete some therapists due to related bookings',
        400
      );
    }
    
    // 验证 ID 是否存在
    const existingTherapists = await prisma.therapist.findMany({
      where: {
        id: {
          in: ids
        }
      },
      select: {
        id: true
      }
    });

    const existingIds = existingTherapists.map(t => t.id);
    const nonExistingIds = ids.filter(id => !existingIds.includes(id));

    if (existingIds.length === 0) {
      return apiError(
        'NOT_FOUND',
        'None of the specified therapists were found',
        404
      );
    }

    // 批量删除按摩师（使用事务确保原子性）
    const deleteResult = await prisma.$transaction(async (tx) => {
      // 先删除翻译
      await tx.therapistTranslation.deleteMany({
        where: {
          therapistId: {
            in: existingIds
          }
        }
      });

      // 再删除按摩师
      return tx.therapist.deleteMany({
        where: {
          id: {
            in: existingIds
          }
        }
      });
    });

    // 构建响应消息
    let message;
    if (nonExistingIds.length > 0) {
      message = `Successfully deleted ${deleteResult.count} therapists. ${nonExistingIds.length} therapists were not found.`;
    } else {
      message = `Successfully deleted ${deleteResult.count} therapists`;
    }

    return apiSuccess({
      count: deleteResult.count,
      notFound: nonExistingIds.length > 0 ? nonExistingIds : undefined
    }, message);
  } catch (error) {
    console.error('Error performing batch delete operation:', error);
    try {
      const body = request.clone().json(); // 克隆请求以避免多次读取body
      body.then(data => console.error('Request body:', data));
    } catch (e) {
      console.error('Failed to log request body:', e);
    }
    // 始终使用英语
    const locale = 'en';
    return apiError(
      'SERVER_ERROR', 
      'Failed to delete therapist. Please try again later.',
      500
    );
  }
}

// 辅助函数：获取备用按摩师数据
function getFallbackTherapists(locale: string) {
  const fallbackData = [
    {
      id: 'fallback-1',
      imageUrl: '/images/therapists/therapist-1.jpg',
      specialties: ['Traditional Thai', 'Deep Tissue', 'Oil Massage'],
      experienceYears: 8,
      workStatus: 'AVAILABLE',
      name: locale === 'zh' ? '李娜' : locale === 'ko' ? '리나' : 'Li Na',
      bio: locale === 'zh' 
        ? '李娜拥有8年专业按摩经验，精通传统泰式按摩和深层组织按摩技术。' 
        : locale === 'ko' 
        ? '리나는 8년의 전문 마사지 경험을 가지고 있으며 전통 태국 마사지와 딥 티슈 마사지 기술을 전문으로 합니다.' 
        : 'Li Na has 8 years of professional massage experience, specializing in traditional Thai massage and deep tissue techniques.',
      specialtiesTranslation: locale === 'zh' 
        ? ['传统泰式按摩', '深层组织按摩', '精油按摩'] 
        : locale === 'ko' 
        ? ['전통 태국 마사지', '딥 티슈 마사지', '오일 마사지'] 
        : ['Traditional Thai', 'Deep Tissue', 'Oil Massage'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'fallback-2',
      imageUrl: '/images/therapists/therapist-2.jpg',
      specialties: ['Aromatherapy', 'Hot Stone', 'Reflexology'],
      experienceYears: 5,
      workStatus: 'AVAILABLE',
      name: locale === 'zh' ? '王明' : locale === 'ko' ? '왕밍' : 'Wang Ming',
      bio: locale === 'zh' 
        ? '王明专注于芳香疗法和热石按摩，为客户提供放松和治疗体验。' 
        : locale === 'ko' 
        ? '왕밍은 아로마테라피와 핫스톤 마사지에 중점을 두어 고객에게 휴식과 치료 경험을 제공합니다.' 
        : 'Wang Ming focuses on aromatherapy and hot stone massage, providing relaxing and therapeutic experiences for clients.',
      specialtiesTranslation: locale === 'zh' 
        ? ['芳香疗法', '热石按摩', '反射疗法'] 
        : locale === 'ko' 
        ? ['아로마테라피', '핫스톤 마사지', '반사요법'] 
        : ['Aromatherapy', 'Hot Stone', 'Reflexology'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  return fallbackData;
}

// 所有错误消息已直接硬编码为英语