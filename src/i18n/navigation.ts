'use client';

import { createLocalizedPathnamesNavigation, createSharedPathnamesNavigation } from 'next-intl/navigation';
import { locales } from '@/i18n/config';

// 创建专门用于静态资源的导航工具
export const { usePathname: useStaticPathname } = createSharedPathnamesNavigation({
  locales
});

// 安全的路径名检查函数 - 在Header组件中替换usePathname
export function useSafePathname(): string {
  const rawPathname = useStaticPathname();
  
  // 检查是否是静态资源路径（避免作为locale处理）
  if (typeof rawPathname === 'string' && (
    rawPathname.match(/\.(jpg|jpeg|png|gif|svg|webp|js|css)$/i) ||
    rawPathname.includes('placeholder-')
  )) {
    // 对于静态资源路径，返回一个安全值
    console.log('检测到静态资源路径，避免locale处理:', rawPathname);
    return '/';
  }
  
  return rawPathname || '/';
}

// 定义路径名称映射
export const pathnames = {
  '/': '/',
  '/about': '/about',
  '/services': '/services',
  '/therapists': '/therapists',
  '/contact': '/contact',
  '/test': '/test',
  '/server-test': '/server-test',
  '/privacy-policy': '/privacy-policy',
  '/terms-of-service': '/terms-of-service',
  '/booking': '/booking',
  '/faq': '/faq',
  '/terms-conditions': '/terms-conditions',
  '/refund-policy': '/refund-policy',
};

// 创建本地化的导航工具
export const { Link, redirect, usePathname, useRouter } =
  createLocalizedPathnamesNavigation({ 
    locales, 
    pathnames,
    // 使用正确的类型设置 - localeDetection 只能是布尔值
    localeDetection: true
  }); 