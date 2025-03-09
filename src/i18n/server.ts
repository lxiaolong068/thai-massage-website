// 服务器端翻译工具
import { createTranslator } from 'next-intl';

// 服务器端缓存翻译对象
const translationsCache: Record<string, any> = {};

// 获取翻译对象，如果不存在则加载
export async function loadTranslations(locale: string) {
  if (!translationsCache[locale]) {
    try {
      translationsCache[locale] = (await import(`./messages/${locale}.json`)).default;
    } catch (error) {
      console.error(`Error loading translations for ${locale}:`, error);
      // 回退到英语
      if (locale !== 'en') {
        return loadTranslations('en');
      }
      return {};
    }
  }
  return translationsCache[locale];
}

// 为服务器组件创建翻译函数
export async function createServerTranslator(locale: string, namespace?: string) {
  const messages = await loadTranslations(locale);
  
  const translator = createTranslator({
    locale,
    messages: namespace ? { [namespace]: messages[namespace] } : messages
  });
  
  return {
    t: (key: string, params?: Record<string, any>) => {
      try {
        return translator(namespace ? `${namespace}.${key}` : key, params);
      } catch (error) {
        console.error(`Translation error for key "${key}":`, error);
        return key;
      }
    }
  };
} 