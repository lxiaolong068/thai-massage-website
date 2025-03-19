import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { UserRole } from '@prisma/client';

// 需要保护的API路径
const protectedApiPaths = [
  '/api/services',
  '/api/therapists',
  '/api/bookings',
  '/api/shop-settings',
  '/api/messages',
];

// 管理员路径
const adminPaths = [
  '/admin',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 检查是否是管理员路径或受保护的API路径
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path));
  const isProtectedApiPath = protectedApiPaths.some(path => pathname.startsWith(path));
  
  // 如果不是管理员路径或受保护的API路径，则直接放行
  if (!isAdminPath && !isProtectedApiPath) {
    return NextResponse.next();
  }
  
  // 如果是登录页面，直接放行
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }
  
  // 获取自定义管理员会话 cookie
  const adminSession = request.cookies.get('admin_session');
  
  // 同时检查 NextAuth 令牌（兼容两种认证方式）
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  // 如果没有管理员会话 cookie 和 NextAuth 令牌，则重定向到登录页面或返回未授权错误
  if (!adminSession?.value && !token) {
    if (isAdminPath) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    } else {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Unauthorized access',
          },
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  }
  
  // 如果有管理员会话cookie，则直接放行（自定义认证方式）
  if (adminSession?.value) {
    return NextResponse.next();
  }
  
  // 检查NextAuth用户角色是否为管理员
  if (token && token.role !== UserRole.ADMIN) {
    if (isAdminPath) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    } else {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Insufficient permissions',
          },
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  }
  
  // 用户已认证且有权限，放行请求
  return NextResponse.next();
}

// 配置中间件应用的路径
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/services/:path*',
    '/api/therapists/:path*',
    '/api/bookings/:path*',
    '/api/shop-settings/:path*',
    '/api/messages/:path*',
  ],
};
