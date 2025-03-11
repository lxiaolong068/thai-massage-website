import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 获取单个预约
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    const booking = await prisma.booking.findUnique({
      where: { id },
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
    });

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Booking not found',
          },
        },
        { status: 404 }
      );
    }

    // 格式化响应数据
    const serviceTranslation = booking.service.translations[0] || null;
    const therapistTranslation = booking.therapist.translations[0] || null;
    
    const formattedBooking = {
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

    return NextResponse.json({
      success: true,
      data: formattedBooking,
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to fetch booking',
        },
      },
      { status: 500 }
    );
  }
}

// 更新预约
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { 
      serviceId, 
      therapistId, 
      date, 
      time, 
      customerName, 
      customerEmail, 
      customerPhone,
      status
    } = body;

    // 验证预约是否存在
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Booking not found',
          },
        },
        { status: 404 }
      );
    }

    // 构建更新数据
    const updateData: any = {};
    
    if (serviceId !== undefined) {
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
      
      updateData.serviceId = serviceId;
    }
    
    if (therapistId !== undefined) {
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
      
      updateData.therapistId = therapistId;
    }
    
    if (date !== undefined) {
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
      
      updateData.date = bookingDate;
    }
    
    if (time !== undefined) updateData.time = time;
    if (customerName !== undefined) updateData.customerName = customerName;
    if (customerEmail !== undefined) updateData.customerEmail = customerEmail;
    if (customerPhone !== undefined) updateData.customerPhone = customerPhone;
    if (status !== undefined) updateData.status = status;

    // 更新预约
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        service: true,
        therapist: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedBooking,
      message: 'Booking updated successfully',
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to update booking',
        },
      },
      { status: 500 }
    );
  }
}

// 删除预约
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // 验证预约是否存在
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Booking not found',
          },
        },
        { status: 404 }
      );
    }

    // 删除预约
    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to delete booking',
        },
      },
      { status: 500 }
    );
  }
} 