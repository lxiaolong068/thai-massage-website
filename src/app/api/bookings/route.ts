import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 获取所有预约
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    const status = searchParams.get('status');
    const date = searchParams.get('date');
    const therapistId = searchParams.get('therapistId');
    const serviceId = searchParams.get('serviceId');
    
    // 构建查询条件
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (date) {
      // 查询指定日期的预约
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }
    
    if (therapistId) {
      where.therapistId = therapistId;
    }
    
    if (serviceId) {
      where.serviceId = serviceId;
    }
    
    const bookings = await prisma.booking.findMany({
      where,
      include: {
        service: {
          include: {
            translations: {
              where: {
                locale,
              },
            },
          },
        },
        therapist: {
          include: {
            translations: {
              where: {
                locale,
              },
            },
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    // 格式化响应数据
    const formattedBookings = bookings.map(booking => {
      const serviceTranslation = booking.service.translations[0] || null;
      const therapistTranslation = booking.therapist.translations[0] || null;
      
      return {
        id: booking.id,
        date: booking.date,
        time: booking.time,
        status: booking.status,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        service: {
          id: booking.service.id,
          name: serviceTranslation?.name || '',
          price: booking.service.price,
          duration: booking.service.duration,
        },
        therapist: {
          id: booking.therapist.id,
          name: therapistTranslation?.name || '',
          imageUrl: booking.therapist.imageUrl,
        },
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedBookings,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to fetch bookings',
        },
      },
      { status: 500 }
    );
  }
}

// 创建新预约
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      serviceId, 
      therapistId, 
      date, 
      time, 
      customerName, 
      customerEmail, 
      customerPhone,
      customerAddress,
      notes
    } = body;

    // 验证必填字段
    if (!serviceId || !therapistId || !date || !time || !customerName || !customerEmail || !customerPhone) {
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

    // 验证服务是否存在
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
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

    // 验证按摩师是否存在
    const therapist = await prisma.therapist.findUnique({
      where: { id: therapistId },
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

    // 验证日期格式
    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Invalid date format',
          },
        },
        { status: 400 }
      );
    }

    // 生成订单号 - 格式: TS-年月日-随机数
    const today = new Date();
    const dateStr = today.getFullYear().toString().slice(-2) + 
                   (today.getMonth() + 1).toString().padStart(2, '0') + 
                   today.getDate().toString().padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const orderNumber = `TS-${dateStr}-${randomNum}`;

    // 创建预约
    const booking = await prisma.booking.create({
      data: {
        serviceId,
        therapistId,
        date: bookingDate,
        time,
        customerName,
        customerEmail,
        customerPhone,
        customerAddress: customerAddress || '',
        notes: notes || '',
        status: 'PENDING',
        orderNumber, // 添加订单号
      },
      include: {
        service: true,
        therapist: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...booking,
        orderNumber, // 确保返回订单号
      },
      message: 'Booking created successfully',
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to create booking',
        },
      },
      { status: 500 }
    );
  }
} 