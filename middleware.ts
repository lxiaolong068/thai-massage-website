import createMiddleware from 'next-intl/middleware';

// 定义支持的语言和默认语言
const locales = ['en', 'zh', 'th', 'ko'];
const defaultLocale = 'en';

// 创建中间件
export default createMiddleware({
  // 支持的语言列表
  locales,
  // 默认语言
  defaultLocale,
  // 检测并记住用户的语言偏好
  localeDetection: true,
  // 确保所有路由都有语言前缀
  localePrefix: 'always'
});

// 定义匹配的路径
export const config = {
  // 匹配所有路径，但排除以下特定路径:
  // - /_next/: Next.js内部路由
  // - /api/: API路由
  // - /images/: 静态图片资源
  // - /favicon.ico: 网站图标
  matcher: ['/((?!api|_next|images|favicon.ico).*)']
}; 