import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 获取所有服务
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    
    const services = await prisma.service.findMany({
      include: {
        translations: {
          where: {
            locale,
          },
        },
      },
    });

    // 格式化响应数据
    const formattedServices = services.map(service => {
      const translation = service.translations[0] || null;
      return {
        id: service.id,
        price: service.price,
        duration: service.duration,
        imageUrl: service.imageUrl,
        name: translation?.name || '',
        description: translation?.description || '',
        slug: translation?.slug || '',
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedServices,
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to fetch services',
        },
      },
      { status: 500 }
    );
  }
}

// 创建新服务
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { price, duration, imageUrl, translations } = body;

    // 验证必填字段
    if (!price || !duration || !imageUrl || !translations || !Array.isArray(translations)) {
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

    // 创建服务及其翻译
    const service = await prisma.service.create({
      data: {
        price,
        duration,
        imageUrl,
        translations: {
          create: translations.map((translation: any) => ({
            locale: translation.locale,
            name: translation.name,
            description: translation.description,
            slug: translation.slug,
          })),
        },
      },
      include: {
        translations: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: service,
      message: 'Service created successfully',
    });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to create service',
        },
      },
      { status: 500 }
    );
  }
} 