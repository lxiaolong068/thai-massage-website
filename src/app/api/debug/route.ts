import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
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