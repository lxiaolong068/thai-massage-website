'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

type PageProps = {
  params: {
    locale: string;
  };
};

export default function TestPage({ params: { locale } }: PageProps) {
  // 使用翻译钩子，使用notFound命名空间作为示例
  const t = useTranslations('notFound');

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>国际化测试页面</h1>
      <p>这是一个支持国际化的测试页面。</p>
      <p>当前语言: <strong>{locale}</strong></p>
      
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-bold mb-2">翻译示例：</h2>
        <p><strong>标题:</strong> {t('title')}</p>
        <p><strong>消息:</strong> {t('message')}</p>
        <p><strong>返回主页:</strong> {t('backHome')}</p>
      </div>
      
      <div className="mt-6">
        <Link href="/" className="text-blue-500 hover:underline">
          返回首页
        </Link>
      </div>
    </div>
  );
} 