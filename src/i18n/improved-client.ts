'use client';

import { createTranslator } from 'next-intl';
import { useEffect, useState } from 'react';

// 定义翻译消息类型
type TranslationMessages = Record<string, any>;

// 创建以语言为键，翻译对象为值的缓存
const translationsCache: Record<string, TranslationMessages> = {};

/**
 * 加载指定语言的翻译
 */
export async function loadTranslations(locale: string): Promise<TranslationMessages> {
  if (translationsCache[locale]) {
    return translationsCache[locale];
  }
  
  try {
    const messages = (await import(`./messages/${locale}.json`)).default;
    translationsCache[locale] = messages;
    return messages;
  } catch (error) {
    console.error(`Error loading translations for ${locale}:`, error);
    // 回退到英语
    if (locale !== 'en') {
      return loadTranslations('en');
    }
    return {} as TranslationMessages;
  }
}

/**
 * 深度访问对象属性
 */
function deepGet(obj: any, path: string, defaultValue?: any): any {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === undefined || result === null) {
      return defaultValue;
    }
    result = result[key];
  }
  
  return result !== undefined ? result : defaultValue;
}

/**
 * 定义翻译器类型
 */
export interface ImprovedClientTranslator {
  t: (key: string, params?: Record<string, any>, defaultValue?: string) => string;
}

/**
 * 创建服务器/客户端一致的翻译器
 * 在服务器端渲染时使用默认值，避免水合错误
 */
export function createImprovedTranslator(
  locale: string,
  namespace?: string
): ImprovedClientTranslator {
  // 创建翻译函数
  const t = (key: string, params: Record<string, any> = {}, defaultValue: string = ''): string => {
    try {
      // 如果有命名空间，添加前缀
      const fullKey = namespace ? `${namespace}.${key}` : key;
      
      // 尝试从缓存获取翻译
      const messages = translationsCache[locale];
      if (!messages) {
        return defaultValue;
      }
      
      // 尝试获取翻译
      const translation = deepGet(messages, fullKey);
      
      // 如果没有找到翻译，返回默认值
      if (translation === undefined) {
        return defaultValue;
      }
      
      // 如果有参数，替换占位符
      if (Object.keys(params).length > 0) {
        return Object.entries(params).reduce(
          (result, [key, value]) => result.replace(new RegExp(`{${key}}`, 'g'), String(value)),
          translation
        );
      }
      
      return translation;
    } catch (error) {
      console.error(`Translation error for key "${key}":`, error);
      return defaultValue;
    }
  };
  
  return { t };
}

/**
 * React Hook，提供同构的翻译功能
 * 在服务器端渲染时使用默认值，客户端渲染时使用实际翻译
 */
export function useImprovedTranslator(
  locale: string,
  namespace?: string
): { t: (key: string, defaultValue: string, params?: Record<string, any>) => string } {
  const [isClient, setIsClient] = useState(false);
  const [messages, setMessages] = useState<TranslationMessages | null>(null);
  
  // 在客户端渲染后加载翻译
  useEffect(() => {
    setIsClient(true);
    
    // 加载翻译
    loadTranslations(locale)
      .then(loadedMessages => {
        setMessages(loadedMessages);
      })
      .catch(error => {
        console.error('Failed to load translations:', error);
      });
  }, [locale]);
  
  // 翻译函数
  const t = (key: string, defaultValue: string, params: Record<string, any> = {}): string => {
    // 如果在服务器端渲染或翻译尚未加载，直接返回默认值
    if (!isClient || !messages) {
      return defaultValue;
    }
    
    try {
      // 如果有命名空间，添加前缀
      const fullKey = namespace ? `${namespace}.${key}` : key;
      
      // 尝试获取翻译
      const translation = deepGet(messages, fullKey);
      
      // 如果没有找到翻译，返回默认值
      if (translation === undefined) {
        return defaultValue;
      }
      
      // 如果有参数，替换占位符
      if (Object.keys(params).length > 0) {
        return Object.entries(params).reduce(
          (result, [key, value]) => result.replace(new RegExp(`{${key}}`, 'g'), String(value)),
          translation
        );
      }
      
      return translation;
    } catch (error) {
      console.error(`Translation error for key "${key}":`, error);
      return defaultValue;
    }
  };
  
  return { t };
}
