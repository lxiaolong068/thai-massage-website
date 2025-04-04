import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function verifyAuth(request: NextRequest) {
  try {
    // 从cookie中获取token
    const token = request.cookies.get('admin_token')?.value;
    
    console.log('验证认证: token存在状态:', !!token);
    
    if (!token) {
      console.log('验证认证: 未找到token');
      return null;
    }

    // 验证token
    console.log('验证认证: 开始验证token, 前20个字符:', token.substring(0, 20));
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AdminUser;
      console.log('验证认证: token有效, 用户:', decoded.email);
      return decoded;
    } catch (jwtError) {
      console.error('验证认证: JWT验证失败:', jwtError);
      return null;
    }
  } catch (error) {
    console.error('验证认证: 出现异常:', error);
    return null;
  }
}

export function withAuth(handler: Function) {
  return async function(request: NextRequest) {
    const user = await verifyAuth(request);

    if (!user) {
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          error: { message: 'Unauthorized' } 
        }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // 将用户信息添加到请求中
    (request as any).user = user;
    
    return handler(request);
  }
}

export function generateToken(user: AdminUser) {
  console.log('生成token: 用户:', user.email);
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
  console.log('生成token: 完成, token长度:', token.length);
  return token;
}

export function setAuthCookie(token: string) {
  cookies().set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

export function clearAuthCookie() {
  cookies().delete('admin_token');
} 