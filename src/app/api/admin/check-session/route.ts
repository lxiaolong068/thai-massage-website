import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

// 指定这是一个动态路由
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 获取cookie存储
    const cookieStore = cookies();
    
    // 获取admin_session cookie
    const sessionCookie = cookieStore.get('admin_session');
    
    // 如果没有会话cookie，返回未登录状态
    if (!sessionCookie) {
      return NextResponse.json({
        success: true,
        isLoggedIn: false,
      });
    }
    
    // 获取用户ID
    const userId = sessionCookie.value;
    
    // 查询用户是否存在
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true },
    });
    
    // 如果用户不存在，返回未登录状态
    if (!user) {
      // 清除无效的cookie
      cookieStore.delete('admin_session');
      
      return NextResponse.json({
        success: true,
        isLoggedIn: false,
      });
    }
    
    // 返回已登录状态和用户信息
    return NextResponse.json({
      success: true,
      isLoggedIn: true,
      user,
    });
  } catch (error) {
    console.error('Failed to check session:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Server error, please try again later',
        },
        isLoggedIn: false,
      },
      { status: 500 }
    );
  }
}
