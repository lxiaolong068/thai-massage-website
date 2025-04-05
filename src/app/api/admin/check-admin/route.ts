import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 指定这是一个动态路由
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 获取所有管理员用户（包括密码的哈希值，用于调试）
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true, // 添加密码字段
        createdAt: true,
        updatedAt: true,
      }
    });

    // 打印调试信息
    console.log('系统中的管理员用户:', admins.map(admin => ({
      ...admin,
      password: admin.password.substring(0, 10) + '...' // 只显示密码哈希的前10个字符
    })));

    return NextResponse.json({
      success: true,
      data: admins.map(admin => ({
        ...admin,
        password: admin.password.substring(0, 10) + '...' // 只显示密码哈希的前10个字符
      })),
    });
  } catch (error) {
    console.error('Check admin error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
} 