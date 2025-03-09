'use client';

import { createLocalizedPathnamesNavigation } from 'next-intl/navigation';
import { locales } from '@/i18n/config';

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
};

// 创建本地化的导航工具
export const { Link, redirect, usePathname, useRouter } =
  createLocalizedPathnamesNavigation({ locales, pathnames }); 