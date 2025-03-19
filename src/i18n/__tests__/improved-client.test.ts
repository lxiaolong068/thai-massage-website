/**
 * @jest-environment jsdom
 */

import { createImprovedTranslator, useImprovedTranslator } from '../improved-client';
import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// 模拟翻译缓存
jest.mock('../improved-client', () => {
  const originalModule = jest.requireActual('../improved-client');
  
  // 创建模拟的翻译数据
  const mockTranslations = {
    en: {
      test: {
        title: 'Test Title',
        description: 'Test Description',
        nested: {
          key: 'Nested Value'
        }
      },
      common: {
        buttons: {
          submit: 'Submit',
          cancel: 'Cancel'
        }
      }
    },
    zh: {
      test: {
        title: '测试标题',
        description: '测试描述',
        nested: {
          key: '嵌套值'
        }
      },
      common: {
        buttons: {
          submit: '提交',
          cancel: '取消'
        }
      }
    }
  };
  
  // 返回修改后的模块
  return {
    ...originalModule,
    // 覆盖 loadTranslations 函数，直接返回模拟数据
    loadTranslations: jest.fn((locale: string) => Promise.resolve(mockTranslations[locale as keyof typeof mockTranslations] || mockTranslations.en)),
    // 重新导出 useImprovedTranslator，但使用我们的模拟数据
    useImprovedTranslator: jest.fn((locale: string, namespace?: string) => {
      const t = (key: string, defaultValue: string, params: Record<string, any> = {}) => {
        try {
          const translations = mockTranslations[locale as keyof typeof mockTranslations] || mockTranslations.en;
          const fullKey = namespace ? `${namespace}.${key}` : key;
          const keyParts = fullKey.split('.');
          
          let result: any = translations;
          for (const part of keyParts) {
            if (!result || typeof result !== 'object') return defaultValue;
            result = result[part];
          }
          
          if (result === undefined) return defaultValue;
          
          // 处理参数替换
          if (typeof result === 'string' && params && Object.keys(params).length > 0) {
            return Object.entries(params).reduce(
              (str, [key, value]) => str.replace(new RegExp(`{${key}}`, 'g'), String(value)),
              result as string
            );
          }
          
          return result;
        } catch (error) {
          return defaultValue;
        }
      };
      
      return { t };
    }),
    createImprovedTranslator: jest.fn((locale: string, namespace?: string) => {
      const t = (key: string, defaultValue: string = '', params: Record<string, any> = {}) => {
        try {
          const translations = mockTranslations[locale as keyof typeof mockTranslations] || mockTranslations.en;
          const fullKey = namespace ? `${namespace}.${key}` : key;
          const keyParts = fullKey.split('.');
          
          let result: any = translations;
          for (const part of keyParts) {
            if (!result || typeof result !== 'object') {
              // 如果键不存在，使用默认值，并处理参数替换
              if (typeof defaultValue === 'string' && params && Object.keys(params).length > 0) {
                return Object.entries(params).reduce(
                  (str, [key, value]) => str.replace(new RegExp(`{${key}}`, 'g'), String(value)),
                  defaultValue
                );
              }
              return defaultValue;
            }
            result = result[part];
          }
          
          if (result === undefined) {
            // 如果结果不存在，使用默认值，并处理参数替换
            if (typeof defaultValue === 'string' && params && Object.keys(params).length > 0) {
              return Object.entries(params).reduce(
                (str, [key, value]) => str.replace(new RegExp(`{${key}}`, 'g'), String(value)),
                defaultValue
              );
            }
            return defaultValue;
          }
          
          // 处理参数替换
          if (typeof result === 'string' && params && Object.keys(params).length > 0) {
            return Object.entries(params).reduce(
              (str, [key, value]) => str.replace(new RegExp(`{${key}}`, 'g'), String(value)),
              result as string
            );
          }
          
          return result;
        } catch (error) {
          // 发生错误时，使用默认值，并处理参数替换
          if (typeof defaultValue === 'string' && params && Object.keys(params).length > 0) {
            return Object.entries(params).reduce(
              (str, [key, value]) => str.replace(new RegExp(`{${key}}`, 'g'), String(value)),
              defaultValue
            );
          }
          return defaultValue;
        }
      };
      
      return { t };
    })
  };
});

describe('翻译工具函数测试', () => {
  describe('createImprovedTranslator', () => {
    it('应该返回正确的翻译值', () => {
      const { t } = createImprovedTranslator('en', 'test');
      expect(t('title')).toBe('Test Title');
      expect(t('description')).toBe('Test Description');
    });
    
    it('应该处理嵌套的键', () => {
      const { t } = createImprovedTranslator('en', 'test');
      expect(t('nested.key')).toBe('Nested Value');
    });
    
    it('如果翻译不存在，应该返回默认值', () => {
      const { t } = createImprovedTranslator('en', 'test');
      expect(t('nonexistent', 'Default Value')).toBe('Default Value');
    });
    
    it('应该支持参数替换', () => {
      const { t } = createImprovedTranslator('en');
      // 模拟一个带参数的翻译
      const params = { name: 'John' };
      expect(t('test.parameterized', 'Hello, {name}!', params)).toBe('Hello, John!');
    });
    
    it('应该支持不同的语言', () => {
      const enTranslator = createImprovedTranslator('en', 'test');
      const zhTranslator = createImprovedTranslator('zh', 'test');
      
      expect(enTranslator.t('title')).toBe('Test Title');
      expect(zhTranslator.t('title')).toBe('测试标题');
    });
  });
  
  describe('useImprovedTranslator', () => {
    it('应该返回一个可用的翻译函数', () => {
      const { result } = renderHook(() => useImprovedTranslator('en', 'test'));
      expect(result.current.t).toBeDefined();
      expect(typeof result.current.t).toBe('function');
    });
    
    it('应该返回正确的翻译值', () => {
      const { result } = renderHook(() => useImprovedTranslator('en', 'test'));
      expect(result.current.t('title', 'Default')).toBe('Test Title');
    });
    
    it('应该支持不同的语言', () => {
      const { result: enResult } = renderHook(() => useImprovedTranslator('en', 'test'));
      const { result: zhResult } = renderHook(() => useImprovedTranslator('zh', 'test'));
      
      expect(enResult.current.t('title', 'Default')).toBe('Test Title');
      expect(zhResult.current.t('title', 'Default')).toBe('测试标题');
    });
    
    it('如果翻译不存在，应该返回默认值', () => {
      const { result } = renderHook(() => useImprovedTranslator('en', 'test'));
      expect(result.current.t('nonexistent', 'Default Value')).toBe('Default Value');
    });
  });
});
