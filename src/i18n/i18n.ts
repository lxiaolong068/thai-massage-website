import { getRequestConfig } from 'next-intl/server';

// 支持的语言
const locales = ['en', 'zh', 'th', 'ko'];
const defaultLocale = 'en';
const timeZone = 'Asia/Bangkok';

export default getRequestConfig(async ({ requestLocale }) => {
  // 获取请求的语言
  let locale = await requestLocale;
  
  // 确保是有效的语言代码
  if (!locale || !locales.includes(locale as any)) {
    locale = defaultLocale;
  }
  
  try {
    // 动态导入翻译文件
    const messages = (await import(`./messages/${locale}.json`)).default;
    
    return {
      locale,
      messages,
      timeZone
    };
  } catch (error) {
    console.error(`Error loading translations for ${locale}:`, error);
    
    // 回退到英语翻译
    if (locale !== defaultLocale) {
      const fallbackMessages = (await import(`./messages/${defaultLocale}.json`)).default;
      return { 
        locale: defaultLocale,
        messages: fallbackMessages,
        timeZone
      };
    }
    
    // 如果连英语翻译都加载不了，返回空对象
    return { 
      locale: defaultLocale,
      messages: {}, 
      timeZone 
    };
  }
}); 