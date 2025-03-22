import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get services count
    const servicesCount = await prisma.service.count();
    
    // Get therapists count
    const therapistsCount = await prisma.therapist.count();
    
    // Get bookings count
    const bookingsCount = await prisma.booking.count();
    
    // Get pending bookings count
    const pendingBookingsCount = await prisma.booking.count({
      where: {
        status: 'PENDING',
      },
    });
    
    // Get messages count
    const messagesCount = await prisma.message.count();
    
    // Get unread messages count
    const unreadMessagesCount = await prisma.message.count({
      where: {
        status: 'UNREAD',
      },
    });
    
    // Return statistics data
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
    console.error('Failed to fetch dashboard data:', error);
    // 提供更详细的错误信息
    const errorMessage = error instanceof Error 
      ? `${error.message}\n${error.stack || ''}` 
      : 'Unknown error';
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Server error, please try again later',
          details: errorMessage,
        },
      },
      { status: 500 }
    );
  }
} 