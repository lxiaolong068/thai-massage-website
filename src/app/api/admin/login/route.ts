import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/jwt';

// 指定这是一个动态路由
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  console.log('[Login API] 请求开始处理');
  
  try {
    // 获取请求体
    const body = await req.json();
    const { email, password } = body;
    
    console.log(`[Login API] 登录尝试: ${email}`);
    
    // 参数验证
    if (!email || !password) {
      console.log(`[Login API] 缺少参数: email=${!!email}, password=${!!password}`);
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
      console.log(`[Login API] 未找到管理员: ${email}`);
      return Response.json(
        { 
          success: false, 
          error: { message: '邮箱或密码不正确' } 
        }, 
        { status: 401 }
      );
    }
    
    console.log(`[Login API] 找到管理员: ${admin.id}, ${admin.name}`);
    
    // 验证密码
    const isValid = await bcrypt.compare(password, admin.password);
    
    console.log(`[Login API] 密码验证结果: ${isValid}`);
    
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
    
    console.log(`[Login API] 生成token: 长度=${token.length}`);
    
    // 更新最后登录时间
    await prisma.admin.update({
      where: { id: admin.id },
      data: { updatedAt: new Date() },
    });
    
    // 设置cookie和返回
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
    
    // 设置cookie
    const cookie = `admin_token=${token}; Path=/; Max-Age=86400; HttpOnly; SameSite=Lax`;
    response.headers.set('Set-Cookie', cookie);
    
    console.log(`[Login API] 登录成功: 设置Cookie=${!!cookie}`);
    
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