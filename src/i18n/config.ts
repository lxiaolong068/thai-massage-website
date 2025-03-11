// 定义支持的语言
export const locales = ['en', 'zh', 'ko'] as const;

// 从类型中提取出语言代码的类型
export type Locale = typeof locales[number];

// 设置默认语言
export const defaultLocale = locales[0];

// 时区设置
export const timeZone = 'Asia/Bangkok'; 