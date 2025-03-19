'use client';

import React from 'react';
import { useImprovedTranslator } from '@/i18n/improved-client';
import Image from 'next/image';

type ExampleProps = {
  locale: string;
};

/**
 * 使用优化后的国际化配置的示例组件
 * 这个组件展示了如何使用新的翻译Hook，避免水合错误
 */
const ExampleOptimized = ({ locale }: ExampleProps) => {
  // 使用优化后的翻译Hook，自动处理服务器/客户端一致性
  const { t } = useImprovedTranslator(locale, 'home.example');
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            {t('title', '优化的国际化示例')}
          </h2>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">
              {t('benefits.title', '优化后的好处')}
            </h3>
            
            <ul className="list-disc pl-6 space-y-2">
              <li>{t('benefits.item1', '自动处理服务器/客户端水合一致性')}</li>
              <li>{t('benefits.item2', '简化组件代码，无需手动管理isClient状态')}</li>
              <li>{t('benefits.item3', '统一的翻译API，提高代码可维护性')}</li>
              <li>{t('benefits.item4', '更好的错误处理和回退机制')}</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">
              {t('usage.title', '使用方法')}
            </h3>
            
            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <pre className="text-sm overflow-x-auto">
                {`
// 导入优化后的翻译Hook
import { useImprovedTranslator } from '@/i18n/improved-client';

// 在组件中使用
const { t } = useImprovedTranslator(locale, 'namespace');

// 使用翻译函数
return <h1>{t('key', '默认值')}</h1>;
                `}
              </pre>
            </div>
            
            <p className="text-gray-700">
              {t('usage.description', '只需导入并使用useImprovedTranslator Hook，它会自动处理服务器端和客户端渲染的一致性，无需额外的状态管理。')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExampleOptimized;
