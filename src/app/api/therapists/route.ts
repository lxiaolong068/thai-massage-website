import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { apiSuccess, apiError } from '@/lib/api-response';

// 指定为动态路由
export const dynamic = 'force-dynamic';

// 获取备用按摩师数据
function getFallbackTherapists(locale: string) {
  return [
    {
      id: '1',
      name: 'Nattaya',
      imageUrl: '/images/placeholder-therapist.jpg',
      specialties: ['Oil Massage'],
      experienceYears: 3,
      workStatus: 'WORKING',
      bio: 'Professional massage therapist with 3 years of experience',
      specialtiesTranslation: ['Oil Massage'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Somchai',
      imageUrl: '/images/placeholder-therapist.jpg',
      specialties: ['Thai Massage', 'Oil Massage'],
      experienceYears: 5,
      workStatus: 'AVAILABLE',
      bio: 'Experienced therapist specializing in traditional Thai massage',
      specialtiesTranslation: ['Thai Massage', 'Oil Massage'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
}

// 处理图片URL地址，确保格式正确
function sanitizeImageUrl(url: string | null | undefined): string {
  // 如果URL为空或无效，返回默认图片
  if (!url) {
    return '/images/placeholder-therapist.jpg';
  }
  
  // 处理URL中的危险格式，例如 /http://
  if (url.startsWith('/http')) {
    console.warn('检测到错误格式的URL:', url);
    return '/images/placeholder-therapist.jpg';
  }
  
  // 确保URL以斜杠开头但不是双斜杠开头
  url = url.replace(/^\/+/, '/');
  
  // 如果不是以斜杠或http开头，添加斜杠
  if (!url.startsWith('/') && !url.startsWith('http')) {
    url = `/${url}`;
  }
  
  return url;
}

// 获取所有按摩师
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // 始终使用英语
    const locale = 'en';
    
    // 检查是否处于构建过程
    const isBuildTime = process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'build';
    if (isBuildTime) {
      console.log('Build time detected, returning fallback data');
      return apiSuccess(getFallbackTherapists(locale));
    }
    
    // 尝试从数据库获取数据
    let therapists;
    try {
      therapists = await prisma.therapist.findMany({
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
    } catch (dbError) {
      console.error('Database error:', dbError);
      // 数据库错误时使用备用数据
      console.log('Using fallback data due to database error');
      return apiSuccess(getFallbackTherapists(locale));
    }

    // 格式化响应数据
    const formattedTherapists = therapists.map(therapist => {
      const translation = therapist.translations[0] || null;
      return {
        id: therapist.id,
        imageUrl: sanitizeImageUrl(therapist.imageUrl),
        specialties: therapist.specialties || [],
        experienceYears: therapist.experienceYears || 0,
        workStatus: therapist.workStatus || 'AVAILABLE',
        name: translation?.name || '',
        bio: translation?.bio || '',
        specialtiesTranslation: translation?.specialtiesTranslation || [],
        createdAt: therapist.createdAt,
        updatedAt: therapist.updatedAt,
      };
    });

    // 如果没有找到按摩师，返回备用数据
    if (formattedTherapists.length === 0) {
      console.log('No therapists found, using fallback data');
      return apiSuccess(getFallbackTherapists(locale));
    }

    return apiSuccess(formattedTherapists);
  } catch (error) {
    console.error('Error fetching therapists:', error);
    // 返回备用数据而不是错误
    const locale = 'en';
    console.log('Using fallback data due to general error');
    return apiSuccess(getFallbackTherapists(locale));
  }
}

// 创建新按摩师
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl: rawImageUrl, specialties, experienceYears, workStatus, translations } = body;
    // 清理图片URL
    const imageUrl = sanitizeImageUrl(rawImageUrl);
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

// 所有错误消息已直接硬编码为英语