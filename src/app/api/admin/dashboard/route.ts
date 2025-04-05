import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// 指定这是一个动态路由
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // 确保使用 Node.js 运行时

export async function GET(req: NextRequest) {
  try {
    // 1. 获取所有服务数量
    const servicesCount = await prisma.service.count();
    
    // 2. 获取所有治疗师数量
    const therapistsCount = await prisma.therapist.count();
    
    // 3. 获取所有预约数量
    const bookingsCount = await prisma.booking.count();
    
    // 4. 获取等待中的预约数量
    const pendingBookingsCount = await prisma.booking.count({
      where: {
        status: 'PENDING'
      }
    });
    
    // 5. 获取所有消息数量
    const messagesCount = await prisma.message.count();
    
    // 6. 获取未读消息数量
    const unreadMessagesCount = await prisma.message.count({
      where: {
        status: 'UNREAD'
      }
    });

    return Response.json({
      success: true,
      data: {
        services: servicesCount,
        therapists: therapistsCount,
        bookings: bookingsCount,
        pendingBookings: pendingBookingsCount,
        messages: messagesCount,
        unreadMessages: unreadMessagesCount
      }
    });
  } catch (error: any) {
    console.error('Dashboard API error:', error);
    return Response.json(
      {
        success: false,
        error: {
          message: error.message || 'Failed to get dashboard data',
          details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }
      },
      { status: 500 }
    );
  }
} 