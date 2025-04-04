import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// 指定这是一个动态路由
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 验证输入
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: { message: 'Email and password are required' } },
        { status: 400 }
      );
    }

    // 查找用户 - 使用 findFirst 而不是 findUnique 来避免类型问题
    const user = await prisma.admin.findFirst({
      where: { email },
    });

    console.log('登录尝试:', email);
    console.log('找到用户:', user ? 'Yes' : 'No');

    if (!user) {
      // 获取所有管理员邮箱用于调试
      const allAdmins = await prisma.admin.findMany({
        select: { email: true }
      });
      console.log('系统中的管理员邮箱:', allAdmins.map(a => a.email));
      
      return NextResponse.json(
        { success: false, error: { message: 'Invalid email or password' } },
        { status: 401 }
      );
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('密码验证结果:', isValidPassword ? '成功' : '失败');

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: { message: 'Invalid email or password' } },
        { status: 401 }
      );
    }

    // 生成token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // 创建响应
    const response = NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        token,
      },
    });

    // 直接在响应中设置cookie
    console.log('LOGIN: 设置cookie admin_token，token长度:', token.length);
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });
    
    // 输出设置后的所有cookies
    console.log('LOGIN: 响应包含的所有cookies:', response.cookies.getAll().map(c => c.name));

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
} 