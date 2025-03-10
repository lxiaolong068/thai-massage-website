// 纯翻译工具，不依赖于 next-intl 的路由功能
'use client';

import { createTranslator } from 'next-intl';

// 定义翻译消息类型
type TranslationMessages = Record<string, any>;

// 创建以语言为键，翻译对象为值的缓存
const translationsCache: Record<string, TranslationMessages> = {};

// 语言加载状态跟踪
const loadingPromises: Record<string, Promise<TranslationMessages>> = {};

// 预加载所有翻译，提前返回翻译对象
export async function preloadTranslations(): Promise<void> {
  const locales = ['en', 'zh', 'th', 'ko'];
  await Promise.all(locales.map(locale => loadTranslations(locale)));
  console.log('All translations preloaded');
}

// 在模块加载时立即预加载，使翻译尽早可用
preloadTranslations().catch(err => console.error('Failed to preload translations:', err));

// 获取翻译对象，如果不存在则加载
export async function loadTranslations(locale: string): Promise<TranslationMessages> {
  if (translationsCache[locale]) {
    return translationsCache[locale];
  }
  
  // 如果已经有加载进行中的相同语言，复用承诺避免重复加载
  if (locale in loadingPromises) {
    return loadingPromises[locale];
  }
  
  // 创建并缓存加载承诺
  const loadPromise = (async () => {
    try {
      console.log(`Loading translations for ${locale}...`);
      const messages = (await import(`./messages/${locale}.json`)).default;
      translationsCache[locale] = messages;
      console.log(`Translations for ${locale} loaded successfully`);
      return messages;
    } catch (error) {
      console.error(`Error loading translations for ${locale}:`, error);
      // 回退到英语
      if (locale !== 'en') {
        return loadTranslations('en');
      }
      return {} as TranslationMessages;
    } finally {
      // 完成后清除加载中标记
      delete loadingPromises[locale];
    }
  })();
  
  // 存储加载承诺以便复用
  loadingPromises[locale] = loadPromise;
  return loadPromise;
}

// 直接从缓存获取翻译，无需等待加载
export function getTranslations(locale: string): TranslationMessages {
  if (!translationsCache[locale]) {
    // 如果尚未加载，立即触发加载但返回空对象
    loadTranslations(locale);
    console.warn(`Translations for ${locale} not loaded yet, loading now`);
    // 尝试回退到英语
    if (locale !== 'en' && translationsCache['en']) {
      console.warn(`Falling back to English translations`);
      return translationsCache['en'];
    }
    return {};
  }
  return translationsCache[locale];
}

// 深度访问对象属性
function deepGet(obj: any, path: string, defaultValue?: any): any {
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current === null || current === undefined) {
      return defaultValue;
    }
    current = current[part];
  }
  
  return current !== undefined ? current : defaultValue;
}

// 定义翻译器类型
type ClientTranslator = {
  t: (key: string, params?: Record<string, any>, defaultValue?: string) => string;
};

// 创建同步翻译函数
export function createClientTranslator(locale: string, namespace?: string): ClientTranslator {
  // 获取翻译消息对象
  const allMessages = getTranslations(locale);
  
  // 如果指定了命名空间，则从完整翻译中提取相应部分
  const messages = namespace 
    ? { [namespace]: deepGet(allMessages, namespace) }
    : allMessages;
  
  try {
    // 创建translator实例（如果可能）
    if (Object.keys(messages).length > 0 && (namespace ? deepGet(allMessages, namespace) : true)) {
      const translator = createTranslator({ locale, messages });
      
      return {
        t: (key: string, params?: Record<string, any>, defaultValue?: string) => {
          try {
            // 处理带命名空间的键
            const fullKey = namespace ? `${namespace}.${key}` : key;
            return translator(fullKey, params);
          } catch (error) {
            console.warn(`Translation error for key "${key}" in locale "${locale}":`, error);
            return defaultValue || key;
          }
        }
      };
    }
  } catch (error) {
    console.error(`Failed to create translator for ${locale}:`, error);
  }
  
  // 如果创建失败，或消息为空，提供一个简单的回退函数
  return {
    t: (key: string, params?: Record<string, any>, defaultValue?: string) => {
      // 尝试直接从消息对象中获取值
      if (namespace) {
        const value = deepGet(allMessages, `${namespace}.${key}`);
        if (value !== undefined) return value;
      } else {
        const value = deepGet(allMessages, key);
        if (value !== undefined) return value;
      }
      
      // 尝试从英语回退
      if (locale !== 'en' && translationsCache['en']) {
        const enMessages = translationsCache['en'];
        if (namespace) {
          const value = deepGet(enMessages, `${namespace}.${key}`);
          if (value !== undefined) return value;
        } else {
          const value = deepGet(enMessages, key);
          if (value !== undefined) return value;
        }
      }
      
      // 最后回退到默认值或键名
      return defaultValue || key;
    }
  };
} 