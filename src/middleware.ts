import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { UserRole } from '@prisma/client';
import createI18nMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';
import createMiddleware from 'next-intl/middleware';
import { existsSync } from 'fs';
import { join } from 'path';

// 创建国际化中间件
const i18nMiddleware = createI18nMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
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

// 中间件函数
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 管理后台路径检查 - 直接跳过国际化处理
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    console.log('管理后台路径，跳过国际化处理:', pathname);
    return NextResponse.next();
  }
  
  // 判断是否是静态资源文件
  const isStaticFile = /\.(jpg|jpeg|png|gif|svg|ico|webp|js|css|mp4|webm|mp3|pdf|woff|woff2|ttf|eot)$/i.test(pathname);
  
  // 直接跳过所有静态文件请求
  if (isStaticFile) {
    console.log('静态文件请求，跳过处理:', pathname);
    return NextResponse.next();
  }
  
  // 完全排除占位图请求 - 处理所有占位图图片
  if (skipPaths.includes(pathname) || 
      pathname.includes('placeholder-therapist') || 
      pathname.includes('placeholder-avatar') || 
      pathname.includes('placeholder-image') || 
      pathname.match(/\/(en|zh|th|ko)\/.*placeholder-.*\.jpg$/)) {
    console.log('完全跳过占位图请求:', pathname);
    return NextResponse.next();
  }
  
  // 检查是否是有效的路径格式
  const pathSegments = pathname.split('/').filter(Boolean);
  // 如果第一个路径段是文件名而非有效locale，直接放行
  if (pathSegments.length > 0 && 
      !isValidLocale(pathSegments[0]) && 
      pathSegments[0].includes('.')) {
    console.log('检测到直接文件访问，跳过国际化处理:', pathname);
    return NextResponse.next();
  }
  
  // 处理上传相关的API请求
  if (pathname === '/api/upload') {
    return NextResponse.next();
  }
  
  // 输出所有请求的路径，方便调试
  console.log('中间件处理请求:', pathname);
  
  // 检查静态资源路径是否存在以 /locale/ 开头的 uploads 或 images 请求
  const staticResourceMatch = pathname.match(/^\/(en|zh|th|ko)\/(uploads|images)\/(.+)$/);
  if (staticResourceMatch) {
    const [, locale, resourceType, resourcePath] = staticResourceMatch;
    
    // 构建不带语言前缀的资源路径
    const newPathname = `/${resourceType}/${resourcePath}`;
    
    // 检查文件是否存在
    const fileExists = doesPublicFileExist(newPathname);
    console.log(`静态资源 ${newPathname} ${fileExists ? '存在' : '不存在'}`);
    
    // 构建新的URL
    const newUrl = new URL(request.url);
    newUrl.pathname = newPathname;
    
    console.log(`重写静态资源路径: ${pathname} -> ${newPathname}`);
    
    // 使用rewrite而不是redirect，这样浏览器URL保持不变
    return NextResponse.rewrite(newUrl);
  }
  
  // 直接访问静态资源路径处理
  const directStaticMatch = pathname.match(/^\/(uploads|images)\/(.+)$/);
  if (directStaticMatch) {
    const [, resourceType, resourcePath] = directStaticMatch;
    const fullPath = `/${resourceType}/${resourcePath}`;
    
    // 检查文件是否存在
    const fileExists = doesPublicFileExist(fullPath);
    console.log(`直接访问静态资源 ${fullPath} ${fileExists ? '存在' : '不存在'}`);
    
    if (!fileExists) {
      console.log(`静态资源不存在: ${fullPath}`);
    }
    
    return NextResponse.next();
  }
  
  // 检测是否是造成死循环的图片请求
  if (pathname.startsWith('/_next/image')) {
    const urlParam = request.nextUrl.searchParams.get('url');
    console.log('处理Next.js图片请求, url参数:', urlParam);
    
    // 如果参数中含有任何占位图路径，无需处理
    if (urlParam && (urlParam.includes('placeholder-therapist.jpg') || 
                   urlParam.includes('placeholder-avatar.jpg') || 
                   urlParam.includes('placeholder-image.jpg'))) {
      console.log('占位图请求，直接放行');
      return NextResponse.next();
    }
    
    // 如果是有问题的图片URL，直接重定向到占位图
    if (urlParam && (
        urlParam.includes('/http') || 
        urlParam.includes('/uploads/therapists') ||
        urlParam.includes('/example.com')
      )) {
      
      // 检查图片是否实际存在
      const cleanedUrl = urlParam.startsWith('/') ? urlParam : `/${urlParam}`;
      const fileExists = doesPublicFileExist(cleanedUrl);
      
      if (fileExists) {
        console.log('图片实际存在，直接放行:', cleanedUrl);
        return NextResponse.next();
      }
      
      console.log('拦截到错误格式或不存在的图片URL:', urlParam);
      // 重定向到占位图，确保路径不带语言前缀
      const placeholderUrl = new URL(request.nextUrl.origin);
      placeholderUrl.pathname = '/images/placeholder-therapist.jpg';
      console.log('重定向到占位图:', placeholderUrl.pathname);
      return NextResponse.redirect(placeholderUrl);
    }
  }

  // 检查是否需要跳过国际化处理
  const path = pathname;
  
  // 先检查是否是API请求
  if (path.startsWith('/api/')) {
    console.log('API请求，跳过国际化处理:', path);
    return NextResponse.next();
  }
  
  // 处理带语言前缀的API请求
  const apiWithLocaleMatch = pathname.match(/^\/(en|zh|th|ko)\/api\/(.+)$/);
  if (apiWithLocaleMatch) {
    const [, locale, apiPath] = apiWithLocaleMatch;
    const newPathname = `/api/${apiPath}`;
    
    // 构建新的URL
    const newUrl = new URL(request.url);
    newUrl.pathname = newPathname;
    
    console.log(`重写带语言前缀的API路径: ${pathname} -> ${newPathname}`);
    
    // 使用rewrite而不是redirect，这样浏览器URL保持不变
    return NextResponse.rewrite(newUrl);
  }
  
  // 处理带语言前缀的_next静态资源请求
  const nextStaticMatch = pathname.match(/^\/(en|zh|th|ko)\/_next\/(.+)$/);
  if (nextStaticMatch) {
    const [, locale, staticPath] = nextStaticMatch;
    const newPathname = `/_next/${staticPath}`;
    
    // 构建新的URL
    const newUrl = new URL(request.url);
    newUrl.pathname = newPathname;
    
    console.log(`重写带语言前缀的_next资源路径: ${pathname} -> ${newPathname}`);
    
    // 使用rewrite而不是redirect，这样浏览器URL保持不变
    return NextResponse.rewrite(newUrl);
  }
  
  // 检查其他自定义路径
  for (const customPath of customPaths) {
    if (path === customPath || path.startsWith(`${customPath}/`)) {
      console.log('跳过国际化处理，直接放行:', path);
      return NextResponse.next();
    }
  }

  // 对于其他路径，应用国际化中间件
  console.log('应用国际化中间件处理:', path);
  return i18nMiddleware(request);
}

// 配置中间件应用的路径
export const config = {
  matcher: [
    // 需要应用中间件的路径
    '/((?!api|_next|_vercel|favicon.ico|images|uploads).*)',
    // 处理特定语言前缀下的路径
    '/:locale/:path*'
  ],
};
