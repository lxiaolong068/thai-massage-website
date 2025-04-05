import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/jwt';

// 指定这是一个动态路由
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 获取请求体
    const body = await req.json();
    const { email, password } = body;
    
    // 参数验证
    if (!email || !password) {
      return Response.json(
        { 
          success: false, 
          error: { message: '邮箱和密码不能为空' } 
        }, 
        { status: 400 }
      );
    }
    
    // 查找管理员
    const admin = await prisma.admin.findUnique({
      where: { email },
    });
    
    if (!admin) {
      return Response.json(
        { 
          success: false, 
          error: { message: '邮箱或密码不正确' } 
        }, 
        { status: 401 }
      );
    }
    
    // 验证密码
    const isValid = await bcrypt.compare(password, admin.password);
    
    if (!isValid) {
      return Response.json(
        { 
          success: false, 
          error: { message: '邮箱或密码不正确' } 
        }, 
        { status: 401 }
      );
    }
    
    // 创建JWT令牌
    const token = signToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });
    
    // 更新最后登录时间
    await prisma.admin.update({
      where: { id: admin.id },
      data: { updatedAt: new Date() },
    });
    
    // 准备响应
    const response = Response.json({
      success: true,
      data: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        token,
      },
    });

    // 设置 HttpOnly cookie
    response.headers.set(
      'Set-Cookie',
      `admin_token=${token}; Path=/; Max-Age=86400; HttpOnly; SameSite=Lax; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''}`
    );

    return response;
  } catch (error: any) {
    console.error('[Login API] 登录出错:', error);
    
    return Response.json(
      {
        success: false,
        error: {
          message: '登录失败，请重试',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        },
      },
      { status: 500 }
    );
  }
} 