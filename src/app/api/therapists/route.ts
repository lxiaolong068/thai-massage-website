import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedTherapists,
    });
  } catch (error) {
    console.error('Error fetching therapists:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to fetch therapists',
        },
      },
      { status: 500 }
    );
  }
}

// 创建新按摩师
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, specialties, experienceYears, translations } = body;

    // 验证必填字段
    if (!imageUrl || !specialties || !experienceYears || !translations || !Array.isArray(translations)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Missing required fields',
          },
        },
        { status: 400 }
      );
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

    return NextResponse.json({
      success: true,
      data: therapist,
      message: 'Therapist created successfully',
    });
  } catch (error) {
    console.error('Error creating therapist:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to create therapist',
        },
      },
      { status: 500 }
    );
  }
} 