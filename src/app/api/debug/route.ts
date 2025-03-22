import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 指定这是一个动态路由
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // 确保使用 Node.js 运行时

export async function GET() {
  // 在构建时返回静态响应
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json({
      success: true,
      message: "此调试API路由仅在运行时可用，不支持在构建时静态生成",
      isStaticBuild: true
    });
  }

  try {
    // 检查服务数据
    const servicesCount = await prisma.service.count();
    
    // 检查按摩师数据
    const therapistsCount = await prisma.therapist.count();
    
    // 检查用户数据
    const usersCount = await prisma.user.count();
    
    // 检查预约数据
    const bookingsCount = await prisma.booking.count();
    
    // 检查留言数据
    const messagesCount = await prisma.message.count();
    
    // 检查店铺设置数据
    const shopSettingsCount = await prisma.shopSetting.count();
    
    // 获取一些示例数据
    let services: any[] = [];
    let therapists: any[] = [];
    
    if (servicesCount > 0) {
      services = await prisma.service.findMany({
        take: 2,
        include: {
          translations: {
            where: {
              locale: 'zh',
            },
          },
        },
      });
    }
    
    if (therapistsCount > 0) {
      therapists = await prisma.therapist.findMany({
        take: 2,
        include: {
          translations: {
            where: {
              locale: 'zh',
            },
          },
        },
      });
    }
    
    return NextResponse.json({
      success: true,
      counts: {
        services: servicesCount,
        therapists: therapistsCount,
        users: usersCount,
        bookings: bookingsCount,
        messages: messagesCount,
        shopSettings: shopSettingsCount,
      },
      examples: {
        services,
        therapists,
      }
    });
  } catch (error) {
    console.error('API路由出错:', error);
    return NextResponse.json({
      success: false,
      error: String(error),
    }, { status: 500 });
  }
} 