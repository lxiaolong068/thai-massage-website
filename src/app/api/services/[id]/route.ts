import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 获取单个服务
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        translations: {
          where: { locale },
        },
      },
    });

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Service not found',
          },
        },
        { status: 404 }
      );
    }

    // 格式化响应数据
    const translation = service.translations[0] || null;
    const formattedService = {
      id: service.id,
      price: service.price,
      duration: service.duration,
      imageUrl: service.imageUrl,
      name: translation?.name || '',
      description: translation?.description || '',
      slug: translation?.slug || '',
    };

    return NextResponse.json({
      success: true,
      data: formattedService,
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to fetch service',
        },
      },
      { status: 500 }
    );
  }
}

// 更新服务
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { price, duration, imageUrl, translations } = body;

    // 验证服务是否存在
    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Service not found',
          },
        },
        { status: 404 }
      );
    }

    // 更新服务基本信息
    const updateData: any = {};
    if (price !== undefined) updateData.price = price;
    if (duration !== undefined) updateData.duration = duration;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    // 更新服务
    const updatedService = await prisma.service.update({
      where: { id },
      data: updateData,
    });

    // 如果提供了翻译，更新翻译
    if (translations && Array.isArray(translations)) {
      for (const translation of translations) {
        const { locale, name, description, slug } = translation;
        
        // 查找现有翻译
        const existingTranslation = await prisma.serviceTranslation.findFirst({
          where: {
            serviceId: id,
            locale,
          },
        });

        if (existingTranslation) {
          // 更新现有翻译
          await prisma.serviceTranslation.update({
            where: { id: existingTranslation.id },
            data: {
              name: name !== undefined ? name : existingTranslation.name,
              description: description !== undefined ? description : existingTranslation.description,
              slug: slug !== undefined ? slug : existingTranslation.slug,
            },
          });
        } else {
          // 创建新翻译
          await prisma.serviceTranslation.create({
            data: {
              serviceId: id,
              locale,
              name: name || '',
              description: description || '',
              slug: slug || '',
            },
          });
        }
      }
    }

    // 获取更新后的服务（包括翻译）
    const serviceWithTranslations = await prisma.service.findUnique({
      where: { id },
      include: {
        translations: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: serviceWithTranslations,
      message: 'Service updated successfully',
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to update service',
        },
      },
      { status: 500 }
    );
  }
}

// 删除服务
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // 验证服务是否存在
    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Service not found',
          },
        },
        { status: 404 }
      );
    }

    // 删除服务（级联删除翻译）
    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to delete service',
        },
      },
      { status: 500 }
    );
  }
} 