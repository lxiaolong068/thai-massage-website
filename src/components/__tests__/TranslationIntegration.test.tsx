/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// 首先模拟翻译 Hook
jest.mock('@/i18n/improved-client', () => {
  return {
    useImprovedTranslator: jest.fn((locale, namespace) => {
      // 模拟翻译数据
      const translations = {
        en: {
          test: {
            title: 'Test Title',
            description: 'Test Description with {param}',
            button: 'Click Me'
          }
        },
        zh: {
          test: {
            title: '测试标题',
            description: '带有{param}的测试描述',
            button: '点击我'
          }
        }
      };
      
      // 创建翻译函数
      const t = (key: string, defaultValue: string, params: Record<string, any> = {}) => {
        try {
          const localeData = translations[locale as keyof typeof translations] || translations.en;
          const nsData = namespace ? (localeData as any)[namespace] : localeData;
          
          if (!nsData || !nsData[key]) return defaultValue;
          
          let result = nsData[key];
          
          // 处理参数替换
          if (params && Object.keys(params).length > 0) {
            return Object.entries(params).reduce(
              (str, [key, value]) => str.replace(new RegExp(`{${key}}`, 'g'), String(value)),
              result
            );
          }
          
          return result;
        } catch (error) {
          return defaultValue;
        }
      };
      
      return { t };
    })
  };
});

// 在测试文件中引入模拟后的模块
import { useImprovedTranslator } from '@/i18n/improved-client';

// 测试组件
const TestComponent = ({ locale = 'en' }: { locale?: string }) => {
  const { t } = useImprovedTranslator(locale, 'test');
  
  return (
    <div>
      <h1 data-testid="title">{t('title', 'Default Title')}</h1>
      <p data-testid="description">{t('description', 'Default Description', { param: 'value' })}</p>
      <button data-testid="button">{t('button', 'Default Button')}</button>
      <span data-testid="fallback">{t('nonexistent', 'Fallback Text')}</span>
    </div>
  );
};

describe('翻译组件集成测试', () => {
  // 每个测试前重置模拟
  beforeEach(() => {
    // 重置为原始的模拟实现
    (useImprovedTranslator as jest.Mock).mockImplementation((locale, namespace) => {
      // 模拟翻译数据
      const translations = {
        en: {
          test: {
            title: 'Test Title',
            description: 'Test Description with {param}',
            button: 'Click Me'
          }
        },
        zh: {
          test: {
            title: '测试标题',
            description: '带有{param}的测试描述',
            button: '点击我'
          }
        }
      };
      
      // 创建翻译函数
      const t = (key: string, defaultValue: string, params: Record<string, any> = {}) => {
        try {
          const localeData = translations[locale as keyof typeof translations] || translations.en;
          const nsData = namespace ? (localeData as any)[namespace] : localeData;
          
          if (!nsData || !nsData[key]) return defaultValue;
          
          let result = nsData[key];
          
          // 处理参数替换
          if (params && Object.keys(params).length > 0) {
            return Object.entries(params).reduce(
              (str, [key, value]) => str.replace(new RegExp(`{${key}}`, 'g'), String(value)),
              result
            );
          }
          
          return result;
        } catch (error) {
          return defaultValue;
        }
      };
      
      return { t };
    });
  });

  it('应该正确渲染英文翻译', () => {
    render(<TestComponent locale="en" />);
    
    expect(screen.getByTestId('title')).toHaveTextContent('Test Title');
    expect(screen.getByTestId('description')).toHaveTextContent('Test Description with value');
    expect(screen.getByTestId('button')).toHaveTextContent('Click Me');
    expect(screen.getByTestId('fallback')).toHaveTextContent('Fallback Text');
  });
  
  it('应该正确渲染中文翻译', () => {
    render(<TestComponent locale="zh" />);
    
    expect(screen.getByTestId('title')).toHaveTextContent('测试标题');
    expect(screen.getByTestId('description')).toHaveTextContent('带有value的测试描述');
    expect(screen.getByTestId('button')).toHaveTextContent('点击我');
    expect(screen.getByTestId('fallback')).toHaveTextContent('Fallback Text');
  });
  
  it('当语言不存在时应该回退到英文', () => {
    render(<TestComponent locale="fr" />);
    
    expect(screen.getByTestId('title')).toHaveTextContent('Test Title');
    expect(screen.getByTestId('description')).toHaveTextContent('Test Description with value');
    expect(screen.getByTestId('button')).toHaveTextContent('Click Me');
    expect(screen.getByTestId('fallback')).toHaveTextContent('Fallback Text');
  });
});

// 测试实际组件
import About from '@/components/About';

describe('About组件翻译测试', () => {
  // 在测试 About 组件前重置模拟
  beforeEach(() => {
    // 重置模拟实现，返回默认值
    (useImprovedTranslator as jest.Mock).mockImplementation((locale: string, namespace: string) => ({
      t: (key: string, defaultValue: string) => defaultValue
    }));
  });

  it('应该正确加载并使用默认翻译值', () => {
    const { getByText } = render(<About locale="en" />);
    
    // 验证组件使用了默认翻译值
    expect(getByText('About Us')).toBeInTheDocument();
    expect(getByText('Learn More About Us')).toBeInTheDocument();
  });
});
