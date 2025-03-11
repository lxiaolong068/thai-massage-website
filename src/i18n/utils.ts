// 共享工具函数

// 支持的语言列表
export const locales = ['en', 'zh', 'ko'] as const;
export type Locale = (typeof locales)[number];

// 默认语言
export const defaultLocale: Locale = 'en';

// 语言名称映射
export const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
  ko: '한국어'
}; 