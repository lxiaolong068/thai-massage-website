import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 指定这是一个动态路由
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 获取所有管理员用户（不包括密码）
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json({
      success: true,
      data: admins,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
} 