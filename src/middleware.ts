import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { UserRole } from '@prisma/client';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '@/i18n/config';
import { existsSync } from 'fs';
import { join } from 'path';

// 创建国际化中间件
const i18nMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

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

// 创建 next-intl 国际化中间件
const intlMiddleware = createMiddleware({
  locales: ['en', 'zh', 'th', 'ko'],
  defaultLocale: 'en',
  localeDetection: true,
  localePrefix: 'always'
});

// 自定义路径处理 - 跳过国际化处理
const customPaths = [
  '/admin',
  '/api', // 所有API请求都跳过国际化处理
];

// 需要跳过的静态资源路径
const skipPaths = [
  '/images/placeholder-therapist.jpg',
  '/placeholder-therapist.jpg',
  '/placeholder-avatar.jpg',
  '/placeholder-image.jpg'
];

// 检查文件是否存在于public目录
function doesPublicFileExist(filePath: string): boolean {
  try {
    const fullPath = join(process.cwd(), 'public', filePath.startsWith('/') ? filePath.slice(1) : filePath);
    return existsSync(fullPath);
  } catch (err) {
    console.error('检查文件存在性失败:', err);
    return false;
  }
}

// 导入区域设置检查函数
function isValidLocale(locale: string): boolean {
  return ['en', 'zh', 'th', 'ko'].includes(locale);
}

// 不需要验证的路径
const publicPaths = [
  '/admin/login',
  '/admin/logout',
  '/api/admin/login',
  '/api/admin/logout',
  '/api/admin/check-session',
  '/_next',
  '/images',
  '/favicon.ico'
];

// 中间件函数
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  console.log('========= 中间件触发 =========');
  console.log('处理路径:', pathname);
  console.log('请求URL:', request.url);
  console.log('所有cookies:', request.cookies.getAll().map(c => `${c.name}=${c.value.substring(0,10)}...`));
  
  // 处理国际化路由
  const i18nResponse = i18nMiddleware(request);
  if (i18nResponse) return i18nResponse;

  // 检查是否是API请求
  if (pathname.startsWith('/api/')) {
    // API路由的认证检查
    if (pathname.startsWith('/api/admin/')) {
      const token = request.headers.get('authorization')?.split(' ')[1];
      if (!token) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
      // 这里可以添加token验证逻辑
    }
    return NextResponse.next();
  }

  // 检查是否是管理后台路径
  const isAdminPath = pathname.startsWith('/admin');
  
  // 如果不是管理后台路径，直接放行
  if (!isAdminPath) {
    console.log('非管理后台路径，直接放行');
    return NextResponse.next();
  }

  console.log('处理管理后台路径:', pathname);

  // 检查是否是公开路径
  const isPublicPath = publicPaths.some(path => 
    pathname.startsWith(path)
  );

  // 如果是公开路径，直接放行
  if (isPublicPath) {
    console.log('公开路径，直接放行:', pathname);
    
    // 输出匹配的公开路径
    const matchedPublicPaths = publicPaths.filter(path => pathname.startsWith(path));
    console.log('匹配的公开路径:', matchedPublicPaths);
    
    return NextResponse.next();
  }

  // 获取认证token
  const token = request.cookies.get('admin_token')?.value;
  console.log('Token存在状态:', !!token);
  if (token) {
    console.log('Token前20个字符:', token.substring(0, 20));
  }

  // 如果没有token，重定向到登录页面
  if (!token) {
    console.log('无token，重定向到登录页面');
    const loginUrl = new URL('/admin/login', request.url);
    // 只有在非API请求时才添加callbackUrl
    if (!pathname.startsWith('/api/')) {
      loginUrl.searchParams.set('callbackUrl', pathname);
    }
    console.log('重定向URL:', loginUrl.toString());
    return NextResponse.redirect(loginUrl);
  }

  console.log('验证通过，继续访问:', pathname);
  console.log('========= 中间件结束 =========');
  return NextResponse.next();
}

// 配置中间件应用的路径
export const config = {
  matcher: ['/((?!_next|.*\\..*).*)']
};
