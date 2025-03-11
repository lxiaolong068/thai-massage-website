import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // 获取服务数量
    const servicesCount = await prisma.service.count();
    
    // 获取按摩师数量
    const therapistsCount = await prisma.therapist.count();
    
    // 获取预约数量
    const bookingsCount = await prisma.booking.count();
    
    // 获取待确认预约数量
    const pendingBookingsCount = await prisma.booking.count({
      where: {
        status: 'PENDING',
      },
    });
    
    // 获取留言数量
    const messagesCount = await prisma.message.count();
    
    // 获取未读留言数量
    const unreadMessagesCount = await prisma.message.count({
      where: {
        status: 'UNREAD',
      },
    });
    
    // 返回统计数据
    return NextResponse.json({
      success: true,
      data: {
        servicesCount,
        therapistsCount,
        bookingsCount,
        pendingBookingsCount,
        messagesCount,
        unreadMessagesCount,
      },
    });
  } catch (error) {
    console.error('获取仪表盘数据失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: '服务器错误，请稍后再试',
        },
      },
      { status: 500 }
    );
  }
} 