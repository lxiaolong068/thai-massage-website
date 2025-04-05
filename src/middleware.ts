import { NextResponse, NextRequest } from 'next/server';

// 公共路径列表，无需验证即可访问
const publicPaths = [
  '/',
  '/api/services',
  '/api/therapists',
  '/api/bookings',
  '/api/messages',
  '/api/test/password',
  '/admin/login',
  '/api/admin/login',
  '/api/admin/dashboard',
  '/favicon.ico',
  '/_next',
  '/images',
  '/fonts',
  '/locales',
];

// 检查请求路径是否在公共路径列表中
function isPublicPath(path: string) {
  return publicPaths.some(publicPath => {
    // 如果是精确匹配或以路径开头
    return path === publicPath || 
           path.startsWith(`${publicPath}/`) || 
           (publicPath === '/_next' && path.startsWith('/_next/'));
  });
}

// 中间件函数
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  console.log(`[Middleware] 路径: ${path}`);
  
  // 公共路径可直接访问
  if (isPublicPath(path)) {
    console.log(`[Middleware] 公共路径: ${path}`);
    return NextResponse.next();
  }

  // 检查管理员路径
  const isAdminPath = path.startsWith('/admin') || path.startsWith('/api/admin');
  
  if (isAdminPath) {
    console.log(`[Middleware] 管理员路径: ${path}`);
    
    // 从cookie或header检查token
    const token = request.cookies.get('admin_token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
    console.log(`[Middleware] Token存在: ${!!token}`);
    
    // 如果没有token，重定向到登录页面
    if (!token) {
      if (path.startsWith('/api/')) {
        console.log(`[Middleware] API未授权: ${path}`);
        return NextResponse.json(
          { success: false, error: { message: 'Authentication required' } },
          { status: 401 }
        );
      } else {
        console.log(`[Middleware] 重定向到登录页面: ${path}`);
        const url = new URL('/admin/login', request.url);
        url.searchParams.set('callbackUrl', encodeURI(request.url));
        return NextResponse.redirect(url);
      }
    }
  }

  console.log(`[Middleware] 允许继续: ${path}`);
  return NextResponse.next();
}

// 配置中间件匹配的路径
export const config = {
  matcher: [
    // 匹配所有路径，但排除_next和图片资源
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
