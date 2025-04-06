import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { apiSuccess, apiError } from '@/lib/api-response';

// Define the expected structure for a single translation in the request body
type IncomingTranslation = {
  locale: string;
  name: string;
  bio: string;
  specialties: string[]; // Frontend sends 'specialties', map to 'specialtiesTranslation'
};

// Define the expected structure for the request body
type PutRequestBody = {
  imageUrl: string | null | undefined;
  experienceYears: number;
  workStatus: 'AVAILABLE' | 'WORKING';
  translations: IncomingTranslation[];
  // We no longer expect 'specialties' at the top level
};

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

// 获取单个按摩师的备用数据
function getFallbackTherapist(id: string, locale: string) {
  // 根据ID提供不同的备用数据
  if (id === '1' || id === 'new') {
    return {
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
    };
  } else {
    return {
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
    };
  }
}

// 获取单个按摩师
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { searchParams } = new URL(request.url);
    // 修正：从 searchParams 获取 locale
    const locale = searchParams.get('locale') || 'en'; // 从查询参数获取 locale，默认为 'en'

    // 对于"new"，返回空模板
    if (id === 'new') {
      return apiSuccess({
        id: 'new',
        imageUrl: '',
        specialties: [],
        experienceYears: 0,
        workStatus: 'AVAILABLE',
        name: '',
        bio: '',
        specialtiesTranslation: [], // 保持为空，前端会根据 locale 初始化
      });
    }

    // 检查是否处于构建过程
    const isBuildTime = process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'build';
    if (isBuildTime) {
      console.log('Build time detected, returning fallback data for locale:', locale);
      return apiSuccess(getFallbackTherapist(id, locale));
    }
    
    // 尝试从数据库获取数据
    let therapist;
    try {
      therapist = await prisma.therapist.findUnique({
        where: { id },
        include: {
          translations: {
            where: { locale }, // 使用从查询参数获取的 locale
            // 如果需要回退，可以考虑包含英文
            // where: { OR: [{ locale }, { locale: 'en' }] },
            // orderBy: { locale: 'desc' } // 确保 en 在后面
          },
        },
      });
    } catch (dbError) {
      console.error('Database error fetching therapist:', dbError);
      console.log(`Using fallback data for ${id} and locale ${locale} due to database error`);
      return apiSuccess(getFallbackTherapist(id, locale));
    }

    if (!therapist) {
      console.log(`Therapist ${id} not found, using fallback data for locale ${locale}`);
      return apiSuccess(getFallbackTherapist(id, locale));
    }

    // 格式化响应数据
    // 查找当前请求的 locale 对应的翻译
    const translation = therapist.translations.find(t => t.locale === locale);
    // 如果找不到，尝试查找英文翻译作为回退
    const fallbackTranslation = therapist.translations.find(t => t.locale === 'en');
    
    // 确定要使用的翻译，优先使用请求的 locale，否则回退到英文
    const usedTranslation = translation || fallbackTranslation;
    
    const formattedTherapist = {
      id: therapist.id,
      imageUrl: sanitizeImageUrl(therapist.imageUrl),
      // 主表的 specialties 仅用于非翻译场景或作为备用，这里我们主要用翻译表的
      // specialties: therapist.specialties || [], 
      experienceYears: therapist.experienceYears || 0,
      workStatus: therapist.workStatus || 'AVAILABLE',
      // 使用找到的翻译（或回退的英文翻译）
      name: usedTranslation?.name || '', // 如果连英文都没有，则为空
      bio: usedTranslation?.bio || '',
      // 使用翻译表中的 specialtiesTranslation 字段 (假设数据库字段名为 specialtiesTranslation)
      specialties: usedTranslation?.specialtiesTranslation || [], 
      createdAt: therapist.createdAt,
      updatedAt: therapist.updatedAt,
      // 可以加一个字段说明实际返回的 locale
      returnedLocale: usedTranslation?.locale || null
    };
    
    // 调试日志：显示最终返回的数据
    console.log(`Formatted therapist data for requested locale ${locale}:`, formattedTherapist);

    return apiSuccess(formattedTherapist);
  } catch (error) {
    console.error('Error in GET /api/therapists/[id]:', error);
    const id = params.id;
    // 确保即使在一般错误中也传递 locale
    const locale = new URL(request.url).searchParams.get('locale') || 'en'; 
    console.log(`Using fallback data for ${id} and locale ${locale} due to general error`);
    return apiSuccess(getFallbackTherapist(id, locale));
  }
}

// 更新按摩师
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    // Use the defined type for the request body
    const body: PutRequestBody = await request.json();
    // Destructure validated body fields
    const { imageUrl: rawImageUrl, experienceYears, workStatus, translations } = body;

    // Validate required top-level fields
    if (typeof experienceYears !== 'number' || !workStatus || !translations) {
       return apiError('INVALID_INPUT', 'Missing required fields (experienceYears, workStatus, translations)', 400);
    }
    
    // Validate translations array
    if (!Array.isArray(translations) || translations.length === 0) {
      return apiError('INVALID_INPUT', 'Translations array cannot be empty', 400);
    }

    // Validate English translation presence and basic content
    const englishTranslation = translations.find(t => t.locale === 'en');
    if (!englishTranslation || !englishTranslation.name) {
        return apiError('INVALID_INPUT', 'English translation with a name is required', 400);
    }

    // Sanitize the image URL
    const imageUrl = sanitizeImageUrl(rawImageUrl);

    // Check if in build process
    const isBuildTime = process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'build';
    if (isBuildTime) {
      console.log('Build time detected, returning success without DB operations');
      // Return mock data matching expected success format but include all locales from input potentially
      const mockReturnData = {
        id: id === 'new' ? 'mock-build-id' : id,
        imageUrl,
        experienceYears,
        workStatus,
        translations: translations.map(t => ({...t, specialtiesTranslation: t.specialties })), // mimic db field
      };
      return apiSuccess(
        mockReturnData,
        `Therapist ${id === 'new' ? 'creation' : 'update'} simulated successfully (build time)`
      );
    }

    // Prepare translation data for Prisma (map frontend 'specialties' to db 'specialtiesTranslation')
    const prismaTranslationsData = translations.map(t => ({
        locale: t.locale,
        name: t.name || '', // Ensure defaults
        bio: t.bio || '',   // Ensure defaults
        specialtiesTranslation: t.specialties || [], // Map frontend field to db field
    }));


    if (id === 'new') {
      // --- Create New Therapist ---
      const newTherapist = await prisma.$transaction(async (tx) => {
        const createdTherapist = await tx.therapist.create({
          data: {
            imageUrl: imageUrl, // Use sanitized URL
            experienceYears: experienceYears,
            workStatus: workStatus,
            // DO NOT save 'specialties' here anymore
          },
        });

        // Create all translations using createMany for efficiency
        await tx.therapistTranslation.createMany({
          data: prismaTranslationsData.map(t => ({
            ...t,
            therapistId: createdTherapist.id, // Link to the newly created therapist
          })),
        });

        return createdTherapist; // Return the main therapist record
      });

      return apiSuccess(
        { id: newTherapist.id }, // Return only the new ID on creation
        'Therapist created successfully'
      );

    } else {
      // --- Update Existing Therapist ---
      // First, check if the therapist actually exists
       const existingTherapist = await prisma.therapist.findUnique({
         where: { id },
         select: { id: true } // Select only id to check existence
       });

       if (!existingTherapist) {
         return apiError('NOT_FOUND', `Therapist with ID ${id} not found`, 404);
       }

      const updatedTherapist = await prisma.$transaction(async (tx) => {
        // 1. Update therapist main record
        const updated = await tx.therapist.update({
          where: { id },
          data: {
            imageUrl: imageUrl, // Use sanitized URL
            experienceYears: experienceYears,
            workStatus: workStatus,
             // DO NOT save 'specialties' here anymore
          },
        });

        // 2. Delete all existing translations for this therapist
        await tx.therapistTranslation.deleteMany({
          where: { therapistId: id },
        });

        // 3. Create the new set of translations using createMany
        await tx.therapistTranslation.createMany({
          data: prismaTranslationsData.map(t => ({
            ...t,
            therapistId: id, // Link to the existing therapist
          })),
        });

        return updated; // Return the updated main therapist record
      });

      return apiSuccess(
        { id: updatedTherapist.id }, // Return only the ID on update
        'Therapist updated successfully'
      );
    }

  } catch (error) {
    console.error('Error in PUT /api/therapists/[id]:', error);
    // Keep existing error handling for Prisma errors etc.
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Unique constraint violation, etc.
      if (error.code === 'P2002') {
         return apiError('CONFLICT', 'A record with this identifier already exists.', 409);
      }
       if (error.code === 'P2025') { // Record to update not found, though we check above now
         return apiError('NOT_FOUND', 'Therapist not found during update.', 404);
       }
    }
    // General server error
    return apiError(
      'SERVER_ERROR',
      'Failed to save therapist data. Please try again later.',
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

    // 检查是否处于构建过程
    const isBuildTime = process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'build';
    if (isBuildTime) {
      console.log('Build time detected, returning success without DB operations');
      return apiSuccess(
        null, 
        'Therapist deleted successfully (build time)'
      );
    }

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
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return apiError(
          'NOT_FOUND',
          'Therapist not found',
          404
        );
      }
      if (error.code === 'P2003') {
        return apiError(
          'RELATED_RECORDS',
          'Cannot delete this therapist because it is referenced by other records',
          400
        );
      }
    }
    return apiError(
      'SERVER_ERROR', 
      'Failed to delete therapist. Please try again later.',
      500
    );
  }
}

// 所有错误消息已直接硬编码为英语