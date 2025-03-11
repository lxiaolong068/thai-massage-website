import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Therapist not found',
          },
        },
        { status: 404 }
      );
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
    };

    return NextResponse.json({
      success: true,
      data: formattedTherapist,
    });
  } catch (error) {
    console.error('Error fetching therapist:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to fetch therapist',
        },
      },
      { status: 500 }
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
    const { imageUrl, specialties, experienceYears, translations } = body;

    // 验证按摩师是否存在
    const existingTherapist = await prisma.therapist.findUnique({
      where: { id },
    });

    if (!existingTherapist) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Therapist not found',
          },
        },
        { status: 404 }
      );
    }

    // 更新按摩师基本信息
    const updateData: any = {};
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (specialties !== undefined) updateData.specialties = specialties;
    if (experienceYears !== undefined) updateData.experienceYears = experienceYears;

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

    return NextResponse.json({
      success: true,
      data: therapistWithTranslations,
      message: 'Therapist updated successfully',
    });
  } catch (error) {
    console.error('Error updating therapist:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to update therapist',
        },
      },
      { status: 500 }
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

    // 验证按摩师是否存在
    const existingTherapist = await prisma.therapist.findUnique({
      where: { id },
    });

    if (!existingTherapist) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Therapist not found',
          },
        },
        { status: 404 }
      );
    }

    // 删除按摩师（级联删除翻译）
    await prisma.therapist.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Therapist deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting therapist:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to delete therapist',
        },
      },
      { status: 500 }
    );
  }
} 