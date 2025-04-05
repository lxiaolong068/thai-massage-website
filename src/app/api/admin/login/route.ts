import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/jwt';
import { setAuthCookie, setSessionCookie } from '@/lib/auth';

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
    
    // 创建用户信息对象
    const userData = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };
    
    let token;
    let jwtSuccess = true;
    
    // 尝试生成JWT令牌
    try {
      token = signToken(userData);
      // 设置JWT认证cookie
      setAuthCookie(token);
    } catch (jwtError) {
      console.error('JWT生成失败，切换到备选认证方式');
      jwtSuccess = false;
      token = null;
    }
    
    // 无论JWT是否成功，都设置备用会话认证
    // 这是一种降级策略，确保即使JWT出问题，用户仍然可以登录
    try {
      setSessionCookie(userData);
    } catch (sessionError) {
      console.error('设置备用会话失败');
      
      // 如果两种认证方式都失败，返回错误
      if (!jwtSuccess) {
        return Response.json(
          {
            success: false,
            error: {
              message: '认证系统暂时不可用，请稍后再试',
              details: process.env.NODE_ENV === 'development' ? 
                '所有认证方式都失败' : undefined,
            },
          },
          { status: 500 }
        );
      }
    }
    
    // 更新最后登录时间
    await prisma.admin.update({
      where: { id: admin.id },
      data: { updatedAt: new Date() },
    });
    
    // 准备响应
    const responseData = {
      success: true,
      data: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        token: token, // 可能为null
        authType: token ? 'jwt' : 'session',
      },
    };
    
    // 创建响应对象
    const response = Response.json(responseData);

    // 如果JWT认证成功，设置客户端cookie
    if (token) {
      response.headers.set(
        'Set-Cookie',
        `admin_token=${token}; Path=/; Max-Age=86400; HttpOnly; SameSite=Lax; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''}`
      );
    }
    
    return response;
  } catch (error: any) {
    console.error('登录API出错:', error);
    
    return Response.json(
      {
        success: false,
        error: {
          message: '登录失败，请重试',
          details: process.env.NODE_ENV === 'development' ? 
            (error instanceof Error ? error.message : String(error)) : undefined,
        },
      },
      { status: 500 }
    );
  }
} 