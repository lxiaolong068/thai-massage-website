import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { apiSuccess, apiError } from '@/lib/api-response';

// 指定为动态路由
export const dynamic = 'force-dynamic';

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
    const locale = searchParams.get('locale') || 'en';
    
    // 从数据库获取数据
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

    return apiSuccess(formattedTherapists);
  } catch (error) {
    console.error('Error fetching therapists:', error);
    return apiError(
      'DATABASE_ERROR',
      'Failed to fetch therapists from database',
      500
    );
  }
}

// 创建新按摩师
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl: rawImageUrl, specialties, experienceYears, workStatus, translations } = body;
    // 清理图片URL
    const imageUrl = sanitizeImageUrl(rawImageUrl);

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
            create: translations.map((t: any) => ({
              locale: t.locale,
              name: t.name,
              bio: t.bio,
              specialtiesTranslation: t.specialtiesTranslation || [],
            }))
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
    
    return apiError(
      'SERVER_ERROR',
      'Error creating therapist. Please try again later.',
      500
    );
  }
}

// 批量删除按摩师
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return apiError(
        'INVALID_INPUT',
        'Invalid or empty therapist IDs',
        400
      );
    }

    // 使用事务删除按摩师及其关联数据
    await prisma.$transaction(async (tx) => {
      // 删除按摩师（级联删除会自动删除翻译）
      await tx.therapist.deleteMany({
        where: {
          id: {
            in: ids
          }
        }
      });
    });

    return apiSuccess(null, 'Therapists deleted successfully');
  } catch (error) {
    console.error('Error deleting therapists:', error);
    return apiError(
      'SERVER_ERROR',
      'Error deleting therapists. Please try again later.',
      500
    );
  }
}

// 批量更新按摩师
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, data } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0 || !data) {
      return apiError(
        'INVALID_INPUT',
        'Invalid input data',
        400
      );
    }

    // 使用事务更新按摩师
    const updatedTherapists = await prisma.$transaction(async (tx) => {
      const updates = ids.map(id =>
        tx.therapist.update({
          where: { id },
          data: {
            ...data,
            updatedAt: new Date()
          },
          include: {
            translations: true
          }
        })
      );

      return await Promise.all(updates);
    });

    return apiSuccess(updatedTherapists, 'Therapists updated successfully');
  } catch (error) {
    console.error('Error updating therapists:', error);
    return apiError(
      'SERVER_ERROR',
      'Error updating therapists. Please try again later.',
      500
    );
  }
}